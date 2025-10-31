import { listFollowersStats } from '$lib/server/followers/followers';
import type { UUID } from 'crypto';
import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { m } from '$lib/paraglide/messages.js';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		error(401, m.user_not_logged_in());
	}

	try {
		return json(await listFollowersStats(locals.user.uuid as UUID))
	} catch (err) {
		error(500, m.failed_to_list_followers_stats());
	}
};
