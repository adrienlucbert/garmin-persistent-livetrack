import { redirect, error } from '@sveltejs/kit';
import { invalidateSession, deleteSessionTokenCookie } from '$lib/server/auth/session';

export const POST = async (event) => {
	if (!event.locals.session) {
		throw error(401);
	}

	await invalidateSession(event.locals.session.id);
	deleteSessionTokenCookie(event);

	throw redirect(302, '/auth/signin');
};
