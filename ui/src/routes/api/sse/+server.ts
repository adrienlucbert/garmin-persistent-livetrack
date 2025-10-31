import { createStream } from '$lib/server/sse';
import { error } from '@sveltejs/kit';
import { m } from '$lib/paraglide/messages.js';

export const GET = async ({ locals, url }) => {
	if (!locals.user) {
		throw error(401, m.user_not_logged_in())
	}
	const channel = url.searchParams.get('channel') || 'default';

	const stream = createStream(channel)
	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream'
		}
	});
}
