import type { RequestHandler } from './$types';
import type { UUID } from 'crypto';
import { error, json } from '@sveltejs/kit';
import { m } from '$lib/paraglide/messages.js';
import { setUserPreferredLocale } from '$lib/server/auth/user';

export const PUT: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) {
		error(401, m.user_not_logged_in());
	}

	const body = await request.json()
	const locale = body.locale ?? error(400, { message: m.missing_field_in_body({ field: 'locale' }) })

	try {
		await setUserPreferredLocale(locals.user.uuid as UUID, locale)
		return json({ success: true })
	} catch (err) {
		error(500, m.failed_to_set_preferred_locale());
	}
};
