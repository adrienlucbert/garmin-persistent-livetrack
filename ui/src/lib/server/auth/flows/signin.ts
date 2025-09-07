import { verifyPasswordHash } from "$lib/server/auth/password"
import { createSessionForUser, type SessionWithToken } from "$lib/server/auth/session"
import { AuthMethod, getUser } from "$lib/server/auth/user"

export async function signin(email: string, password: string): Promise<SessionWithToken> {
	const user = await getUser(AuthMethod.Password, email)
	if (!user) {
		return Promise.reject('Invalid username or password')
	}

	const isPasswordVerified = await verifyPasswordHash(user.traits.passwordHash, password)
	if (!isPasswordVerified) {
		return Promise.reject('Invalid username or password')
	}

	return await createSessionForUser(user)
}

