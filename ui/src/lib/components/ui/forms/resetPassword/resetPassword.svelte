<script lang="ts">
	import { enhance } from '$app/forms';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';

	let {
		method,
		action,
		message,
		token,
		navigate
	}: {
		method?: 'dialog' | 'get' | 'post' | 'DIALOG' | 'GET' | 'POST';
		action: string;
		message?: string;
		token: string;
		navigate: (tab: 'signin') => void;
	} = $props();
</script>

<Card.Root class="sm:mx-auto sm:w-full sm:max-w-md">
	<Card.Header>
		<Card.Title>Reset your password</Card.Title>
		<Card.Description>Create a new pasword for your account</Card.Description>
		<Card.Action>
			<Button onclick={() => navigate('signin')} variant="link">Sign in</Button>
		</Card.Action>
	</Card.Header>
	<Card.Content>
		<form {method} {action} use:enhance>
			<div class="flex flex-col gap-6">
				<Input name="token" type="hidden" value={token} />
				<div class="grid gap-2">
					<Label for="password">New password</Label>
					<Input
						id="password"
						name="password"
						type="password"
						placeholder="Enter your new password"
						required
					/>
				</div>
				<div class="grid gap-2">
					<Label for="confirm_password">Confirm your new password</Label>
					<Input
						id="confirm_password"
						name="confirm_password"
						type="password"
						placeholder="Re-enter your new password"
						required
					/>
				</div>
				<div class="grid gap-2">
					<Button type="submit" class="w-full">Reset password</Button>
					<p style="color: red">{message ?? ''}</p>
				</div>
			</div>
		</form>
	</Card.Content>
</Card.Root>
