import { relations } from 'drizzle-orm'
import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './auth/users';

export const trackingLinks = pgTable('tracking_links', {
	uuid: uuid('uuid').primaryKey().unique().defaultRandom(),
	userUUID: uuid('user_uuid').unique().references(() => users.uuid, { onDelete: 'cascade' }),
	link: text('link'),
	isPublic: boolean().default(true),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull()
});

export const trackingLinksRelations = relations(trackingLinks, ({ one }) => ({
	user: one(users, {
		fields: [trackingLinks.userUUID],
		references: [users.uuid],
	})
}))

export type TrackingLinks = typeof trackingLinks.$inferSelect;
