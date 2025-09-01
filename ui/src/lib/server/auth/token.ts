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

export async function createActionToken(userUUID: string, action: Action, expiresIn?: number): Promise<ActionTokens> {
	const bytes = new Uint8Array(32);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);

	expiresIn = expiresIn ?? 1000 * 60 * 30; // 30 minutes

	const actionToken: ActionTokens = {
		userUUID,
		token,
		action,
		expiresAt: new Date(Date.now() + expiresIn),
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

export async function getActionToken(token: string): Promise<ActionTokens & { user: Users } | undefined> {
	return await db.query.actionTokens.findFirst({
		with: {
			user: true
		},
		where: eq(actionTokens.token, token)
	})
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
