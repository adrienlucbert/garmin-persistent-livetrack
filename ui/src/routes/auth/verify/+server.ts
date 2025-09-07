import { askVerifyEmail } from '$lib/server/auth/flows/verify.js';
import { error, json } from '@sveltejs/kit';

export const POST = async ({ locals }) => {
	if (!locals.user) {
		return error(401, 'User is not logged in')
	}
	if (!locals.user.passwordTrait) {
		return error(401, 'User email address is not set')
	}

	await askVerifyEmail({ uuid: locals.user.uuid, email: locals.user.passwordTrait.email })
	return json({ message: 'A new verify link was sent to your email.' })
};
