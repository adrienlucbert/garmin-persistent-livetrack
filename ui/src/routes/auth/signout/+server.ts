import { redirect, error } from '@sveltejs/kit';
import { invalidateSession, deleteSessionTokenCookie } from '$lib/server/auth/session';

export const POST = async (event) => {
	const followURL = event.url.searchParams.get('follow')

	if (!event.locals.session) {
		throw error(401);
	}

	await invalidateSession(event.locals.session.id);
	deleteSessionTokenCookie(event);

	redirect(302, followURL ?? '/auth');
};

export const GET = async (event) => {
	const followURL = event.url.searchParams.get('follow')

	if (!event.locals.session) {
		throw error(401);
	}

	await invalidateSession(event.locals.session.id);
	deleteSessionTokenCookie(event);

	redirect(302, followURL ?? '/auth');
};
