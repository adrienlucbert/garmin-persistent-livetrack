import { redirect, error } from '@sveltejs/kit';
import { invalidateSession, deleteSessionTokenCookie } from '$lib/server/auth/session';
import { StatusCodes } from 'http-status-codes';

export const POST = async (event) => {
	const followURL = event.url.searchParams.get('follow')

	if (!event.locals.session) {
		throw error(StatusCodes.UNAUTHORIZED);
	}

	await invalidateSession(event.locals.session.id);
	deleteSessionTokenCookie(event);

	redirect(StatusCodes.MOVED_TEMPORARILY, followURL ?? '/auth');
};

export const GET = async (event) => {
	const followURL = event.url.searchParams.get('follow')

	if (!event.locals.session) {
		throw error(StatusCodes.UNAUTHORIZED);
	}

	await invalidateSession(event.locals.session.id);
	deleteSessionTokenCookie(event);

	redirect(StatusCodes.MOVED_TEMPORARILY, followURL ?? '/auth');
};
