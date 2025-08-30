import { db } from '$lib/server/db';
import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import type { RequestEvent } from "@sveltejs/kit";
import { dev } from '$app/environment';
import { eq } from "drizzle-orm";
import { sessions, type Session } from '../db/schema';

export const SESSION_COOKIE_NAME = 'auth_token'

export type SessionWithToken = Session & {
	token: string
}

export async function createSession(token: string, userUUID: string): Promise<SessionWithToken> {
	const sess: Session = {
		id: encodeHexLowerCase(sha256(new TextEncoder().encode(token))),
		userUUID,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
	};

	await db.insert(sessions).values(sess);

	return { ...sess, token };
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
	event.cookies.set(SESSION_COOKIE_NAME, token, {
		expires: expiresAt,
		httpOnly: true,
		path: '/',
		sameSite: 'lax',
		secure: process.env.NODE_ENV !== 'development'
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
