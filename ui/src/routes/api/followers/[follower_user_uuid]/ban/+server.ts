import type { UUID } from 'crypto';
import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { removeFollower } from '$lib/server/followers/followers';
import { m } from '$lib/paraglide/messages.js';

export const PUT: RequestHandler = async ({ locals, params }) => {
	if (!locals.user) {
		error(401, m.user_not_logged_in());
	}

	const userUUID = locals.user.uuid
	const followerUserUUID = params.follower_user_uuid

	try {
		await removeFollower(userUUID as UUID, followerUserUUID as UUID)
		return json({ success: true })
	} catch (err) {
		error(500, m.failed_to_answer_follow_request({ action: m.deny().toLowerCase() }));
	}
};
