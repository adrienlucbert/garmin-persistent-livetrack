import jwt from 'jsonwebtoken';
import { sessions, type PublicUserWithTraits, type Sessions } from '../db/schema';
import { JWT_TOKEN_SECRET } from '$env/static/private';
import { encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { invalidateSession } from './session';
import { m } from '$lib/paraglide/messages.js';

export function generateJWT(payload: object, expiresIn?: string): string {
	return jwt.sign(
		{
			...payload,
		},
		JWT_TOKEN_SECRET,
		{ expiresIn: expiresIn ?? '7d' }
	);
}

export function decodeJWT<T = object>(token: string): T {
	return jwt.verify(token, JWT_TOKEN_SECRET)
}

export async function validateSessionToken(token: string): Promise<Sessions & { user: PublicUserWithTraits }> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const sess = await db().query.sessions.findFirst({
		with: {
			user: {
				with: {
					passwordTrait: {
						columns: {
							passwordHash: false
						}
					},
					githubTrait: true,
					googleTrait: true,
				}
			}
		},
		where: eq(sessions.id, sessionId)
	});

	if (!sess) {
		return Promise.reject(m.token_invalid_or_expired())
	}

	if (new Date() >= sess.expiresAt) {
		await invalidateSession(sessionId)
		return Promise.reject(m.token_expired())
	}

	return sess;
}
