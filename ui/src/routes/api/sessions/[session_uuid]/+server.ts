import { SMTP_PROXY_BASIC_AUTH } from "$env/static/private";
import { error } from '@sveltejs/kit'
import type { RequestEvent } from './$types'
import { createOrUpdateTrackingLink } from '$lib/server/link/trackingLink'
import type { UUID } from 'crypto'
import { broadcast } from '$lib/server/sse'
import { m } from '$lib/paraglide/messages.js';

export async function PUT({ params, request }: RequestEvent) {
	const auth = request.headers.get("Authorization");
	if (!auth) {
		error(400, { message: m.missing_header({ header: "Authorization" }) })
	}

	if (auth !== `Basic ${btoa(SMTP_PROXY_BASIC_AUTH)}`) {
		error(401, { message: m.invalid_header({ header: "Authorization" }) })
	}

	const body = await request.json()
	if (!body.link) {
		error(400, { message: m.missing_field_in_body({ field: "link" }) })
	}

	try {
		const updatedTrackingLink = await createOrUpdateTrackingLink(params.session_uuid as UUID, body.link)
		try {
			broadcast(`update-link-${params.session_uuid}`, updatedTrackingLink)
		} catch (e) { console.error(e) }
	} catch (e) {
		if (e === m.invalid_user_uuid()) {
			error(404)
		} else {
			error(500, { message: String(e) })
		}
	}

	return new Response()
}
