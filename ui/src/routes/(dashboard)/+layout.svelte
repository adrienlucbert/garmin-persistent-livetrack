<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import { currentPage, pages } from '$lib/pages.svelte';

	let { children } = $props();
	let cp = $derived(currentPage());
</script>

<div>
	{#if cp}
		<h1 class="scroll-m-20 p-6 text-2xl font-semibold tracking-tight">
			<cp.icon class="center mr-4 inline size-6 align-middle" />
			{cp.title}
		</h1>
		<Separator orientation="horizontal" />
	{/if}
	<div class="p-2">
		{@render children?.()}
	</div>
</div>
