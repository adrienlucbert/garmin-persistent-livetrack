import { sequence } from '@sveltejs/kit/hooks';
import { validateSessionToken } from '$lib/server/auth/jwt';
import { setSessionTokenCookie, deleteSessionTokenCookie, SESSION_COOKIE_NAME } from '$lib/server/auth/session';
import { error, type Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { FeatureFlagsConfig as flags } from '$lib/featureFlags/config';
import { getTrackingLink } from '$lib/server/link/trackingLink';
import type { UUID } from 'crypto';

const handleFeatureFlags: Handle = ({ event, resolve }) => {
	if (!flags.ENABLE_OAUTH_GITHUB && event.url.pathname.startsWith('/auth/oauth/github')) {
		throw error(404)
	}
	if (!flags.ENABLE_OAUTH_GOOGLE && event.url.pathname.startsWith('/auth/oauth/google')) {
		throw error(404)
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

const handleTrackingLink: Handle = async ({ event, resolve }) => {
	try {
		const { user } = event.locals
		if (user) {
			const trackingLink = await getTrackingLink(user.uuid as UUID)
			event.locals.link = trackingLink
		}
	} catch { }

	return resolve(event);
};

export const handle: Handle = sequence(handleFeatureFlags, handleParaglide, handleAuth, handleTrackingLink);
