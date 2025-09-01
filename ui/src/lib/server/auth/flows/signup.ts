import { createSessionForUser, type SessionWithToken } from "$lib/server/auth/session"
import { createUser } from "$lib/server/auth/user"

export async function signup(identifier: string, password: string): Promise<SessionWithToken> {
	const uuid = await createUser(identifier, password)
	return await createSessionForUser({ uuid: uuid, email: identifier })
}

