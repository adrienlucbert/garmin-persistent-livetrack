import { db } from '$lib/server/db';
import { trackingLinks, type TrackingLinks } from '$lib/server/db/schema';
import { type UUID } from 'crypto';
import { eq } from 'drizzle-orm';
import { m } from '$lib/paraglide/messages.js';

export async function updateTrackingLink(linkUUID: UUID, link: string): Promise<TrackingLinks> {
	const updatedRows = await db()
		.update(trackingLinks)
		.set({
			link: link,
			updatedAt: new Date(),
		})
		.where(
			eq(trackingLinks.uuid, linkUUID)
		)
		.returning()

	if (updatedRows.length === 0) {
		return Promise.reject(m.invalid_livetrack_session())
	}

	return updatedRows[0]
}

export async function setTrackingLinkVisibility(userUUID: UUID, isPublic: boolean): Promise<void> {
	await db().update(trackingLinks)
		.set({ isPublic })
		.where(eq(trackingLinks.userUUID, userUUID))
}

export type TrackingLinkWithUser = TrackingLinks & { user: { uuid: string, name: string } }

export async function getTrackingLinkByUserUUID(userUUID: UUID): Promise<TrackingLinkWithUser> {
	const trackingLink = await db().query.trackingLinks.findFirst({
		with: {
			user: { columns: { uuid: true, name: true } }
		},
		where: eq(trackingLinks.userUUID, userUUID),
	})

	if (!trackingLink || !trackingLink.user) {
		return Promise.reject(m.invalid_livetrack_session())
	}

	return trackingLink as TrackingLinkWithUser
}

