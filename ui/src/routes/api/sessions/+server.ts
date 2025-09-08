import { error, json } from '@sveltejs/kit'
import { createBlankLiveTrackSession } from '$lib/server/liveTrackSession'
import type { RequestEvent } from './$types'

export async function POST(event: RequestEvent) {
	if (!event.locals.user) {
		throw error(401);
	}

	const sessionUUID = createBlankLiveTrackSession(event.locals.user.uuid)
	return json(sessionUUID)
}
