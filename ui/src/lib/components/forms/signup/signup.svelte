<script lang="ts">
	import { enhance } from '$app/forms';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import Socials from '$lib/components/forms/socials.svelte';
	import { m } from '$lib/paraglide/messages.js';

	let {
		method,
		action,
		withGoogle,
		withGithub,
		followURL,
		message,
		navigate
	}: {
		method?: 'dialog' | 'get' | 'post' | 'DIALOG' | 'GET' | 'POST';
		action: string;
		withGoogle?: boolean;
		withGithub?: boolean;
		followURL: string | null;
		message?: string;
		navigate: (tab: 'signin' | 'reset') => void;
	} = $props();
</script>

<Card.Root class="sm:mx-auto sm:w-full sm:max-w-md">
	<Card.Header>
		<Card.Title>{m.sign_up_title()}</Card.Title>
		<Card.Description>{m.sign_up_text()}</Card.Description>
		<Card.Action>
			<Button onclick={() => navigate('signin')} variant="link">{m.sign_in_button()}</Button>
		</Card.Action>
	</Card.Header>
	<Card.Content>
		<form {method} {action} use:enhance>
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
					<Label for="password">{m.password_label()}</Label>
					<Input
						id="password"
						name="password"
						type="password"
						placeholder={m.password_placeholder()}
						required
					/>
				</div>
				<div class="grid gap-2">
					<Label for="confirm_password">{m.confirm_password_label()}</Label>
					<Input
						id="confirm_password"
						name="confirm_password"
						type="password"
						placeholder={m.confirm_password_placeholder()}
						required
					/>
				</div>
				<div class="grid gap-2">
					<Button type="submit" class="w-full">{m.sign_up_button()}</Button>
					<p style="color: red">{message ?? ''}</p>
				</div>
			</div>
		</form>
	</Card.Content>
	<Card.Footer class="flex-col gap-2">
		<Socials {withGithub} {withGoogle} {followURL} />
	</Card.Footer>
</Card.Root>
