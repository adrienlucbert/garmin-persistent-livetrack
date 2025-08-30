import jwt from 'jsonwebtoken';
import { sessions } from '../db/schema';
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

export async function validateSessionToken(token: string): Promise<any> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const result = await db.query.sessions.findFirst({
		with: {
			user: true
		},
		where: eq(sessions.id, sessionId)
	});

	if (!result) {
		return { session: null, user: null };
	}

	const { user, ...sess } = result;

	if (new Date() >= sess.expiresAt) {
		await invalidateSession(sessionId)
		return { session: null, user: null };
	}

	return { session: sess, user: user };
}
