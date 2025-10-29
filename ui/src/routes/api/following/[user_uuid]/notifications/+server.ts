import { setFollowerEnabledNotifications } from '$lib/server/followers/followers';
import type { UUID } from 'crypto';
import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';

export const PUT: RequestHandler = async ({ request, locals, params }) => {
	if (!locals.user) {
		error(401, 'User is not logged in');
	}

	const body = await request.json()
	if (body.enabled === undefined) {
		error(400, { message: "Missing 'enabled' field in request body." })
	}

	const userUUID = params.user_uuid
	const followerUserUUID = locals.user.uuid

	try {
		await setFollowerEnabledNotifications(userUUID as UUID, followerUserUUID as UUID, body.enabled)
		return json({ success: true })
	} catch (err) {
		error(500, `Failed to ${body.enabled ? 'enable' : 'disable'} notifications`);
	}
};
