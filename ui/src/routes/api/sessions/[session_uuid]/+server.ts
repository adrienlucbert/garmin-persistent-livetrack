import { error } from '@sveltejs/kit'
import type { RequestEvent } from './$types'
import { createOrUpdateTrackingLink } from '$lib/server/link/trackingLink'
import type { UUID } from 'crypto'
import { broadcast } from '$lib/server/sse'

export async function PUT({ params, request }: RequestEvent) {
	// TODO: set basic auth
	const body = await request.json()
	if (!body.link) {
		error(400, { message: "Missing 'link' field in request body." })
	}

	try {
		const updatedTrackingLink = await createOrUpdateTrackingLink(params.session_uuid as UUID, body.link)
		try {
			broadcast(`update-link-${params.session_uuid}`, updatedTrackingLink)
		} catch (e) { console.error(e) }
	} catch (e) {
		if (e === 'Invalid user UUID') {
			error(404)
		} else {
			error(500, { message: String(e) })
		}
	}


	return new Response()
}
