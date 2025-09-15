import { db } from '$lib/server/db';
import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import type { RequestEvent } from "@sveltejs/kit";
import { dev } from '$app/environment';
import { eq } from "drizzle-orm";
import { sessions, type Sessions } from '$lib/server/db/schema';
import { createToken } from '$lib/server/auth/jwt';

export const SESSION_COOKIE_NAME = 'auth_token'

export type SessionWithToken = Sessions & {
	token: string
} & {
	persist(event: RequestEvent): void
}

export async function createSession({ uuid }: { uuid: string }): Promise<SessionWithToken> {
	const token = createToken({ user: { uuid: uuid } })
	const sess: Sessions = {
		id: encodeHexLowerCase(sha256(new TextEncoder().encode(token))),
		userUUID: uuid,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
	};

	await db.insert(sessions).values(sess);

	return {
		...sess,
		token,
		persist: (event: RequestEvent) => setSessionTokenCookie(event, token, sess.expiresAt)
	};
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
	event.cookies.set(SESSION_COOKIE_NAME, token, {
		expires: expiresAt,
		httpOnly: true,
		path: '/',
		sameSite: 'lax',
		secure: !dev
	});
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
	event.cookies.delete(SESSION_COOKIE_NAME, {
		expires: new Date(),
		httpOnly: true,
		path: '/',
		sameSite: 'lax',
		secure: !dev
	});
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await db.delete(sessions).where(eq(sessions.id, sessionId));
}
