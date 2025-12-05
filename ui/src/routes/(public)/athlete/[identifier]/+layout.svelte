<script lang="ts">
	import { page } from '$app/state';
	import { getContext, onDestroy, onMount } from 'svelte';
	import { type HeaderContext } from '$lib/types/contexts/header.js';
	import { Button } from '$lib/components/ui/button';
	import { m } from '$lib/paraglide/messages.js';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { pages } from '$lib/pages.svelte.js';

	let { data, children } = $props();
	const { trackingLink, follow, user } = data;

	const header = getContext<HeaderContext>('header');

	onMount(() => {
		header?.addAction('info', infoHeaderAction);

		if (
			follow &&
			user?.notificationPreferences.new_livetrack.push &&
			Notification.permission !== 'granted'
		) {
			toast.warning(m.push_notifications_not_setup_title(), {
				description: m.push_notifications_not_setup_body({ tab: pages().account.title }),
				duration: 15000,
				action: {
					label: m.push_notifications_not_setup_button(),
					onClick: () => goto('/account#notifications')
				}
			});
		}
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
