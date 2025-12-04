<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { m } from '$lib/paraglide/messages.js';

	let granted = $state<boolean | null>(null);
	let subscribed = $state(false);

	const { pubkey }: { pubkey: string } = $props();

	onMount(async () => {
		granted = Notification.permission === 'granted';
	});

	$effect(() => {
		if (granted) {
			checkSubscription().then((isSubscribed) => {
				subscribed = isSubscribed;
				if (!subscribed) {
					subscribe();
				}
			});
		}
	});

	function requestNotificationPermission() {
		Notification.requestPermission().then((permission) => {
			granted = permission === 'granted';
		});
	}

	async function checkSubscription() {
		if (!('serviceWorker' in navigator)) {
			return false;
		}

		const registration = await navigator.serviceWorker.ready;
		const subscription = await registration.pushManager.getSubscription();

		const exists = subscription !== null;
		if (exists) {
			try {
				await persistSubscription(subscription);
			} catch (error) {
				toast.error(String(error));
				unsubscribe();
			}
		}
		return exists;
	}

	async function persistSubscription(subscription: PushSubscription) {
		const res = await fetch('/api/user/notifications/subscribe', {
			method: 'POST',
			body: JSON.stringify({ subscription })
		});
		if (!res.ok) {
			throw new Error(`Error saving subscription on server`);
		}
	}

	async function subscribe() {
		if (!('serviceWorker' in navigator)) {
			return;
		}

		try {
			const registration = await navigator.serviceWorker.ready;
			const subscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: pubkey
			});
			subscribed = true;
			persistSubscription(subscription);
		} catch (error) {
			toast.error(String(error));
		}
	}

	async function unsubscribe() {
		if (!('serviceWorker' in navigator)) {
			return;
		}

		const registration = await navigator.serviceWorker.ready;
		const subscription = await registration.pushManager.getSubscription();
		if (subscription) {
			await subscription.unsubscribe();
			subscribed = false;
		}
	}
</script>

{#if granted === false}
	<Alert.Root variant="warning">
		<CircleAlertIcon />
		<Alert.Title class="line-clamp-none tracking-normal">
			{m.enable_notifications_title()}
		</Alert.Title>
		<Alert.Description>
			<div class="flex flex-col gap-4 md:flex-row">
				<p>
					{m.enable_notifications_text()}
				</p>
				<Button variant="warning-outline" onclick={requestNotificationPermission}>
					{m.enable_notifications_button()}
				</Button>
			</div>
		</Alert.Description>
	</Alert.Root>
{/if}
