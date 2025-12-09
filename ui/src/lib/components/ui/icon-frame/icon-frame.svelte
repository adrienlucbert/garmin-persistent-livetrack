<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { Snippet } from 'svelte';

	let { class: className, children }: { class?: string; children: Snippet } = $props();
</script>

<div
	class={cn(
		"icon-frame shadow-xs inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-neutral-100 align-middle text-sm text-neutral-900 [&_svg:not([class*='size-'])]:size-6",
		className
	)}
>
	{@render children?.()}
</div>
