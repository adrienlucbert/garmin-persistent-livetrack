import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";
import { Action, actionTokens, type ActionTokens, type PublicUserWithTraits, type Users } from "../db/schema";
import { db } from "../db";
import { eq, and, sql } from "drizzle-orm";
import { m } from '$lib/paraglide/messages.js';

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

	await db()
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

export async function validateActionToken(token: string, action: Action): Promise<ActionTokens & { user: PublicUserWithTraits }> {
	const actionToken = await db().query.actionTokens.findFirst({
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
		where: eq(actionTokens.token, token)
	})

	if (!actionToken) {
		return Promise.reject(m.token_invalid_or_expired())
	}

	if (actionToken.action != action) {
		return Promise.reject(m.invalid_action_token())
	}

	if (actionToken.expiresAt && new Date() >= actionToken.expiresAt) {
		await invalidateActionToken(token)
		return Promise.reject(m.token_expired())
	}

	return actionToken
}

export async function invalidateActionToken(userUUID: string, action: Action): Promise<void>;
export async function invalidateActionToken(token: string): Promise<void>;
export async function invalidateActionToken(tokenOrUserUUID: string, action?: Action): Promise<void> {
	if (action) {
		const userUUID = tokenOrUserUUID
		await db().delete(actionTokens)
			.where(and(
				eq(actionTokens.userUUID, userUUID),
				eq(actionTokens.action, action)
			));
	} else {
		const token = tokenOrUserUUID
		await db().delete(actionTokens)
			.where(eq(actionTokens.token, token));
	}
}
