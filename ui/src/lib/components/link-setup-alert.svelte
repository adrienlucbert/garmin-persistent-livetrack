<script lang="ts">
	import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';
	import * as Alert from '$lib/components/ui/alert';
	import { DotLoader } from '$lib/components/ui/dot-loader';
	import Sse from '$lib/components/sse.svelte';
	import type { PublicUserWithTraits, TrackingLinks } from '$lib/server/db/schema';
	import { pages } from '$lib/pages.svelte';

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
		<Alert.Title class="line-clamp-none tracking-normal">You're all set!</Alert.Title>
		<Alert.Description>
			<p>
				We received notice of your new activity, you're good to go!
				<br />
				You can preview your latest activty in the
				<a class="underline-offset-4 hover:underline" href={pages().manageAccess.url}>
					{pages().manageAccess.title}
				</a> tab.
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
							We're waiting for you to start a new activity
							<DotLoader class="w-4" />
						</Alert.Title>
						<Alert.Description>
							<p>
								Start a new activity on your Garmin device and start the LiveTrack session from your
								Garmin Connect™ app to verify that you set it up correctly.
							</p>
						</Alert.Description>
					</Alert.Root>
				{:else}
					{@render setupSuccessMessage()}
				{/if}
			{/snippet}
		</Sse>
	{/if}
</div>
