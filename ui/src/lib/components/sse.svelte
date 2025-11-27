<script lang="ts" generics="T">
	import { subscribe } from '$lib/stores/sse';
	import type { Snippet } from 'svelte';

	const {
		channel = 'default',
		onupdate,
		content
	}: {
		channel?: string;
		onupdate?: (value: T | null) => void;
		content: Snippet<[T | null]>;
	} = $props();

	const store = subscribe<T>(channel);

	$effect(() => {
		onupdate?.($store);
	});
</script>

{@render content($store)}
