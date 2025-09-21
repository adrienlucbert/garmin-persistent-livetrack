import { initOAuth } from "$lib/server/auth/flows";

import { error, type RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent): Promise<Response> {
	try {
		const url = await initOAuth(event.params.provider || '', event.cookies, event.url.searchParams.get('follow'))

		return new Response(null, {
			status: 302,
			headers: {
				Location: url.toString()
			}
		});
	} catch (message) {
		throw error(400, { message: String(message) })
	}
}
