<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
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

<Card.Root class="sm:mx-auto sm:w-full sm:max-w-md">
	<Card.Header>
		<Card.Title>{m.email_verification_title()}</Card.Title>
		<Card.Description>
			{#if success}
				{m.email_verification_success_text()}
			{:else}
				<p class="text-destructive">
					{m.email_verification_error_text({ message: message || '' })}
				</p>
			{/if}
		</Card.Description>
	</Card.Header>
	<Card.Content>
		<Button onclick={() => navigate('signin')} class="w-full">{m.sign_in_button()}</Button>
	</Card.Content>
</Card.Root>
