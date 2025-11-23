import { FeatureFlagsConfig as flags } from '$lib/featureFlags/config';
import { createSession, type SessionWithToken } from "$lib/server/auth/session"
import { AuthMethod, createUser } from "$lib/server/auth/user"
import { askVerifyEmail } from "$lib/server/auth/flows"
import type { UUID } from "crypto"

export async function signup(email: string, password: string): Promise<SessionWithToken> {
	const user = await createUser(AuthMethod.Password, email, password)

	const session = await createSession(user.uuid as UUID)
	if (flags.ENABLE_VERIFY_EMAIL && !user.isEmailVerified) {
		await askVerifyEmail(user.uuid, email)
	}
	return session
}

