import { relations, sql } from 'drizzle-orm'
import { pgTable, text, uuid, uniqueIndex, boolean } from 'drizzle-orm/pg-core';
import { users } from '../users';

export const passwordTraits = pgTable('password_traits', {
	userUUID: uuid('user_uuid').primaryKey().references(() => users.uuid, { onDelete: 'cascade' }),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	isEmailVerified: boolean('is_email_verified').default(false),
}, (table) => [
	uniqueIndex('emailUniqueIndex').on(sql`lower(${table.email})`),
]);

export const passwordTraitsRelations = relations(passwordTraits, ({ one }) => ({
	user: one(users, {
		fields: [passwordTraits.userUUID],
		references: [users.uuid],
	})
}))

export type PasswordTraits = typeof passwordTraits.$inferSelect;
