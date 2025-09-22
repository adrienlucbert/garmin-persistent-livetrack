import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './auth/users';

export const trackingLinks = pgTable('tracking_links', {
	userUUID: uuid('user_uuid').primaryKey().unique().references(() => users.uuid, { onDelete: 'cascade' }),
	link: text('link'),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull()
});

export const trackingLinksRelations = relations(trackingLinks, ({ one }) => ({
	user: one(users, {
		fields: [trackingLinks.userUUID],
		references: [users.uuid],
	})
}))

export type TrackingLinks = typeof trackingLinks.$inferSelect;
