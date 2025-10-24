import type { UUID } from 'crypto';
import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { listVisits } from '$lib/server/visits/visits';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		error(401, 'User is not logged in');
	}

	try {
		return json(await listVisits(locals.user.uuid as UUID, new Date(new Date().setMonth(new Date().getMonth() - 3))))
	} catch (err) {
		error(500, 'Failed to list visits');
	}
};

