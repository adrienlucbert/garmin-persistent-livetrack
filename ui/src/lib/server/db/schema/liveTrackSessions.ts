import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './auth/users';

export const liveTrackSessions = pgTable('live_track_sessions', {
	uuid: uuid('uuid').primaryKey().defaultRandom().unique(),
	userUUID: uuid('user_uuid').notNull().references(() => users.uuid, { onDelete: 'cascade' }),
	link: text('link'),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const liveTrackSessionsRelations = relations(liveTrackSessions, ({ one }) => ({
	user: one(users, {
		fields: [liveTrackSessions.userUUID],
		references: [users.uuid],
	})
}))

export type LiveTrackSessions = typeof liveTrackSessions.$inferSelect;
