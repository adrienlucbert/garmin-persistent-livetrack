import { setFollowerStatus } from '$lib/server/followers/followers';
import { FollowStatus } from '$lib/types/followers';
import type { UUID } from 'crypto';
import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { m } from '$lib/paraglide/messages.js';

export const PUT: RequestHandler = async ({ locals, params }) => {
	if (!locals.user) {
		error(401, m.user_not_logged_in());
	}

	const userUUID = locals.user.uuid
	const followerUserUUID = params.follower_user_uuid

	try {
		await setFollowerStatus(userUUID as UUID, followerUserUUID as UUID, FollowStatus.DENIED)
		return json({ success: true })
	} catch (err) {
		error(500, m.failed_to_answer_follow_request({ action: m.deny().toLowerCase() }));
	}
};
