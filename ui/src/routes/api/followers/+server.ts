import { listFollowersStats } from '$lib/server/followers/followers';
import type { UUID } from 'crypto';
import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		error(401, 'User is not logged in');
	}

	try {
		return json(await listFollowersStats(locals.user.uuid as UUID))
	} catch (err) {
		error(500, 'Failed to list followers stats');
	}
};
