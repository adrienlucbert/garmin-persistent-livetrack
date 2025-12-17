import { createWebpushSubscription } from '$lib/server/notifications/webpush';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import type { UUID } from 'crypto';
import { StatusCodes } from 'http-status-codes';
import { m } from '$lib/paraglide/messages.js';

export const POST = (async ({ locals, request }) => {
	if (!locals.user) {
		error(StatusCodes.UNAUTHORIZED, m.user_not_logged_in());
	}

	const data = await request.json();

	if (!data.subscription) {
		error(StatusCodes.BAD_REQUEST, m.missing_field_in_body({ field: 'subscription' }));
	}

	try {
		await createWebpushSubscription(locals.user.uuid as UUID, data.subscription)
		return json({ success: true });
	} catch (e) {
		error(StatusCodes.INTERNAL_SERVER_ERROR, { message: String(e) })
	}
}) satisfies RequestHandler;
