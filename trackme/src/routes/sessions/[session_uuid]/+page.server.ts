import type { PageServerLoadEvent } from './$types'
import { TypeOrm } from '$lib/orm/typeorm'
import { LiveTrackSession } from '$lib/orm/models/LiveTrackSession'
import { error } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import { instanceToPlain } from 'class-transformer'

export async function load({ params }: PageServerLoadEvent) {
	const db = await TypeOrm.db()
	const session = await db
		.getRepository(LiveTrackSession)
		.findOneBy({ uuid: params.session_uuid })
	if (session === null) {
		error(StatusCodes.NOT_FOUND)
	}
	return instanceToPlain(session)
}
