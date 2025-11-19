import { db } from '$lib/server/db';
import { trackingLinks, users, type TrackingLinks } from '$lib/server/db/schema';
import { type UUID } from 'crypto';
import { eq } from 'drizzle-orm';
import { m } from '$lib/paraglide/messages.js';

export async function createOrUpdateTrackingLink(userUUID: UUID, link: string): Promise<TrackingLinks> {
	const user = await db().query.users.findFirst({
		where: eq(users.uuid, userUUID)
	})
	if (!user) {
		return Promise.reject(m.invalid_user_uuid())
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

export async function getTrackingLink(userUUID: UUID): Promise<TrackingLinkWithUser> {
	const trackingLink = await db().query.trackingLinks.findFirst({
		with: {
			user: { columns: { uuid: true, name: true } }
		},
		where: eq(trackingLinks.userUUID, userUUID),
	})

	if (!trackingLink) {
		return Promise.reject(m.invalid_livetrack_session())
	}

	return trackingLink
}

