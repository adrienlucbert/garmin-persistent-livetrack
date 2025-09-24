type Channel = string
const clients: Map<Channel, Set<WritableStreamDefaultWriter>> = new Map();

export function createStream(channel: Channel = 'default'): ReadableStream {
	const { readable, writable } = new TransformStream();
	const writer = writable.getWriter();

	if (!clients.has(channel)) clients.set(channel, new Set());
	clients.get(channel)?.add(writer);

	return readable
}

export async function broadcast(channel: Channel, message: any) {
	const channelClients = clients.get(channel)
	if (!channelClients) return

	for (const client of channelClients) {
		try {
			await client.write(`data: ${JSON.stringify(message)}\n\n`);
		} catch {
			channelClients.delete(client)
			try { await client.close() } catch { }
		}
	}
}
