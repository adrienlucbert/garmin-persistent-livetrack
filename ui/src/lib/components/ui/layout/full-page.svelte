<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let {
		children,
		class: className,
		...restProps
	}: { children: Snippet; class?: string } = $props();
</script>

<div class={cn('min-h-[calc(100vh-var(--header-height))] w-full', className)} {...restProps}>
	{@render children?.()}
</div>
