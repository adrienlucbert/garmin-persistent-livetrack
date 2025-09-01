import { sql } from 'drizzle-orm'
import { pgTable, text, uuid, uniqueIndex, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	uuid: uuid('id').primaryKey().defaultRandom().unique(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	isEmailVerified: boolean('is_email_verified').default(false),
}, (table) => [
	uniqueIndex('emailUniqueIndex').on(sql`lower(${table.email})`),
]);

export type Users = typeof users.$inferSelect;
