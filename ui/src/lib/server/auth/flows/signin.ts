import { verifyPasswordHash } from "$lib/server/auth/password"
import { createSessionForUser, type SessionWithToken } from "$lib/server/auth/session"
import { getUserByEmail } from "$lib/server/auth/user"

export async function signin(email: string, password: string): Promise<SessionWithToken> {
	const user = await getUserByEmail(email)
	if (!user) {
		return Promise.reject('Invalid username or password')
	}

	const isPasswordVerified = await verifyPasswordHash(user.passwordHash, password)
	if (!isPasswordVerified) {
		return Promise.reject('Invalid username or password')
	}

	return await createSessionForUser(user)
}

