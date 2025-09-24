import { readable } from "svelte/store";

export function subscribe<T = any>(channel: string = 'default') {
	if (typeof window === 'undefined' || typeof EventSource === 'undefined') {
		return readable<T | null>(null, () => { });
	}

	return readable<T | null>(null, (set) => {
		const sse = new EventSource(`/api/sse?channel=${channel}`);

		sse.onmessage = (e) => {
			try {
				set(JSON.parse(e.data));
			} catch {
				set(e.data as T);
			}
		};

		sse.onerror = sse.close

		return () => {
			sse.close();
		}
	});
}
