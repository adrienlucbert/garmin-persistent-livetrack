<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';
	import InfoIcon from '@lucide/svelte/icons/info';
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	import { m } from '$lib/paraglide/messages.js';
	import {
		ensureNotificationSubscription,
		NotificationSubscriptionManager as nsm
	} from '$lib/webpush.svelte';
	import { toast } from 'svelte-sonner';
	import { isStandalone } from '$lib/platform';
	import InstallPWA from '$lib/components/forms/account/installPWA.svelte';
	import { supportsInstallPrompt, deferredInstall } from '$lib/pwa.svelte';

	const { pubkey, appName }: { pubkey: string; appName: string } = $props();

	let granted = $state<boolean | null>(null);

	let isInstalled = $derived(
		isStandalone() || (supportsInstallPrompt && !deferredInstall.available)
	);

	onMount(async () => {
		granted = nsm.isGranted();
	});
</script>

{#if !isInstalled}
	{#if nsm.isAvailable()}
		<Alert.Root variant="default">
			<InfoIcon />
			<Alert.Description class="flex">
				<div class="flex w-full flex-col gap-4 md:flex-row">
					<p class="grow">{@html m.webpush_pwa_warning()}</p>
					<InstallPWA {appName} variant="card-outline" />
				</div>
			</Alert.Description>
		</Alert.Root>
	{:else}
		<Alert.Root variant="warning">
			<CircleAlertIcon />
			<Alert.Description class="flex">
				<div class="flex w-full flex-col gap-4 md:flex-row">
					<p class="grow">{@html m.webpush_install_warning()}</p>
					<InstallPWA {appName} variant="warning-outline" />
				</div>
			</Alert.Description>
		</Alert.Root>
	{/if}
{:else if !nsm.isAvailable()}
	<Alert.Root variant="warning">
		<CircleAlertIcon />
		<Alert.Title class="line-clamp-none tracking-normal">
			{m.notifications_not_supported_title()}
		</Alert.Title>
		<Alert.Description>
			{m.notifications_not_supported_body()}
		</Alert.Description>
	</Alert.Root>
{/if}

{#if nsm.isAvailable() && granted === false}
	<Alert.Root variant="warning">
		<CircleAlertIcon />
		<Alert.Title class="line-clamp-none tracking-normal">
			{m.enable_notifications_title()}
		</Alert.Title>
		<Alert.Description>
			<div class="flex w-full flex-col gap-4 md:flex-row">
				<p class="grow">
					{m.enable_notifications_text()}
				</p>
				<Button
					variant="warning-outline"
					onclick={() =>
						nsm.requestPermission().then((ok) => {
							granted = ok;
							if (granted) {
								ensureNotificationSubscription(pubkey).catch((err) => toast.error(String(err)));
							} else {
								toast.warning(m.notifications_permission_denied(), { duration: 5000 });
							}
						})}
				>
					{m.enable_notifications_button()}
				</Button>
			</div>
		</Alert.Description>
	</Alert.Root>
{/if}
