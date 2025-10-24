import { setFollowerStatus } from '$lib/server/followers/followers';
import { FollowStatus } from '$lib/types/followers';
import type { UUID } from 'crypto';
import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';

export const PUT: RequestHandler = async ({ locals, params }) => {
	if (!locals.user) {
		error(401, 'User is not logged in');
	}

	const userUUID = locals.user.uuid
	const followerUserUUID = params.follower_user_uuid

	try {
		await setFollowerStatus(userUUID as UUID, followerUserUUID as UUID, FollowStatus.DENIED)
		return json({ success: true })
	} catch (err) {
		error(500, 'Failed to approve follow request');
	}
};
