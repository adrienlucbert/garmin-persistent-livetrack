import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { signin } from '$lib/server/auth/flows';
import { validateEmail, validatePassword } from '$lib/validators';
import type { PageServerLoad } from "./$types";

export const actions: Actions = {
	signin: async (event) => {
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
			(await signin(email, password)).persist(event)
		} catch (message) {
			return fail(400, { message: String(message) })
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
