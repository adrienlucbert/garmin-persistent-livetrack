import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { requestFollow } from "$lib/server/followers/followers";
import type { UUID } from "crypto";
import { getAthleteLink } from "$lib/link";
import { getUserByNameOrUUID } from "$lib/server/auth/user";
import type { Users } from "$lib/server/db/schema";
import { m } from '$lib/paraglide/messages.js';

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
	await requestFollow(user.uuid as UUID, locals.user.uuid as UUID)
	throw redirect(303, getAthleteLink(user.name).href)
};
