import { relations } from 'drizzle-orm'
import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { githubTraits, passwordTraits, type GithubTraits, type PasswordTraits } from './traits';

export const users = pgTable('users', {
	uuid: uuid('id').primaryKey().defaultRandom().unique(),
});

export const usersRelations = relations(users, ({ one }) => ({
	passwordTrait: one(passwordTraits, {
		fields: [users.uuid],
		references: [passwordTraits.userUUID],
	}),
	githubTrait: one(githubTraits, {
		fields: [users.uuid],
		references: [githubTraits.userUUID],
	}),
}))

export type Users = typeof users.$inferSelect;

export type PublicUserWithTraits = Users & {
	passwordTrait: Omit<PasswordTraits, 'passwordHash'> | null,
	githubTrait: GithubTraits | null,
}

