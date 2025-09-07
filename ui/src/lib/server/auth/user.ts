import { db } from '$lib/server/db';
import { eq } from "drizzle-orm";
import { users, type Users } from '../db/schema';
import type { UUID } from 'crypto';
import { hashPassword } from './password';
import { githubTraits, passwordTraits, type GithubTraits, type PasswordTraits } from '$lib/server/db/schema/traits';

export enum AuthMethod {
	Password = 'password',
	Github = 'github',
}

export async function createUser(method: AuthMethod.Github, githubId: number, githubUsername: string): Promise<UUID>;
export async function createUser(method: AuthMethod.Password, email: string, password: string): Promise<UUID>;
export async function createUser(method: AuthMethod, ...args: any): Promise<UUID> {
	const userUUID = crypto.randomUUID()
	return await db.transaction(async (tx) => {
		await tx.insert(users).values({ uuid: userUUID })
		switch (method) {
			case AuthMethod.Password: {
				const [email, password]: [email: string, password: string] = args
				await tx.insert(passwordTraits).values({
					userUUID: userUUID,
					email: email,
					passwordHash: await hashPassword(password),
				})
				break
			}
			case AuthMethod.Github: {
				const [githubId, githubUsername]: [githubId: number, githubUsername: string] = args
				await tx.insert(githubTraits).values({
					userUUID: userUUID,
					githubId: githubId,
					githubUserName: githubUsername,
				})
				break
			}
		}
		return userUUID;
	})
}

export async function getUser(method: AuthMethod.Password, email: string): Promise<Users & { traits: PasswordTraits } | undefined>;
export async function getUser(method: AuthMethod.Github, githubId: number): Promise<Users & { traits: GithubTraits } | undefined>;
export async function getUser(method: AuthMethod, ...args: any): Promise<Users & { traits: PasswordTraits | GithubTraits } | undefined> {
	switch (method) {
		case AuthMethod.Password: {
			const [email]: [email: string] = args
			return (await db.select({
				uuid: users.uuid,
				traits: passwordTraits
			})
				.from(passwordTraits)
				.innerJoin(users, eq(users.uuid, passwordTraits.userUUID))
				.where(eq(passwordTraits.email, email))
				.limit(1))[0]
		}
		case AuthMethod.Github: {
			const [githubId]: [githubId: number] = args
			return (await db.select({
				uuid: users.uuid,
				traits: githubTraits
			})
				.from(githubTraits)
				.innerJoin(users, eq(users.uuid, githubTraits.userUUID))
				.where(eq(githubTraits.githubId, githubId))
				.limit(1))[0]
		}
	}
}

export async function setUserEmailVerified(userUUID: UUID): Promise<void> {
	await db.update(passwordTraits)
		.set({ isEmailVerified: true })
		.where(eq(passwordTraits.userUUID, userUUID))
}

export async function updateUserPassword(userUUID: UUID, password: string): Promise<void> {
	await db.update(passwordTraits)
		.set({ passwordHash: await hashPassword(password) })
		.where(eq(passwordTraits.userUUID, userUUID))
}

export async function deleteUser(userUUID: UUID): Promise<void> {
	await db
		.delete(users)
		.where(eq(users.uuid, userUUID))
}
