import { db } from '$lib/server/db';
import { eq } from "drizzle-orm";
import { users, type Users } from '../db/schema';
import type { UUID } from 'crypto';
import { hashPassword } from './password';

export async function createUser(email: string, password: string): Promise<UUID> {
	const userUUID = crypto.randomUUID()

	await db.insert(users).values({
		uuid: userUUID,
		email,
		passwordHash: await hashPassword(password)
	} as Users);

	return userUUID;
}

export async function getUserByEmail(email: string): Promise<Users | undefined> {
	return await db.query.users.findFirst({
		where: eq(users.email, email)
	})
}

export async function setUserEmailVerified(userUUID: UUID): Promise<void> {
	await db.update(users)
		.set({ isEmailVerified: true })
		.where(eq(users.uuid, userUUID))
}

export async function updateUserPassword(userUUID: UUID, password: string): Promise<void> {
	await db.update(users)
		.set({ passwordHash: await hashPassword(password) })
		.where(eq(users.uuid, userUUID))
}

export async function deleteUser(userUUID: UUID): Promise<void> {
	await db
		.delete(users)
		.where(eq(users.uuid, userUUID))
}
