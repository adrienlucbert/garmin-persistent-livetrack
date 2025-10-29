import { removeFollower } from '$lib/server/followers/followers';
import type { UUID } from 'crypto';
import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';

export const DELETE: RequestHandler = async ({ locals, params }) => {
	if (!locals.user) {
		error(401, 'User is not logged in');
	}

	const userUUID = params.user_uuid
	const followerUserUUID = locals.user.uuid

	try {
		await removeFollower(userUUID as UUID, followerUserUUID as UUID)
		return json({ success: true })
	} catch (err) {
		error(500, `Failed to unfollow user`);
	}
};
