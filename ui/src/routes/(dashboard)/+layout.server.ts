import type { PublicUserWithTraits, Sessions } from '$lib/server/db/schema/index.js';
import { StatusCodes } from 'http-status-codes';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
	if (!locals.user || !locals.session) {
		redirect(StatusCodes.MOVED_TEMPORARILY, `/auth?follow=${encodeURIComponent(url.toString())}`)
	}

	return {
		user: locals.user as PublicUserWithTraits,
		session: locals.session! as Sessions,
	}
};
