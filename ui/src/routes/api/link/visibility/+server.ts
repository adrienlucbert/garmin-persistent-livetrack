import type { RequestHandler } from './$types';
import { setTrackingLinkVisibility } from '$lib/server/link/trackingLink';
import type { UUID } from 'crypto';
import { error, json } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { m } from '$lib/paraglide/messages.js';

export const PUT: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) {
		error(StatusCodes.UNAUTHORIZED, m.user_not_logged_in());
	}

	const body = await request.json()
	const is_public = body.is_public ?? error(StatusCodes.BAD_REQUEST, { message: m.missing_field_in_body({ field: 'is_public' }) })

	try {
		await setTrackingLinkVisibility(locals.user.uuid as UUID, is_public);
		return json({ success: true })
	} catch (err) {
		error(StatusCodes.INTERNAL_SERVER_ERROR, m.failed_to_update_visibility());
	}
};
