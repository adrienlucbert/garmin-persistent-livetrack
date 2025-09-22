import { db } from '$lib/server/db';
import { trackingLinks, type TrackingLinks } from '$lib/server/db/schema';
import { type UUID } from 'crypto';
import { eq } from 'drizzle-orm';

export async function createBlankTrackingLink(userUUID: UUID): Promise<TrackingLinks> {
	const blankSession = {
		userUUID: userUUID,
		link: null,
	}
	return (await db().insert(trackingLinks).values(blankSession).returning())[0]
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

export async function updateTrackingLink(userUUID: UUID, link: string): Promise<void> {
	const updatedRows = await db().update(trackingLinks)
		.set({
			link: link,
			updatedAt: new Date(),
		})
		.where(eq(trackingLinks.userUUID, userUUID))
		.returning()

	if (updatedRows.length === 0) {
		return Promise.reject('Livetrack session is invalid')
	}
}
