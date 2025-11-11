import { relations, sql } from 'drizzle-orm'
import { boolean, check, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { githubTraits, googleTraits, passwordTraits, type GithubTraits, type GoogleTraits, type PasswordTraits } from './traits';

export const users = pgTable('users', {
	uuid: uuid('uuid').primaryKey().defaultRandom().unique(),
	name: text('name').notNull().unique(),
	email: text('email'),
	isEmailVerified: boolean('is_email_verified').notNull().default(false),
}, (table) => ({
	nameFormatCheck: check(
		"name_format_check",
		sql`${table.name} ~ '^[a-z0-9]+(-[a-z0-9]+)*$'`
	),
	emailUniqueIndex: uniqueIndex('email_unique_index')
		.on(sql`lower(${table.email})`)
		.where(sql`${table.email} IS NOT NULL`),
	emailVerifiedRequiresEmail: check(
		'email_verified_requires_email',
		sql`${table.email} IS NOT NULL OR ${table.isEmailVerified} = false`
	)
}));

export const usersRelations = relations(users, ({ one }) => ({
	passwordTrait: one(passwordTraits, {
		fields: [users.uuid],
		references: [passwordTraits.userUUID],
	}),
	githubTrait: one(githubTraits, {
		fields: [users.uuid],
		references: [githubTraits.userUUID],
	}),
	googleTrait: one(googleTraits, {
		fields: [users.uuid],
		references: [googleTraits.userUUID],
	}),
}))

export type Users = typeof users.$inferSelect;

export type PublicUserWithTraits = Users & {
	passwordTrait: Omit<PasswordTraits, 'passwordHash'> | null,
	githubTrait: GithubTraits | null,
	googleTrait: GoogleTraits | null,
}

