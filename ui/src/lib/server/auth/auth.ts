import { createToken } from "./jwt";
import { verifyPasswordHash } from "./password";
import { createSession, type SessionWithToken } from "./session";
import { createUser, getUserByEmail } from "./user";

export async function signin(identifier: string, password: string): Promise<SessionWithToken | undefined> {
	const user = await getUserByEmail(identifier)
	if (!user) {
		return
	}

	const isPasswordVerified = await verifyPasswordHash(user.passwordHash, password)
	if (!isPasswordVerified) {
		return
	}

	const token = createToken({ user: { uuid: user.uuid, email: user.email } })
	return await createSession(token, user.uuid)
}

export async function signup(identifier: string, password: string): Promise<SessionWithToken> {
	const uuid = await createUser(identifier, password)
	const token = createToken({ user: { uuid: uuid, email: identifier } })
	return await createSession(token, uuid)
}
