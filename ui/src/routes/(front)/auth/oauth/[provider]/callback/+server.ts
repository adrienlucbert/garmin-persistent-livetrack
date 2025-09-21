import { error, type RequestEvent } from "@sveltejs/kit";
import { resolveOAuth } from "$lib/server/auth/flows";

export async function GET(event: RequestEvent): Promise<Response> {
	try {
		await resolveOAuth(event.params.provider || '', event)

		return new Response(null, {
			status: 302,
			headers: {
				Location: "/"
			}
		});
	} catch (message) {
		throw error(400, { message: String(message) })
	}
}
