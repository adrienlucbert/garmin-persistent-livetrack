import { relations, sql } from 'drizzle-orm'
import { pgTable, text, timestamp, uuid, uniqueIndex, pgEnum, unique } from 'drizzle-orm/pg-core';

export function enumToPgEnum<T extends Record<string, any>>(
	myEnum: T,
): [T[keyof T], ...T[keyof T][]] {
	return Object.values(myEnum).map((value: any) => `${value}`) as any
}


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

export enum Action {
	RECOVER_PASSWORD = 'recover_password',
}

export const action = pgEnum('actionn', enumToPgEnum(Action))

export const actionTokens = pgTable('action_tokens', {
	userUUID: uuid('user_uuid').notNull().references(() => users.uuid),
	token: text('token').notNull(),
	action: action().notNull(),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
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

export type Sessions = typeof sessions.$inferSelect;

export type Users = typeof users.$inferSelect;

export type ActionTokens = typeof actionTokens.$inferSelect;
