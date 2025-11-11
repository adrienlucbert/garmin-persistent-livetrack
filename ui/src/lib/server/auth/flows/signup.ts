import { env } from "$env/dynamic/private"
import { createSession, type SessionWithToken } from "$lib/server/auth/session"
import { AuthMethod, createUser } from "$lib/server/auth/user"
import { askVerifyEmail } from "$lib/server/auth/flows"

export async function signup(email: string, password: string): Promise<SessionWithToken> {
	const uuid = await createUser(AuthMethod.Password, email, password)

	const session = await createSession({ uuid: uuid })
	if (env.ENABLE_VERIFY_EMAIL) {
		await askVerifyEmail(uuid, email)
	}
	return session
}

