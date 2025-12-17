import { error, type RequestEvent } from "@sveltejs/kit";
import { StatusCodes } from 'http-status-codes';
import { resolveOAuth } from "$lib/server/auth/flows";

export async function GET(event: RequestEvent): Promise<Response> {
	try {
		const { followURL } = await resolveOAuth(event.params.provider || '', event)

		return new Response(null, {
			status: StatusCodes.MOVED_TEMPORARILY,
			headers: {
				Location: followURL ?? "/"
			}
		});
	} catch (message) {
		throw error(StatusCodes.BAD_REQUEST, { message: String(message) })
	}
}
