<script lang="ts" generics="T">
	import { subscribe } from '$lib/stores/sse';
	import type { Snippet } from 'svelte';

	const {
		channel = 'default',
		content
	}: {
		channel?: string;
		content: Snippet<[T | null]>;
	} = $props();

	const store = subscribe<T>(channel);
</script>

{@render content($store)}
