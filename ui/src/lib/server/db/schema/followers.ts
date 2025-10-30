import { relations } from 'drizzle-orm'
import { boolean, pgEnum, pgTable, unique, uuid } from 'drizzle-orm/pg-core';
import { users } from './auth/users';
import { enumToPgEnum } from '../utils';
import { FollowStatus } from '../../../types/followers';

export const followStatus = pgEnum('follow_status', enumToPgEnum(FollowStatus))

export const followers = pgTable('followers', {
	userUUID: uuid('user_uuid').notNull().references(() => users.uuid, { onDelete: 'cascade' }),
	followerUserUUID: uuid('follower_user_uuid').notNull().references(() => users.uuid, { onDelete: 'cascade' }),
	status: followStatus().notNull().default(FollowStatus.PENDING),
	enabledNotifications: boolean('enabled_notifications').default(true),
},
	(t) => ({
		uniqUserAction: unique().on(t.userUUID, t.followerUserUUID)
	}));

export const FollowersRelations = relations(followers, ({ one }) => ({
	user: one(users, {
		fields: [followers.userUUID],
		references: [users.uuid],
	}),
	followerUser: one(users, {
		fields: [followers.followerUserUUID],
		references: [users.uuid],
	})
}))

export type Followers = typeof followers.$inferSelect;
