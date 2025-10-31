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
		withRecoverPassword,
		withGoogle,
		withGithub,
		followURL,
		message,
		navigate
	}: {
		method?: 'dialog' | 'get' | 'post' | 'DIALOG' | 'GET' | 'POST';
		action: string;
		withRecoverPassword: boolean;
		withGoogle?: boolean;
		withGithub?: boolean;
		followURL: string | null;
		message?: string;
		navigate: (tab: 'signup' | 'reset') => void;
	} = $props();
</script>

<Card.Root class="sm:mx-auto sm:w-full sm:max-w-md">
	<Card.Header>
		<Card.Title>{m.sign_in_title()}</Card.Title>
		<Card.Description>{m.sign_in_text()}</Card.Description>
		<Card.Action>
			<Button onclick={() => navigate('signup')} variant="link">{m.sign_up_button()}</Button>
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
					<div class="flex items-center">
						<Label for="password">{m.password_label()}</Label>
						{#if withRecoverPassword}
							<Button
								variant="link"
								onclick={() => navigate('reset')}
								class="ml-auto inline-block text-sm underline-offset-4"
							>
								{m.forgot_password_button()}
							</Button>
						{/if}
					</div>
					<Input
						id="password"
						name="password"
						type="password"
						placeholder={m.password_placeholder()}
						required
					/>
				</div>
				<div class="grid gap-2">
					<Button type="submit" class="w-full">{m.sign_in_button()}</Button>
					<p style="color: red">{message ?? ''}</p>
				</div>
			</div>
		</form>
	</Card.Content>
	<Card.Footer class="flex-col gap-2">
		<Socials {withGithub} {withGoogle} {followURL} />
	</Card.Footer>
</Card.Root>
