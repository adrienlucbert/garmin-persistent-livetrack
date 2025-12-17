import { setFollowerEnabledNotifications } from '$lib/server/followers/followers';
import type { UUID } from 'crypto';
import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { m } from '$lib/paraglide/messages.js';

export const PUT: RequestHandler = async ({ request, locals, params }) => {
	if (!locals.user) {
		error(StatusCodes.UNAUTHORIZED, { message: m.user_not_logged_in() });
	}

	const body = await request.json()
	if (body.enabled === undefined) {
		error(StatusCodes.BAD_REQUEST, { message: m.missing_field_in_body({ field: 'enabled' }) })
	}

	const userUUID = params.user_uuid
	const followerUserUUID = locals.user.uuid

	try {
		await setFollowerEnabledNotifications(userUUID as UUID, followerUserUUID as UUID, body.enabled)
		return json({ success: true })
	} catch (err) {
		error(StatusCodes.INTERNAL_SERVER_ERROR, { message: m.failed_to_toggle_notifications({ action: (body.enabled ? m.enable() : m.disable()).toLowerCase() }) });
	}
};
