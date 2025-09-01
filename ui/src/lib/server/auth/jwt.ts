import jwt from 'jsonwebtoken';
import { sessions, type Sessions, type Users } from '../db/schema';
import { JWT_TOKEN_SECRET } from '$env/static/private';
import { encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { invalidateSession } from './session';

type JWTContent = {
	user: {
		uuid: string,
		email: string
	}
}

export function createToken(payload: JWTContent, expiresIn?: string): string {
	return jwt.sign(
		{
			...payload,
		},
		JWT_TOKEN_SECRET,
		{ expiresIn: expiresIn ?? '7d' }
	);
}

export async function validateSessionToken(token: string): Promise<Sessions & { user: Omit<Users, 'passwordHash'> }> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const sess = await db.query.sessions.findFirst({
		with: {
			user: {
				columns: {
					passwordHash: false
				}
			}
		},
		where: eq(sessions.id, sessionId)
	});

	if (!sess) {
		return Promise.reject('Token is invalid or has expired')
	}

	if (new Date() >= sess.expiresAt) {
		await invalidateSession(sessionId)
		return Promise.reject('Token has expired')
	}

	return sess;
}
