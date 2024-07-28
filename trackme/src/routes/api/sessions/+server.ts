import { TypeOrm } from '$lib/orm/typeorm'
import { LiveTrackSession } from '$lib/orm/models/LiveTrackSession'
import { json } from '@sveltejs/kit'

export async function POST() {
	const db = await TypeOrm.db()
	const result = await db
		.getRepository(LiveTrackSession)
		.insert({})
	return json(result.identifiers[0])
}
