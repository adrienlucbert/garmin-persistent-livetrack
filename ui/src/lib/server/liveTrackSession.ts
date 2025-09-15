import { db } from '$lib/server/db';
import { liveTrackSessions, type LiveTrackSessions, type PublicUserWithTraits } from '$lib/server/db/schema';
import { randomUUID, type UUID } from 'crypto';
import { eq } from 'drizzle-orm';

export async function createBlankLiveTrackSession(userUUID: UUID): Promise<UUID> {
	const sessionUUID = randomUUID()
	const blankSession: LiveTrackSessions = {
		uuid: sessionUUID,
		userUUID: userUUID,
		link: null,
		updatedAt: new Date(),
	}
	await db().insert(liveTrackSessions).values(blankSession)

	return sessionUUID
}

export async function getLiveTrackSession(sessionUUID: UUID): Promise<LiveTrackSessions & { user: PublicUserWithTraits }> {
	const liveTrackSession = db().query.liveTrackSessions.findFirst({
		with: {
			user: {
				with: {
					passwordTrait: {
						columns: {
							passwordHash: false
						}
					},
					githubTrait: true,
					googleTrait: true,
				}
			}
		},
		where: eq(liveTrackSessions.uuid, sessionUUID)
	})

	if (!liveTrackSession) {
		return Promise.reject('Livetrack session is invalid')
	}

	return liveTrackSession
}

export async function updateLiveTrackSessionLink(sessionUUID: UUID, link: string): Promise<void> {
	const updatedRows = await db().update(liveTrackSessions)
		.set({
			link: link,
			updatedAt: new Date(),
		})
		.where(eq(liveTrackSessions.uuid, sessionUUID))
		.returning()

	if (!updatedRows) {
		return Promise.reject('Livetrack session is invalid')
	}
}
