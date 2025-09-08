import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';

export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	userUUID: uuid('user_uuid').notNull().references(() => users.uuid, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userUUID],
		references: [users.uuid],
	})
}))

export type Sessions = typeof sessions.$inferSelect;
