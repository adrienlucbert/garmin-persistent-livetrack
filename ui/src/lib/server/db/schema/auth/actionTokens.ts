import { relations } from 'drizzle-orm'
import { pgEnum, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';
import { enumToPgEnum } from '../../utils';

export enum Action {
	RESET_PASSWORD = 'reset_password',
	VERIFY_EMAIL = 'verify_email',
}

export const action = pgEnum('actionn', enumToPgEnum(Action))

export const actionTokens = pgTable('action_tokens', {
	userUUID: uuid('user_uuid').notNull().references(() => users.uuid, { onDelete: 'cascade' }),
	token: text('token').notNull(),
	action: action().notNull(),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' })
},
	(t) => ({
		uniqUserAction: unique().on(t.userUUID, t.action)
	}));

export const actionTokensRelations = relations(actionTokens, ({ one }) => ({
	user: one(users, {
		fields: [actionTokens.userUUID],
		references: [users.uuid],
	})
}))

export type ActionTokens = typeof actionTokens.$inferSelect;
