import type { UUID } from 'crypto';
import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { listVisits } from '$lib/server/visits/visits';
import { m } from '$lib/paraglide/messages.js';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		error(401, m.user_not_logged_in());
	}

	try {
		return json(await listVisits(locals.user.uuid as UUID, new Date(new Date().setMonth(new Date().getMonth() - 3))))
	} catch (err) {
		error(500, m.failed_to_list_visits());
	}
};

