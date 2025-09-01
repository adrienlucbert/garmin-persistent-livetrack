import { env } from "$env/dynamic/private"
import { createSessionForUser, type SessionWithToken } from "$lib/server/auth/session"
import { createUser } from "$lib/server/auth/user"
import { askVerifyEmail } from "$lib/server/auth/flows/verify"

export async function signup(email: string, password: string): Promise<SessionWithToken> {
	const uuid = await createUser(email, password)

	const session = await createSessionForUser({ uuid: uuid, email: email })
	if (env.ENABLE_VERIFY_EMAIL) {
		await askVerifyEmail({ uuid, email })
	}
	return session
}

