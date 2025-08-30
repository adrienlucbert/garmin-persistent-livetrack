import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { signup } from '$lib/server/auth/auth';
import { setSessionTokenCookie } from '$lib/server/auth/session';
import { validateEmail, validatePassword } from '$lib/validators';

export const actions: Actions = {
	signup: async (event) => {
		const formData = await event.request.formData()
		const identifier = formData.get('identifier')
		const password = formData.get('password')

		if (!validateEmail(identifier)) {
			return fail(400, { message: 'Invalid email address' });
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password (min 8 characters)' });
		}

		const session = await signup(identifier, password)

		if (!session) {
			// TODO: signup error messages
			return fail(400, { message: 'Failed to sign up' });
		}

		setSessionTokenCookie(event, session.token, session.expiresAt)
		return redirect(302, '/');
	},
}
