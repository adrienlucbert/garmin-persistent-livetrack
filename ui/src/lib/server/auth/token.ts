import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";
import { Action, actionTokens, type ActionTokens, type Users } from "../db/schema";
import { db } from "../db";
import { eq, and, sql, gt, lt } from "drizzle-orm";

export function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export async function createActionToken(userUUID: string, action: Action, expiresIn: number | null = null): Promise<ActionTokens> {
	const bytes = new Uint8Array(32);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);

	const actionToken: ActionTokens = {
		userUUID,
		token,
		action,
		expiresAt: expiresIn ? new Date(Date.now() + expiresIn) : null,
	};

	await db
		.insert(actionTokens)
		.values(actionToken)
		.onConflictDoUpdate({
			target: [actionTokens.userUUID, actionTokens.action],
			set: {
				token: sql.raw(`excluded.${actionTokens.token.name}`),
				expiresAt: sql.raw(`excluded.${actionTokens.expiresAt.name}`),
			},
		});

	return actionToken;
}

export async function validateActionToken(token: string): Promise<ActionTokens & { user: Omit<Users, 'passwordHash'> }> {
	const actionToken = await db.query.actionTokens.findFirst({
		with: {
			user: {
				columns: {
					passwordHash: false
				}
			}
		},
		where: eq(actionTokens.token, token)
	})

	if (!actionToken) {
		return Promise.reject('Token is invalid or has expired')
	}

	if (actionToken.expiresAt && new Date() >= actionToken.expiresAt) {
		await invalidateActionToken(token)
		return Promise.reject('Token has expired')
	}

	return actionToken
}

export async function invalidateActionToken(userUUID: string, action: Action): Promise<void>;
export async function invalidateActionToken(token: string): Promise<void>;
export async function invalidateActionToken(tokenOrUserUUID: string, action?: Action): Promise<void> {
	if (action) {
		const userUUID = tokenOrUserUUID
		await db.delete(actionTokens)
			.where(and(
				eq(actionTokens.userUUID, userUUID),
				eq(actionTokens.action, action)
			));
	} else {
		const token = tokenOrUserUUID
		await db.delete(actionTokens)
			.where(eq(actionTokens.token, token));
	}
}
