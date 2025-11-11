<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import CheckIcon from '@lucide/svelte/icons/check';
	import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';
	import { ResendEmailButton } from '$lib/components/forms/verifyEmail';
	import { m } from '$lib/paraglide/messages.js';

	let {
		success,
		message,
		navigate
	}: {
		success: boolean;
		message?: string;
		navigate: (tab: 'signin') => void;
	} = $props();
</script>

<Alert.Root variant={success ? 'success' : 'warning'}>
	{#if success}
		<CheckIcon />
	{:else}
		<CircleAlertIcon />
	{/if}
	<Alert.Title class="line-clamp-none tracking-normal">{m.email_verification_title()}</Alert.Title>
	<Alert.Description>
		<div class="flex flex-row gap-4">
			{#if success}
				{m.email_verification_success_text()}
			{:else}
				{m.email_verification_error_text({ message: message || '' })}
			{/if}
		</div>
		{#if success}
			<Button onclick={() => navigate('signin')} class="mt-4 mb-2 px-8" variant="default">
				{m.sign_in_button()}
			</Button>
		{:else}
			<ResendEmailButton class="mt-4 mb-2 px-8" variant="warning-outline" />
		{/if}
	</Alert.Description>
</Alert.Root>
