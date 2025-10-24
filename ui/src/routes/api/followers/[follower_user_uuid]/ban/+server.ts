import type { UUID } from 'crypto';
import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { removeFollower } from '$lib/server/followers/followers';

export const PUT: RequestHandler = async ({ locals, params }) => {
	if (!locals.user) {
		error(401, 'User is not logged in');
	}

	const userUUID = locals.user.uuid
	const followerUserUUID = params.follower_user_uuid

	try {
		await removeFollower(userUUID as UUID, followerUserUUID as UUID)
		return json({ success: true })
	} catch (err) {
		error(500, 'Failed to deny follow request');
	}
};
