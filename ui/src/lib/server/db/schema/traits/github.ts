import { relations } from 'drizzle-orm'
import { pgTable, text, uuid, integer } from 'drizzle-orm/pg-core';
import { users } from '../users';

export const githubTraits = pgTable('github_traits', {
	userUUID: uuid('user_uuid').primaryKey().references(() => users.uuid, { onDelete: 'cascade' }),
	githubId: integer('github_id').unique(),
	githubUserName: text('gtihub_username').unique(),
});

export const githubTraitsRelations = relations(githubTraits, ({ one }) => ({
	user: one(users, {
		fields: [githubTraits.userUUID],
		references: [users.uuid],
	})
}))

export type GithubTraits = typeof githubTraits.$inferSelect;
