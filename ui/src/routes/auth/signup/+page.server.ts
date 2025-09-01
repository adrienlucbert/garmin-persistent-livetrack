import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { signup } from '$lib/server/auth/flows';
import { setSessionTokenCookie } from '$lib/server/auth/session';
import { validateEmail, validatePassword } from '$lib/validators';
import type { PageServerLoad } from "./$types";


export const actions: Actions = {
	signup: async (event) => {
		const formData = await event.request.formData()
		const email = formData.get('email')
		const password = formData.get('password')

		if (!validateEmail(email)) {
			return fail(400, { message: 'Invalid email address' });
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password (min 8 characters)' });
		}

		try {
			const session = await signup(email, password)
			setSessionTokenCookie(event, session.token, session.expiresAt)
		} catch (message) {
			return fail(400, { message });
		}

		return redirect(302, '/');
	},
}

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}
	return {};
};
