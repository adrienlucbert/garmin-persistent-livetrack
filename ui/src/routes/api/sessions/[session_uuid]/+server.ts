import { error, json } from '@sveltejs/kit'
import type { RequestEvent } from './$types'
import { getLiveTrackSession, updateLiveTrackSessionLink } from '$lib/server/liveTrackSession'
import type { UUID } from 'crypto'

export async function GET({ params }: RequestEvent) {
	const session = await getLiveTrackSession(params.session_uuid as UUID)

	if (!session) {
		error(404)
	}

	return json(session)
}

export async function PUT({ params, request }: RequestEvent) {
	const body = await request.json()
	if (!body.link) {
		error(400, { message: "Missing 'link' field in request body." })
	}

	try {
		await updateLiveTrackSessionLink(params.session_uuid as UUID, body.link)
	} catch {
		error(404)
	}

	return new Response()
}
