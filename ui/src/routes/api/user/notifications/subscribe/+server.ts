import { createWebpushSubscription } from '$lib/server/notifications/webpush';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { m } from '$lib/paraglide/messages.js';
import type { UUID } from 'crypto';

export const POST = (async ({ locals, request }) => {
	if (!locals.user) {
		error(401, m.user_not_logged_in());
	}

	const data = await request.json();

	if (!data.subscription) {
		error(400, m.missing_field_in_body({ field: 'subscription' }));
	}

	try {
		await createWebpushSubscription(locals.user.uuid as UUID, data.subscription)
		return json({ success: true });
	} catch (e) {
		error(500, { message: String(e) })
	}
}) satisfies RequestHandler;
