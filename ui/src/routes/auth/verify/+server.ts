import { askVerifyEmail } from '$lib/server/auth/flows';
import { error } from '@sveltejs/kit';
import { m } from '$lib/paraglide/messages.js';

export const POST = async ({ locals }) => {
	if (!locals.user) {
		throw error(401, m.user_not_logged_in())
	}
	if (!locals.user.email) {
		throw error(401, m.user_email_address_not_set())
	}
	if (locals.user.isEmailVerified) {
		throw error(422, m.user_email_address_already_verified())
	}

	await askVerifyEmail(locals.user.uuid, locals.user.email)
	return new Response()
};
