import { askVerifyEmail } from '$lib/server/auth/flows';
import { error } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { m } from '$lib/paraglide/messages.js';

export const POST = async ({ locals }) => {
	if (!locals.user) {
		throw error(StatusCodes.UNAUTHORIZED, m.user_not_logged_in())
	}
	if (!locals.user.email) {
		throw error(StatusCodes.UNAUTHORIZED, m.user_email_address_not_set())
	}
	if (locals.user.isEmailVerified) {
		throw error(StatusCodes.UNPROCESSABLE_ENTITY, m.user_email_address_already_verified())
	}

	await askVerifyEmail(locals.user.uuid, locals.user.email)
	return new Response()
};
