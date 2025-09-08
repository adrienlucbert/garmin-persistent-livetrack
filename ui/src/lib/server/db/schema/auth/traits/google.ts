import { relations } from 'drizzle-orm'
import { pgTable, text, uuid, integer } from 'drizzle-orm/pg-core';
import { users } from '../users';

export const googleTraits = pgTable('google_traits', {
	userUUID: uuid('user_uuid').primaryKey().references(() => users.uuid, { onDelete: 'cascade' }),
	userId: text('user_id').unique(),
	username: text('username').unique(),
});

export const googleTraitsRelations = relations(googleTraits, ({ one }) => ({
	user: one(users, {
		fields: [googleTraits.userUUID],
		references: [users.uuid],
	})
}))

export type GoogleTraits = typeof googleTraits.$inferSelect;
