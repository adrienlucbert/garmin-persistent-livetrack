<script lang="ts">
	import { enhance } from '$app/forms';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { m } from '$lib/paraglide/messages.js';

	let {
		action,
		followURL,
		message,
		navigate
	}: {
		action: string;
		followURL: string | null;
		message?: string;
		navigate: (tab: 'signin') => void;
	} = $props();
</script>

<Card.Root class="sm:mx-auto sm:w-full sm:max-w-md">
	<Card.Header>
		<Card.Title>{m.recover_account_title()}</Card.Title>
		<Card.Description>
			{m.recover_account_text()}
		</Card.Description>
		<Card.Action>
			<Button onclick={() => navigate('signin')} variant="link">{m.sign_in_button()}</Button>
		</Card.Action>
	</Card.Header>
	<Card.Content>
		<form method="POST" {action} use:enhance>
			<div class="flex flex-col gap-6">
				<Input name="follow" type="hidden" value={followURL} />
				<div class="grid gap-2">
					<Label for="email">{m.email_label()}</Label>
					<Input
						id="email"
						name="email"
						type="email"
						placeholder={m.email_placeholder()}
						required
					/>
				</div>
				<div class="grid gap-2">
					<Button type="submit" class="w-full">{m.send_email_button()}</Button>
					<p class="text-red-400">{message ?? ''}</p>
				</div>
			</div>
		</form>
	</Card.Content>
</Card.Root>
