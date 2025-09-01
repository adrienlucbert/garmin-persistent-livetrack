import { askVerifyEmail } from '$lib/server/auth/flows/verify.js';
import { error, json } from '@sveltejs/kit';

export const POST = async ({ locals }) => {
	if (!locals.user) {
		return error(401, 'User is not logged in')
	}

	await askVerifyEmail(locals.user)
	return json({ message: 'A new verify link was sent to your email.' })
};
