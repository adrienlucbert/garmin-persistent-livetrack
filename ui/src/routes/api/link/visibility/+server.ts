import type { RequestHandler } from './$types';
import { setTrackingLinkVisibility } from '$lib/server/link/trackingLink';
import type { UUID } from 'crypto';
import { error, json } from '@sveltejs/kit';

export const PUT: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) {
		error(401, 'User is not logged in');
	}

	const body = await request.json()
	const is_public = body.is_public ?? error(400, { message: "Missing 'is_public' field in request body." })

	try {
		await setTrackingLinkVisibility(locals.user.uuid as UUID, is_public);
		return json({ success: true })
	} catch (err) {
		error(500, 'Failed to update visibility');
	}
};
