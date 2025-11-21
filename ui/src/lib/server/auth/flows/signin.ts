import { verifyPasswordHash } from "$lib/server/auth/password"
import { createSession, type SessionWithToken } from "$lib/server/auth/session"
import { AuthMethod, getUser, setUserPreferredLocale } from "$lib/server/auth/user"
import { m } from '$lib/paraglide/messages.js';
import { getLocale } from "$lib/paraglide/runtime";
import type { UUID } from "crypto";

export async function signin(email: string, password: string): Promise<SessionWithToken> {
	const user = await getUser(AuthMethod.Password, email)
	if (!user) {
		return Promise.reject(m.invalid_username_or_password())
	}

	const isPasswordVerified = await verifyPasswordHash(user.traits.passwordHash, password)
	if (!isPasswordVerified) {
		return Promise.reject(m.invalid_username_or_password())
	}

	if (user.preferredLocale !== getLocale()) {
		await setUserPreferredLocale(user.uuid as UUID, getLocale())
			.catch(console.error)
	}

	return await createSession(user.uuid as UUID)
}

