import { sequence } from '@sveltejs/kit/hooks';
import { validateSessionToken } from '$lib/server/auth/jwt';
import { setSessionTokenCookie, deleteSessionTokenCookie, SESSION_COOKIE_NAME } from '$lib/server/auth/session';
import { error, type Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { FeatureFlagsConfig as flags } from '$lib/featureFlags/config';
import { env } from '$env/dynamic/private';
import { StatusCodes } from 'http-status-codes';

const handleLocals: Handle = async ({ event, resolve }) => {
	event.locals.appName = env.APP_NAME

	return resolve(event)
};

const handleFeatureFlags: Handle = ({ event, resolve }) => {
	if (!flags.ENABLE_OAUTH_GITHUB && event.url.pathname.startsWith('/auth/oauth/github')) {
		throw error(StatusCodes.NOT_FOUND)
	}
	if (!flags.ENABLE_OAUTH_GOOGLE && event.url.pathname.startsWith('/auth/oauth/google')) {
		throw error(StatusCodes.NOT_FOUND)
	}

	return resolve(event)
}

const handleParaglide: Handle = ({ event, resolve }) => paraglideMiddleware(event.request, ({ request, locale }) => {
	event.request = request;

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', locale)
	});
});

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(SESSION_COOKIE_NAME);

	if (!sessionToken) {
		event.locals.user = undefined;
		event.locals.session = undefined;
		return resolve(event);
	}

	try {
		const { user, ...session } = await validateSessionToken(sessionToken);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
		event.locals.user = user;
		event.locals.session = session;
	} catch {
		deleteSessionTokenCookie(event);
	}

	return resolve(event);
};

export const handle: Handle = sequence(handleLocals, handleFeatureFlags, handleParaglide, handleAuth);
