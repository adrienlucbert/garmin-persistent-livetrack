import { fail, redirect } from '@sveltejs/kit';
import { validateEmail, validatePassword } from "$lib/validators";
import type { Actions } from "./$types";
import { m } from '$lib/paraglide/messages.js';
import { AuthMethod, deleteUser, getUser, getUserByUUID, updateUserEmail, updateUserName, updateUserPassword, validateSlug } from '$lib/server/auth/user';
import type { UUID } from 'crypto';
import { askVerifyEmail } from '$lib/server/auth/flows';
import { verifyPasswordHash } from '$lib/server/auth/password';

export const actions: Actions = {
	editUser: async ({ request, locals }) => {
		const changes = new Set<'email' | 'username'>()

		if (!locals.user) {
			return fail(401, { message: m.user_not_logged_in() })
		}

		const formData = await request.formData()
		const username = formData.get('username') as string | null
		const email = formData.get('email')

		if (!validateEmail(email)) {
			return fail(400, { message: m.invalid_email_address() });
		}

		if (username && username !== locals.user.name) {
			try {
				await validateSlug(username)
				await updateUserName(locals.user.uuid as UUID, username)
				changes.add('username')
			} catch (err) {
				return fail(400, { message: err })
			}
		}

		if (email !== locals.user.email) {
			try {
				await updateUserEmail(locals.user.uuid as UUID, email)
				await askVerifyEmail(locals.user.uuid, email)
				changes.add('email')
			} catch (err) {
				return fail(400, { message: err })
			}
		}
		return {
			message: changes.size === 0 ? m.nothing_to_update_text() : m.edit_user_success_text(),
			changes: [...changes],
		}
	},

	changePassword: async ({ request, locals }) => {
		if (!locals.user || !locals.user.email) {
			return fail(401, { message: m.user_not_logged_in() })
		}

		const formData = await request.formData()
		const oldPassword = formData.get('old_password')
		const newPassword = formData.get('new_password')

		if (!validatePassword(oldPassword) || !validatePassword(newPassword)) {
			return fail(400, { message: m.invalid_password() })
		}

		try {
			const user = await getUser(AuthMethod.Password, locals.user.email)
			if (!user) {
				return fail(401, { message: m.user_not_logged_in() })
			}

			const isPasswordVerified = await verifyPasswordHash(user.traits.passwordHash, oldPassword)
			if (!isPasswordVerified) {
				return fail(400, { message: m.incorrect_old_password() })
			}
			await updateUserPassword(locals.user.uuid as UUID, newPassword)
			return { message: m.change_password_success_text() }
		} catch (message) {
			return fail(400, { message: String(message) })
		}
	},

	deleteAccount: async ({ locals }) => {
		if (!locals.user) {
			return fail(401, { message: m.user_not_logged_in() })
		}

		try {
			await deleteUser(locals.user.uuid as UUID)
		} catch {
			return fail(500, m.failed_to_delete_account())
		}

		return redirect(303, '/')
	}
}
