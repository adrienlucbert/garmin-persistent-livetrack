import type { PageServerLoad } from "./$types";
import { type TrackingLinks } from '$lib/server/db/schema';
import { getTrackingLink } from '$lib/server/link/trackingLink';
import { redirect } from '@sveltejs/kit';
import type { UUID } from 'crypto';

export const load: PageServerLoad = async ({ url, locals }) => {
	if (!locals.user || !locals.session) {
		redirect(302, `/auth?follow=${encodeURIComponent(url.toString())}`)
	}

	let link: TrackingLinks | null = null

	try {
		const trackingLink = await getTrackingLink(locals.user.uuid as UUID)
		return { link: trackingLink }
	} catch { }

	return { link }
};
