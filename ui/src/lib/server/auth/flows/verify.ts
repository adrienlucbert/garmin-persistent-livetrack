import { createActionToken, validateActionToken, invalidateActionToken } from "$lib/server/auth/token";
import { Action } from "$lib/server/db/schema";
import { send } from "$lib/server/email/sender";
import { env } from "$env/dynamic/public";
import { AskVerifyEmail } from "$lib/server/email/templates";
import { setUserEmailVerified } from "$lib/server/auth/user";
import type { UUID } from "crypto";

export async function askVerifyEmail({ uuid, email }: { uuid: string, email: string }): Promise<void> {
	const verifyToken = await createActionToken(uuid, Action.VERIFY_EMAIL)

	send(AskVerifyEmail(), {
		email: email,
		callbackURL: `${env.PUBLIC_URL ?? 'http://localhost'}/auth/verify?token=${verifyToken.token}`,
	}, email)
}

export async function verifyEmail(token: string): Promise<void> {
	const { user } = await validateActionToken(token, Action.VERIFY_EMAIL)
	await setUserEmailVerified(user.uuid as UUID)
	await invalidateActionToken(token)
}
