import { broadcast, createStream } from '$lib/server/sse';
import { error } from '@sveltejs/kit';

export const GET = async ({ locals, url }) => {
	if (!locals.user) {
		throw error(401, 'User is not logged in')
	}
	const channel = url.searchParams.get('channel') || 'default';

	const stream = createStream(channel)
	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream'
		}
	});
}
