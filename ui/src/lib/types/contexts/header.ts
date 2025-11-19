import type { Snippet } from 'svelte';

export type HeaderContext = {
	addAction: (name: string, snippet: () => ReturnType<Snippet>) => void,
	deleteAction: (name: string) => void,
}
