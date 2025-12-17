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
import { notify } from "$lib/server/notifications/notify";
import { Notification } from "$lib/types/notifications";
import { StatusCodes } from 'http-status-codes';

export const load: PageServerLoad = async ({ params, locals, url }) => {
	if (!locals.user) {
		throw redirect(StatusCodes.MOVED_TEMPORARILY, `/auth?follow=${encodeURIComponent(url.toString())}`)
	}

	let user: Users | undefined
	try {
		user = await getUserByNameOrUUID(params.identifier)
		if (!user) {
			throw error(StatusCodes.NOT_FOUND, m.invalid_athlete_identifier())
		}
	} catch (err: any) {
		throw error(StatusCodes.BAD_REQUEST, err)
	}

	if (locals.user.uuid === user.uuid) {
		// A user can't follow themself, redirect to their LiveTrack session
		throw redirect(StatusCodes.SEE_OTHER, getAthleteLink(user.name).href)
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
			await notify(Notification.FOLLOW_REQUEST, user, locals.user)
		}
	} catch (e) {
		throw error(StatusCodes.BAD_REQUEST, { message: String(e) })
	}
	throw redirect(StatusCodes.SEE_OTHER, getAthleteLink(user.name).href)
};
