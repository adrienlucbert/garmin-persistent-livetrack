import { askVerifyEmail } from '$lib/server/auth/flows';
import { error, json } from '@sveltejs/kit';

export const POST = async ({ locals }) => {
	if (!locals.user) {
		throw error(401, 'User is not logged in')
	}
	if (!locals.user.passwordTrait) {
		throw error(401, 'User email address is not set')
	}

	await askVerifyEmail({ uuid: locals.user.uuid, email: locals.user.passwordTrait.email })
	return json({ message: 'A new verify link was sent to your email.' })
};
