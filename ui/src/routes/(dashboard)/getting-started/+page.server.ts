import type { PageServerLoad } from "./$types";
import { type TrackingLinks } from '$lib/server/db/schema';
import { getTrackingLinkForUser } from '$lib/server/link/trackingLink';
import { redirect } from '@sveltejs/kit';
import type { UUID } from 'crypto';
import { StatusCodes } from 'http-status-codes';

export const load: PageServerLoad = async ({ url, locals }) => {
	if (!locals.user || !locals.session) {
		redirect(StatusCodes.MOVED_TEMPORARILY, `/auth?follow=${encodeURIComponent(url.toString())}`)
	}

	let link: TrackingLinks | null = null

	try {
		const trackingLink = await getTrackingLinkForUser(locals.user.uuid as UUID)
		return { link: trackingLink }
	} catch { }

	return { link }
};
