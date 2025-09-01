import { verifyPasswordHash } from "$lib/server/auth/password"
import { createSessionForUser, type SessionWithToken } from "$lib/server/auth/session"
import { getUserByEmail } from "$lib/server/auth/user"

export async function signin(identifier: string, password: string): Promise<SessionWithToken> {
	const user = await getUserByEmail(identifier)
	if (!user) {
		return Promise.reject('User does not exist')
	}

	const isPasswordVerified = await verifyPasswordHash(user.passwordHash, password)
	if (!isPasswordVerified) {
		return Promise.reject('Invalid password')
	}

	return await createSessionForUser(user)
}

