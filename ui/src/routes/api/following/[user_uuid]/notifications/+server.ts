import { setFollowerEnabledNotifications } from '$lib/server/followers/followers';
import type { UUID } from 'crypto';
import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { m } from '$lib/paraglide/messages.js';

export const PUT: RequestHandler = async ({ request, locals, params }) => {
	if (!locals.user) {
		error(401, { message: m.user_not_logged_in() });
	}

	const body = await request.json()
	if (body.enabled === undefined) {
		error(400, { message: m.missing_field_in_body({ field: 'enabled' }) })
	}

	const userUUID = params.user_uuid
	const followerUserUUID = locals.user.uuid

	try {
		await setFollowerEnabledNotifications(userUUID as UUID, followerUserUUID as UUID, body.enabled)
		return json({ success: true })
	} catch (err) {
		error(500, { message: m.failed_to_toggle_notifications({ action: (body.enabled ? m.enable() : m.disable()).toLowerCase() }) });
	}
};
