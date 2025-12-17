import { initOAuth } from "$lib/server/auth/flows";
import { StatusCodes } from 'http-status-codes';

import { error, type RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent): Promise<Response> {
	try {
		const url = await initOAuth(event.params.provider || '', event.cookies, event.url.searchParams.get('follow'))

		return new Response(null, {
			status: StatusCodes.MOVED_TEMPORARILY,
			headers: {
				Location: url.toString()
			}
		});
	} catch (message) {
		throw error(StatusCodes.BAD_REQUEST, { message: String(message) })
	}
}
