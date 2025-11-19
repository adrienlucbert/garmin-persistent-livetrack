import type { PageServerLoad } from "./$types";
import { getTrackingLink } from '$lib/server/link/trackingLink';
import { error, redirect } from '@sveltejs/kit';
import type { UUID } from 'crypto';

export const load: PageServerLoad = async ({ url, locals }) => {
	if (!locals.user || !locals.session) {
		redirect(302, `/auth?follow=${encodeURIComponent(url.toString())}`)
	}

	try {
		const trackingLink = await getTrackingLink(locals.user.uuid as UUID)
		return { link: trackingLink }
	} catch (e) {
		error(500, { message: String(e) })
	}
};
