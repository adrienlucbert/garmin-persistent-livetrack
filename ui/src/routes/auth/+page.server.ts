import { fail, redirect } from '@sveltejs/kit';
import { signin, signup, recoverPassword, resetPassword, verifyEmail } from '$lib/server/auth/flows';
import { validateEmail, validatePassword } from '$lib/validators';
import type { PageServerLoad, Actions } from "./$types";

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

	signup: async (event) => {
		const formData = await event.request.formData()
		const email = formData.get('email')
		const password = formData.get('password')
		const confirmPassword = formData.get('confirm_password')

		if (!validateEmail(email)) {
			return fail(400, { message: 'Invalid email address' });
		}

		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password (min 8 characters)' })
		}

		if (password !== confirmPassword) {
			return fail(400, { message: 'Passwords do not match' })
		}

		try {
			(await signup(email, password)).persist(event)
		} catch (message) {
			return fail(400, { message: String(message) });
		}

		return redirect(302, '/');
	},

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

export const load: PageServerLoad = async ({ url, locals }) => {
	if (url.searchParams.get('tab') === 'verify') {
		const token = url.searchParams.get('token')
		if (!token) {
			return redirect(302, "/auth");
		}

		try {
			await verifyEmail(token)
		} catch (message) {
			return { success: false, message: String(message) }
		}

		return { success: true }
	}

	if (locals.user) {
		return redirect(302, '/');
	}
	return {};
};
