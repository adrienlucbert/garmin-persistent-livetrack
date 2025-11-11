<script lang="ts">
	import { enhance } from '$app/forms';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { m } from '$lib/paraglide/messages.js';

	let {
		method,
		action,
		followURL,
		message,
		token,
		navigate
	}: {
		method?: 'dialog' | 'get' | 'post' | 'DIALOG' | 'GET' | 'POST';
		action: string;
		followURL: string | null;
		message?: string;
		token: string;
		navigate: (tab: 'signin') => void;
	} = $props();
</script>

<Card.Root class="sm:mx-auto sm:w-full sm:max-w-md">
	<Card.Header>
		<Card.Title>{m.reset_password_title()}</Card.Title>
		<Card.Description>{m.reset_password_text()}</Card.Description>
		<Card.Action>
			<Button onclick={() => navigate('signin')} variant="link">{m.sign_in_button()}</Button>
		</Card.Action>
	</Card.Header>
	<Card.Content>
		<form {method} {action} use:enhance>
			<div class="flex flex-col gap-6">
				<Input name="token" type="hidden" value={token} />
				<Input name="follow" type="hidden" value={followURL} />
				<div class="grid gap-2">
					<Label for="password">{m.new_password_label()}</Label>
					<Input
						id="password"
						name="password"
						type="password"
						placeholder={m.new_password_placeholder()}
						required
					/>
				</div>
				<div class="grid gap-2">
					<Label for="confirm_password">{m.confirm_new_password_label()}</Label>
					<Input
						id="confirm_password"
						name="confirm_password"
						type="password"
						placeholder={m.confirm_new_password_placeholder()}
						required
					/>
				</div>
				<div class="grid gap-2">
					<Button type="submit" class="w-full">{m.reset_password_button()}</Button>
					<p class="text-red-400">{message ?? ''}</p>
				</div>
			</div>
		</form>
	</Card.Content>
</Card.Root>
