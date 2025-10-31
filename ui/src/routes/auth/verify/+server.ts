import { askVerifyEmail } from '$lib/server/auth/flows';
import { error, json } from '@sveltejs/kit';
import { m } from '$lib/paraglide/messages.js';

export const POST = async ({ locals }) => {
	if (!locals.user) {
		throw error(401, m.user_not_logged_in())
	}
	if (!locals.user.passwordTrait) {
		throw error(401, m.user_email_address_not_set())
	}

	await askVerifyEmail({ uuid: locals.user.uuid, email: locals.user.passwordTrait.email })
	return json({ message: m.new_verify_link_sent() })
};
