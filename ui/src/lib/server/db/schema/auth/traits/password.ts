import { relations } from 'drizzle-orm'
import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { users } from '../users';

export const passwordTraits = pgTable('password_traits', {
	userUUID: uuid('user_uuid').primaryKey().references(() => users.uuid, { onDelete: 'cascade' }),
	passwordHash: text('password_hash').notNull(),
});

export const passwordTraitsRelations = relations(passwordTraits, ({ one }) => ({
	user: one(users, {
		fields: [passwordTraits.userUUID],
		references: [users.uuid],
	})
}))

export type PasswordTraits = typeof passwordTraits.$inferSelect;
