import type { UUID } from "crypto";
import { createSession, type SessionWithToken } from "$lib/server/auth/session";
import { createActionToken, validateActionToken, invalidateActionToken, generateRandomToken } from "$lib/server/auth/token";
import { AuthMethod, getUser, setUserPreferredLocale, updateUserPassword } from "$lib/server/auth/user";
import { Action } from "$lib/server/db/schema";
import { send } from "$lib/server/email/sender";
import { RecoverPassword } from "$lib/server/email/templates";
import { formatDuration } from "$lib/time";
import { env } from "$env/dynamic/public";
import { FeatureFlagsConfig as flags } from "$lib/featureFlags/config";
import { askVerifyEmail } from "$lib/server/auth/flows"
import { m } from '$lib/paraglide/messages.js';
import { getLocale } from "$lib/paraglide/runtime";

export async function recoverPassword(email: string, followURL: string | null): Promise<void> {
	const user = await getUser(AuthMethod.Password, email)
	if (!user) {
		return
	}

	if (flags.ENABLE_VERIFY_EMAIL && user.email && !user.isEmailVerified) {
		await askVerifyEmail(user.uuid, user.email)
		return Promise.reject(m.email_not_verified())
	}

	const expiresIn = 1000 * 60 * 30 // 30 minutes
	const recoverToken = await createActionToken(generateRandomToken(), user.uuid, Action.RESET_PASSWORD, expiresIn)

	const qp = new URLSearchParams()
	qp.set('tab', 'reset')
	if (followURL) {
		qp.set('follow', followURL)
	}
	const resendURL = `${env.PUBLIC_URL ?? 'http://localhost'}/auth?${qp.toString()}`
	qp.set('token', recoverToken.token)
	const callbackURL = `${env.PUBLIC_URL ?? 'http://localhost'}/auth?${qp.toString()}`

	send(RecoverPassword(), {
		expiresIn: formatDuration(expiresIn),
		resendURL,
		callbackURL,
	}, email)
}

export async function resetPassword(token: string, password: string): Promise<SessionWithToken> {
	const actionToken = await validateActionToken(token, Action.RESET_PASSWORD)
	await updateUserPassword(actionToken.userUUID as UUID, password)
	await invalidateActionToken(token)

	if (actionToken.user.preferredLocale !== getLocale()) {
		await setUserPreferredLocale(actionToken.user.uuid as UUID, getLocale())
			.catch(console.error)
	}

	return await createSession(actionToken.user.uuid as UUID)
}
