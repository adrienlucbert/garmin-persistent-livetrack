<script lang="ts">
	import { page } from '$app/state';
	import { getContext, onDestroy, onMount } from 'svelte';
	import { type HeaderContext } from '$lib/types/contexts/header.js';
	import { Button } from '$lib/components/ui/button';
	import { m } from '$lib/paraglide/messages.js';

	let { data, children } = $props();
	const { trackingLink, follow, user } = data;

	const header = getContext<HeaderContext>('header');

	onMount(() => {
		header?.addAction('info', infoHeaderAction);
	});

	onDestroy(() => {
		header?.deleteAction('info');
	});
</script>

{#snippet infoHeaderAction()}
	{#if trackingLink && trackingLink.userUUID !== user?.uuid && !follow}
		<Button variant="ghost" href={`${page.params.identifier}/follow`} data-sveltekit-reload>
			{m.follow()}
		</Button>
	{/if}
{/snippet}

{@render children?.()}
