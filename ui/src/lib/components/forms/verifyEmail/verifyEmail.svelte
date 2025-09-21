<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

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
		<Card.Title>Email verification</Card.Title>
		<Card.Description>
			{#if success}
				Your email address was successfully verified. You can now close this page.
			{:else}
				<p class="text-destructive">
					Your email address couldn't be verified. {message}
				</p>
			{/if}
		</Card.Description>
	</Card.Header>
	<Card.Content>
		<Button onclick={() => navigate('signin')} class="w-full">Go to the login page</Button>
	</Card.Content>
</Card.Root>
