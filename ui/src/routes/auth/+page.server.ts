import { fail, redirect } from '@sveltejs/kit';
import { signin, signup, recoverPassword, resetPassword, verifyEmail } from '$lib/server/auth/flows';
import { validateEmail, validatePassword } from '$lib/validators';
import type { PageServerLoad, Actions } from "./$types";
import { m } from '$lib/paraglide/messages.js';

export const actions: Actions = {
	signin: async (event) => {
		const formData = await event.request.formData()
		const followURL = formData.get('follow') as string | null
		const email = formData.get('email')
		const password = formData.get('password')

		if (!validateEmail(email)) {
			return fail(400, { message: m.invalid_email_address() });
		}
		if (!validatePassword(password)) {
			return fail(400, { message: m.invalid_password() });
		}

		try {
			(await signin(email, password)).persist(event)
		} catch (message) {
			return fail(400, { message: String(message) })
		}

		redirect(302, followURL ?? '/');
	},

	signup: async (event) => {
		const formData = await event.request.formData()
		const followURL = formData.get('follow') as string | null
		const email = formData.get('email')
		const password = formData.get('password')
		const confirmPassword = formData.get('confirm_password')

		if (!validateEmail(email)) {
			return fail(400, { message: m.invalid_email_address() });
		}

		if (!validatePassword(password)) {
			return fail(400, { message: m.invalid_password() })
		}

		if (password !== confirmPassword) {
			return fail(400, { message: m.passwords_do_not_match() })
		}

		try {
			(await signup(email, password)).persist(event)
		} catch (message) {
			return fail(400, { message: String(message) });
		}

		redirect(302, followURL ?? '/');
	},

	recoverPassword: async (event) => {
		const formData = await event.request.formData()
		const followURL = formData.get('follow') as string | null
		const email = formData.get('email')

		if (!validateEmail(email)) {
			return fail(400, { message: m.invalid_email_address() });
		}

		try {
			await recoverPassword(email, followURL)
		} catch (message) {
			return fail(400, { message: String(message) })
		}
	},

	resetPassword: async (event) => {
		const formData = await event.request.formData()
		const followURL = formData.get('follow') as string | null
		const token = formData.get('token') as string
		const password = formData.get('password')
		const confirmPassword = formData.get('confirm_password')

		if (!validatePassword(password)) {
			return fail(400, { message: m.invalid_password() })
		}

		if (password !== confirmPassword) {
			return fail(400, { message: m.passwords_do_not_match() })
		}

		try {
			(await resetPassword(token, password)).persist(event)
		} catch (message) {
			return fail(400, { message: String(message) })
		}

		redirect(302, followURL ?? '/');
	}
}

export const load: PageServerLoad = async ({ url, locals }) => {
	if (url.searchParams.get('tab') === 'verify') {
		const token = url.searchParams.get('token')
		if (!token) {
			redirect(302, `/auth?follow=${encodeURIComponent(url.toString())}`)
		}

		try {
			await verifyEmail(token)
		} catch (message) {
			return { success: false, message: String(message) }
		}

		return { success: true }
	}

	if (locals.user) {
		redirect(302, '/');
	}
	return {};
};
