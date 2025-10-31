import { removeFollower } from '$lib/server/followers/followers';
import type { UUID } from 'crypto';
import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { m } from '$lib/paraglide/messages.js';

export const DELETE: RequestHandler = async ({ locals, params }) => {
	if (!locals.user) {
		error(401, m.user_not_logged_in());
	}

	const userUUID = params.user_uuid
	const followerUserUUID = locals.user.uuid

	try {
		await removeFollower(userUUID as UUID, followerUserUUID as UUID)
		return json({ success: true })
	} catch (err) {
		error(500, m.failed_to_unfollow());
	}
};
