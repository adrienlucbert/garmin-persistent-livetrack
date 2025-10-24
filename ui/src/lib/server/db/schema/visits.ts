import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './auth/users';

export const visits = pgTable('visits', {
	linkUserUUID: uuid('link_user_uuid').notNull().references(() => users.uuid, { onDelete: 'cascade' }),
	visitorUserUUID: uuid('visitor_user_uuid').references(() => users.uuid, { onDelete: 'cascade' }),
	ip: text('ip'),
	timestamp: timestamp('timestamp', { withTimezone: true, mode: 'date' }).defaultNow().notNull()
});

export const VisitsRelations = relations(visits, ({ one }) => ({
	linkUser: one(users, {
		fields: [visits.linkUserUUID],
		references: [users.uuid],
	}),
	visitorUser: one(users, {
		fields: [visits.visitorUserUUID],
		references: [users.uuid],
	})
}))

export type Visits = typeof visits.$inferSelect;
