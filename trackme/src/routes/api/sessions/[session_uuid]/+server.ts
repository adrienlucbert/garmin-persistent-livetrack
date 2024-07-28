import type { PageServerLoadEvent } from './$types'
import { TypeOrm } from '$lib/orm/typeorm'
import { LiveTrackSession } from '$lib/orm/models/LiveTrackSession'
import { StatusCodes } from 'http-status-codes'
import { error, json } from '@sveltejs/kit'

export async function GET({ params }: PageServerLoadEvent) {
	const db = await TypeOrm.db()
	const session = await db.getRepository(LiveTrackSession).findOneBy({ uuid: params.session_uuid })
	if (session === null) {
		error(StatusCodes.NOT_FOUND)
	}
	return json(session)
}

export async function PUT({ params, request }: PageServerLoadEvent) {
	const body = await request.json()
	if (!body.link) {
		error(StatusCodes.BAD_REQUEST, { message: "Missing 'link' field in request body." })
	}
	const db = await TypeOrm.db()
	const result = await db
		.getRepository(LiveTrackSession)
		.update(
			{ uuid: params.session_uuid },
			{ link: body.link }
		)
	if (!result.affected) {
		error(StatusCodes.NOT_FOUND)
	}
	return new Response()
}
