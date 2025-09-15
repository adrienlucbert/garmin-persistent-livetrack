import { db } from '$lib/server/db';
import { eq } from "drizzle-orm";
import type { UUID } from 'crypto';
import { hashPassword } from '$lib/server/auth/password';
import { users, type Users, githubTraits, googleTraits, passwordTraits, type GithubTraits, type GoogleTraits, type PasswordTraits, type Traits } from '$lib/server/db/schema';

export enum AuthMethod {
	Password = 'password',
	Github = 'github',
	Google = 'google',
}

export async function createUser(method: AuthMethod.Password, email: string, password: string): Promise<UUID>;
export async function createUser(method: AuthMethod.Github, userId: number, username: string): Promise<UUID>;
export async function createUser(method: AuthMethod.Google, userId: string, username: string): Promise<UUID>;
export async function createUser(method: AuthMethod, ...args: any): Promise<UUID> {
	const userUUID = crypto.randomUUID()
	return await db().transaction(async (tx) => {
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
				const [userId, username]: [userId: number, username: string] = args
				await tx.insert(githubTraits).values({
					userUUID: userUUID,
					userId: userId,
					username: username,
				})
				break
			}
			case AuthMethod.Google: {
				const [userId, username]: [userId: string, username: string] = args
				await tx.insert(googleTraits).values({
					userUUID: userUUID,
					userId: userId,
					username: username,
				})
				break
			}
		}
		return userUUID;
	})
}

export async function getUser(method: AuthMethod.Password, email: string): Promise<Users & { traits: PasswordTraits } | undefined>;
export async function getUser(method: AuthMethod.Github, userid: number): Promise<Users & { traits: GithubTraits } | undefined>;
export async function getUser(method: AuthMethod.Google, userid: string): Promise<Users & { traits: GoogleTraits } | undefined>;
export async function getUser(method: AuthMethod, ...args: any): Promise<Users & { traits: Traits } | undefined> {
	switch (method) {
		case AuthMethod.Password: {
			const [email]: [email: string] = args
			return (await db().select({
				uuid: users.uuid,
				traits: passwordTraits
			})
				.from(passwordTraits)
				.innerJoin(users, eq(users.uuid, passwordTraits.userUUID))
				.where(eq(passwordTraits.email, email))
				.limit(1))[0]
		}
		case AuthMethod.Github: {
			const [userid]: [userid: number] = args
			return (await db().select({
				uuid: users.uuid,
				traits: githubTraits
			})
				.from(githubTraits)
				.innerJoin(users, eq(users.uuid, githubTraits.userUUID))
				.where(eq(githubTraits.userId, userid))
				.limit(1))[0]
		}
		case AuthMethod.Google: {
			const [userid]: [userid: string] = args
			return (await db().select({
				uuid: users.uuid,
				traits: googleTraits
			})
				.from(googleTraits)
				.innerJoin(users, eq(users.uuid, googleTraits.userUUID))
				.where(eq(googleTraits.userId, userid))
				.limit(1))[0]
		}
	}
}

export async function setUserEmailVerified(userUUID: UUID): Promise<void> {
	await db().update(passwordTraits)
		.set({ isEmailVerified: true })
		.where(eq(passwordTraits.userUUID, userUUID))
}

export async function updateUserPassword(userUUID: UUID, password: string): Promise<void> {
	await db().update(passwordTraits)
		.set({ passwordHash: await hashPassword(password) })
		.where(eq(passwordTraits.userUUID, userUUID))
}

export async function deleteUser(userUUID: UUID): Promise<void> {
	await db()
		.delete(users)
		.where(eq(users.uuid, userUUID))
}
