import { env } from "$env/dynamic/public";
import { db } from '$lib/server/db';
import { Action, followers, users, visits, type Followers, type Users } from '$lib/server/db/schema';
import { createActionToken } from "$lib/server/auth/token";
import { generateJWT } from '$lib/server/auth/jwt';
import { FollowStatus } from '$lib/types/followers';
import { type UUID } from 'crypto';
import { and, count, eq, getTableColumns, max } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

export async function createFollow(userUUID: UUID, followerUserUUID: UUID, status: FollowStatus): Promise<void> {
	await db()
		.insert(followers)
		.values({
			userUUID,
			followerUserUUID,
			status: status,
		})
		.onConflictDoUpdate({
			target: [followers.userUUID, followers.followerUserUUID],
			set: {
				status: status
			}
		})
}

export type FollowersWithNames = Followers & {
	userName: string;
	followerUserName: string;
}

export type FollowerStats = FollowersWithNames & {
	lastSeen: Date | null;
	visits: number;
}

export async function getFollower(userUUID: UUID, followerUserUUID: UUID): Promise<Followers | undefined> {
	return await db().query.followers.findFirst({
		where: and(
			eq(followers.userUUID, userUUID),
			eq(followers.followerUserUUID, followerUserUUID),
		)
	});
}

export async function listFollowers(userUUID: UUID): Promise<(Followers & { followerUser: Users })[]> {
	return await db().query.followers.findMany({
		with: {
			followerUser: true
		},
		where: and(
			eq(followers.userUUID, userUUID),
		),
	});
}

export async function listFollowersStats(userUUID: UUID): Promise<FollowerStats[]> {
	const subquery = db()
		.select({
			linkUserUUID: visits.linkUserUUID,
			visitorUserUUID: visits.visitorUserUUID,
			lastSeen: max(visits.timestamp).as('last_seen'),
			count: count().as('count')
		})
		.from(visits)
		.where(eq(visits.linkUserUUID, userUUID))
		.groupBy(visits.linkUserUUID, visits.visitorUserUUID)
		.as('visits')

	const followerUser = alias(users, 'followerUser')
	const followingUser = alias(users, 'followingUser')

	return await db()
		.select({
			userUUID: followers.userUUID,
			userName: followingUser.name,
			followerUserUUID: followers.followerUserUUID,
			followerUserName: followerUser.name,
			status: followers.status,
			enabledNotifications: followers.enabledNotifications,
			lastSeen: subquery.lastSeen,
			visits: subquery.count
		})
		.from(followers)
		.leftJoin(subquery, and(
			eq(followers.userUUID, subquery.linkUserUUID),
			eq(followers.followerUserUUID, subquery.visitorUserUUID),
		))
		.innerJoin(followingUser, eq(followers.userUUID, followingUser.uuid))
		.innerJoin(followerUser, eq(followers.followerUserUUID, followerUser.uuid))
		.where(eq(followers.userUUID, userUUID))
}

export async function listFollowing(userUUID: UUID): Promise<FollowersWithNames[]> {
	const followerUser = alias(users, 'followerUser')
	const followingUser = alias(users, 'followingUser')

	return db()
		.select({
			...getTableColumns(followers),
			userName: followingUser.name,
			followerUserName: followerUser.name,
		})
		.from(followers)
		.innerJoin(followingUser, eq(followers.userUUID, followingUser.uuid))
		.innerJoin(followerUser, eq(followers.followerUserUUID, followerUser.uuid))
		.where(eq(followers.followerUserUUID, userUUID))
}


export async function removeFollower(userUUID: UUID, followerUserUUID: UUID): Promise<void> {
	await db()
		.delete(followers)
		.where(and(
			eq(followers.userUUID, userUUID),
			eq(followers.followerUserUUID, followerUserUUID),
		))
}

export async function setFollowerStatus(userUUID: UUID, followerUserUUID: UUID, followStatus: FollowStatus): Promise<void> {
	await db().update(followers)
		.set({ status: followStatus })
		.where(and(
			eq(followers.userUUID, userUUID),
			eq(followers.followerUserUUID, followerUserUUID),
		))
}

export async function setFollowerEnabledNotifications(userUUID: UUID, followerUserUUID: UUID, enabledNotifications: boolean): Promise<void> {
	await db().update(followers)
		.set({ enabledNotifications })
		.where(and(
			eq(followers.userUUID, userUUID),
			eq(followers.followerUserUUID, followerUserUUID),
		))
}

export async function createFollowLink(userUUID: UUID, uses: 'single' | 'multi', expiresIn: number | null = null): Promise<string> {
	const token = generateJWT({ uses })
	const actionToken = await createActionToken(token, userUUID, Action.FOLLOW_USER, expiresIn)

	const qp = new URLSearchParams()
	qp.set('token', actionToken.token)
	return `${env.PUBLIC_URL ?? 'http://localhost'}/athlete/${userUUID}/follow?${qp.toString()}`
}
