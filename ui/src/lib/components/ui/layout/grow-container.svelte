<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let {
		children,
		class: className,
		...restProps
	}: { children: Snippet; class?: string } = $props();
</script>

<div class={cn('flex flex-grow flex-col', className)} {...restProps}>
	{@render children?.()}
</div>
