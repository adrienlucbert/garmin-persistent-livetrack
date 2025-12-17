import type { UUID } from 'crypto';
import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { listVisits } from '$lib/server/visits/visits';
import { StatusCodes } from 'http-status-codes';
import { m } from '$lib/paraglide/messages.js';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		error(StatusCodes.UNAUTHORIZED, m.user_not_logged_in());
	}

	try {
		return json(await listVisits(locals.user.uuid as UUID, new Date(new Date().setMonth(new Date().getMonth() - 3))))
	} catch (err) {
		error(StatusCodes.INTERNAL_SERVER_ERROR, m.failed_to_list_visits());
	}
};

