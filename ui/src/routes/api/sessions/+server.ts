import { error, json } from '@sveltejs/kit'
import { createBlankTrackingLink as createBlankTrackingLink } from '$lib/server/link/trackingLink'
import type { RequestEvent } from './$types'

export async function POST(event: RequestEvent) {
	if (!event.locals.user) {
		throw error(401);
	}

	const sessionUUID = createBlankTrackingLink(event.locals.user.uuid)
	return json(sessionUUID)
}
