import type { UUID } from "crypto";
import { createSessionForUser, type SessionWithToken } from "$lib/server/auth/session";
import { createActionToken, getActionToken, invalidateActionToken } from "$lib/server/auth/token";
import { getUserByEmail, updateUserPassword } from "$lib/server/auth/user";
import { Action } from "$lib/server/db/schema";
import { send } from "$lib/server/email/sender";
import { RecoverPassword } from "$lib/server/email/templates";
import { formatDuration } from "$lib/time";
import { env } from "$env/dynamic/public";

export async function recoverPassword(identifier: string): Promise<void> {
	const user = await getUserByEmail(identifier)
	if (!user) {
		return
	}

	const expiresIn = 1000 * 60 * 30 // 30 minutes
	const recoverToken = await createActionToken(user.uuid, Action.RECOVER_PASSWORD, expiresIn)

	send(RecoverPassword(), {
		expiresIn: formatDuration(expiresIn),
		recoverURL: `${env.PUBLIC_URL ?? 'http://localhost'}/auth/recover`,
		resetURL: `${env.PUBLIC_URL ?? 'http://localhost'}/auth/recover?token=${recoverToken.token}`,
	}, identifier)
}

export async function resetPassword(token: string, password: string): Promise<SessionWithToken> {
	const actionToken = await getActionToken(token)
	if (!actionToken) {
		return Promise.reject('Token is invalid or has expired')
	}

	if (actionToken.expiresAt < new Date()) {
		await invalidateActionToken(token)
		return Promise.reject('Token has expired')
	}

	await updateUserPassword(actionToken.userUUID as UUID, password)
	await invalidateActionToken(token)

	return await createSessionForUser(actionToken.user)
}
