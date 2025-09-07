import { validateEmail, validatePassword } from '$lib/validators';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { recoverPassword, resetPassword } from '$lib/server/auth/flows';
import { setSessionTokenCookie } from '$lib/server/auth/session';
import type { PageServerLoad } from "./$types";

export const actions: Actions = {
	recoverPassword: async (event) => {
		const formData = await event.request.formData()
		const email = formData.get('email')

		if (!validateEmail(email)) {
			return fail(400, { message: 'Invalid email address' });
		}

		try {
			await recoverPassword(email)
		} catch (message) {
			return fail(400, { message: String(message) })
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
			(await resetPassword(token, password)).persist(event)
		} catch (message) {
			return fail(400, { message: String(message) })
		}

		return redirect(302, '/');
	}
}

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}
	return {};
};
