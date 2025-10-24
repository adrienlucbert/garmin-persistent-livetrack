import { db } from '$lib/server/db';
import { trackingLinks, users, type TrackingLinks } from '$lib/server/db/schema';
import { type UUID } from 'crypto';
import { eq } from 'drizzle-orm';

export async function createOrUpdateTrackingLink(userUUID: UUID, link: string): Promise<TrackingLinks> {
	const user = await db().query.users.findFirst({
		where: eq(users.uuid, userUUID)
	})
	if (!user) {
		return Promise.reject('Invalid user UUID')
	}

	const updatedRows = await db()
		.insert(trackingLinks)
		.values({
			userUUID: userUUID,
			link: link,
		})
		.onConflictDoUpdate({
			target: trackingLinks.userUUID,
			set: {
				link: link,
				updatedAt: new Date(),
			},
		})
		.returning()

	if (updatedRows.length === 0) {
		return Promise.reject('Livetrack session is invalid')
	}

	return updatedRows[0]
}

export async function setTrackingLinkVisibility(userUUID: UUID, isPublic: boolean): Promise<void> {
	await db().update(trackingLinks)
		.set({ isPublic })
		.where(eq(trackingLinks.userUUID, userUUID))
}


export async function getTrackingLink(userUUID: UUID): Promise<TrackingLinks> {
	const trackingLink = await db().query.trackingLinks.findFirst({
		where: eq(trackingLinks.userUUID, userUUID)
	})

	if (!trackingLink) {
		return Promise.reject('Livetrack session is invalid')
	}

	return trackingLink
}

