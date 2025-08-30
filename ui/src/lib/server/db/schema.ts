import { relations, sql } from 'drizzle-orm'
import { pgTable, text, timestamp, uuid, uniqueIndex } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	uuid: uuid('id').primaryKey().defaultRandom().unique(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull()
}, (table) => [
	uniqueIndex('emailUniqueIndex').on(sql`lower(${table.email})`),
]);

export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	userUUID: uuid('user_uuid').notNull().references(() => users.uuid),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userUUID],
		references: [users.uuid],
	})
}))

export type Session = typeof sessions.$inferSelect;

export type User = typeof users.$inferSelect;
