import { relations, sql } from 'drizzle-orm'
import { json, pgTable, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { users } from '../auth/users';

export const webpushSubscriptions = pgTable('webpush_subscriptions', {
	userUUID: uuid('user_uuid').notNull().references(() => users.uuid, { onDelete: 'cascade' }),
	subscription: json('subscription'),
}, (table) => ({
	uniqueEndpoint: uniqueIndex('unique_endpoint_index').on(
		sql`(${table.subscription}->>'endpoint')`
	),
}));

export const WebpushSubscriptionsRelations = relations(webpushSubscriptions, ({ one }) => ({
	user: one(users, {
		fields: [webpushSubscriptions.userUUID],
		references: [users.uuid],
	}),
}))

export type WebpushSubscriptions = typeof webpushSubscriptions.$inferSelect;
