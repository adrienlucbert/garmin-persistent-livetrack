import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { createFollow } from "$lib/server/followers/followers";
import type { UUID } from "crypto";
import { getAthleteLink } from "$lib/link";
import { getUserByNameOrUUID } from "$lib/server/auth/user";
import { Action, type Users } from "$lib/server/db/schema";
import { m } from '$lib/paraglide/messages.js';
import { FollowStatus } from "$lib/types/followers";
import { invalidateActionToken, validateActionToken } from "$lib/server/auth/token";
import { decodeJWT } from "$lib/server/auth/jwt";
import { send } from "$lib/server/email/sender";
import { NewFollowRequest } from "$lib/server/email/templates";
import { env } from '$env/dynamic/public';
import { APP_NAME } from "$env/static/private";
import type { Locale } from "$lib/paraglide/runtime";

export const load: PageServerLoad = async ({ params, locals, url }) => {
	if (!locals.user) {
		throw redirect(302, `/auth?follow=${encodeURIComponent(url.toString())}`)
	}

	let user: Users | undefined
	try {
		user = await getUserByNameOrUUID(params.identifier)
		if (!user) {
			throw error(404, m.invalid_athlete_identifier())
		}
	} catch (err: any) {
		throw error(400, err)
	}

	if (locals.user.uuid === user.uuid) {
		// A user can't follow themself, redirect to their LiveTrack session
		throw redirect(303, getAthleteLink(user.name).href)
	}

	const token = url.searchParams.get('token')

	try {
		if (token) {
			// Follow token -> create approved follow
			const actionToken = await validateActionToken(token, Action.FOLLOW_USER)
			await createFollow(user.uuid as UUID, locals.user.uuid as UUID, FollowStatus.APPROVED)

			const payload = decodeJWT<{ uses: 'single' | 'multi' }>(actionToken.token)
			if (payload.uses === 'single') {
				await invalidateActionToken(token)
			}
		} else {
			// No follow token -> request follow
			await createFollow(user.uuid as UUID, locals.user.uuid as UUID, FollowStatus.PENDING)
			if (user.email && user.isEmailVerified) {
				await send(NewFollowRequest(locals.user.uuid), {
					username: locals.user.name,
					approveURL: `${env.PUBLIC_URL ?? 'http://localhost'}/api/followers/${locals.user.uuid}/approve`,
					denyURL: `${env.PUBLIC_URL ?? 'http://localhost'}/api/followers/${locals.user.uuid}/ban`,
					manageAccessURL: `${env.PUBLIC_URL ?? 'http://localhost'}/manage-access`,
					appName: APP_NAME
				}, user.email, user.preferredLocale)
			}
		}
	} catch (e) {
		throw error(400, { message: String(e) })
	}
	throw redirect(303, getAthleteLink(user.name).href)
};
