import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { requestFollow } from "$lib/server/followers/followers";
import type { UUID } from "crypto";
import { getAthleteLink } from "$lib/link";

export const load: PageServerLoad = async ({ params, locals, url }) => {
	if (!/^[0-9A-Fa-f]{8}(-[0-9A-Fa-f]{4}){3}-[0-9A-Fa-f]{12}$/.test(params.identifier)) {
		return error(400, 'Athlete identifier is not a valid UUID.')
	}
	if (!locals.user) {
		throw redirect(302, `/auth?follow=${encodeURIComponent(url.toString())}`)
	}
	await requestFollow(params.identifier as UUID, locals.user.uuid as UUID)
	throw redirect(303, getAthleteLink(params.identifier as UUID).href)
};
