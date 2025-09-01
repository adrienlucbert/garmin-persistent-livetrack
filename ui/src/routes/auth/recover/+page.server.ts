import { validateEmail, validatePassword } from '$lib/validators';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { recoverPassword, resetPassword } from '$lib/server/auth/flows';
import { setSessionTokenCookie } from '$lib/server/auth/session';

export const actions: Actions = {
	recoverPassword: async (event) => {
		const formData = await event.request.formData()
		const identifier = formData.get('identifier')

		if (!validateEmail(identifier)) {
			return fail(400, { message: 'Invalid email address' });
		}

		try {
			await recoverPassword(identifier)
		} catch (message) {
			return fail(400, { message })
		}
	},

	resetPassword: async (event) => {
		const formData = await event.request.formData()
		const token = formData.get('token') as string
		const password = formData.get('password')
		const confirmPassword = formData.get('confirm_password')

		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password (min 8 characters)' })
		}

		if (password !== confirmPassword) {
			return fail(400, { message: 'Passwords do not match' })
		}

		try {
			const session = await resetPassword(token, password)
			setSessionTokenCookie(event, session.token, session.expiresAt)
		} catch (message) {
			return fail(400, { message })
		}

		return redirect(302, '/');
	}
}
