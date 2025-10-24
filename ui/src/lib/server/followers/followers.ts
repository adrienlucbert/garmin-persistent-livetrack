import { db } from '$lib/server/db';
import { followers, visits, type Followers } from '$lib/server/db/schema';
import { FollowStatus } from '$lib/types/followers';
import { type UUID } from 'crypto';
import { and, count, eq, max } from 'drizzle-orm';

export async function addFollower(userUUID: UUID, followerUserUUID: UUID): Promise<void> {
	await db()
		.insert(followers)
		.values({
			userUUID,
			followerUserUUID,
		})
}

export type FollowerStats = Followers & {
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

	return await db()
		.select({
			userUUID: followers.userUUID,
			followerUserUUID: followers.followerUserUUID,
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
		.where(eq(followers.userUUID, userUUID))
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
