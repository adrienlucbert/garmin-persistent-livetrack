<script lang="ts">
	import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';
	import * as Alert from '$lib/components/ui/alert';
	import { DotLoader } from '$lib/components/ui/dot-loader';
	import Sse from '$lib/components/sse.svelte';
	import type { PublicUserWithTraits, TrackingLinks } from '$lib/server/db/schema';
	import { pages } from '$lib/pages.svelte';
	import { m } from '$lib/paraglide/messages.js';

	let {
		user,
		link
	}: {
		user: PublicUserWithTraits;
		link?: TrackingLinks;
	} = $props();
</script>

{#snippet setupSuccessMessage()}
	<Alert.Root variant="success" class="mt-6">
		<CircleAlertIcon />
		<Alert.Title class="line-clamp-none tracking-normal">{m.link_setup_youre_all_set()}</Alert.Title
		>
		<Alert.Description>
			<p>
				{m.link_setup_we_received_notice()}
				<br />
				{m.link_setup_preview_your_latest_activity()}
				<a class="underline-offset-4 hover:underline" href={pages().manageAccess.url}>
					{pages().manageAccess.title}
				</a>{m.link_setup_tab()}
			</p>
		</Alert.Description>
	</Alert.Root>
{/snippet}

<div class="mt-6">
	{#if link && link.link !== null}
		{@render setupSuccessMessage()}
	{:else}
		<Sse channel={`update-link-${user?.uuid}`}>
			{#snippet content(message: { link: string } | null)}
				{#if message === null}
					<Alert.Root variant="warning" class="mt-6">
						<CircleAlertIcon />
						<Alert.Title class="line-clamp-none tracking-normal">
							{m.link_setup_waiting_for_activity()}
							<DotLoader class="w-4" />
						</Alert.Title>
						<Alert.Description>
							<p>{m.link_setup_start_new_activity()}</p>
						</Alert.Description>
					</Alert.Root>
				{:else}
					{@render setupSuccessMessage()}
				{/if}
			{/snippet}
		</Sse>
	{/if}
</div>
