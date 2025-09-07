import { env } from "$env/dynamic/private"
import { createSessionForUser, type SessionWithToken } from "$lib/server/auth/session"
import { AuthMethod, createUser } from "$lib/server/auth/user"
import { askVerifyEmail } from "$lib/server/auth/flows/verify"

export async function signup(email: string, password: string): Promise<SessionWithToken> {
	const uuid = await createUser(AuthMethod.Password, email, password)

	const session = await createSessionForUser({ uuid: uuid })
	if (env.ENABLE_VERIFY_EMAIL) {
		await askVerifyEmail({ uuid, email })
	}
	return session
}

