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
		navigate
	}: {
		method?: 'dialog' | 'get' | 'post' | 'DIALOG' | 'GET' | 'POST';
		action: string;
		message?: string;
		navigate: (tab: 'signin') => void;
	} = $props();
</script>

<Card.Root class="sm:mx-auto sm:w-full sm:max-w-md">
	<Card.Header>
		<Card.Title>Recover your account</Card.Title>
		<Card.Description
			>Enter your email below and we will send you an email to reset your password</Card.Description
		>
		<Card.Action>
			<Button onclick={() => navigate('signin')} variant="link">Sign in</Button>
		</Card.Action>
	</Card.Header>
	<Card.Content>
		<form {method} {action} use:enhance>
			<div class="flex flex-col gap-6">
				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input
						id="email"
						name="email"
						type="email"
						placeholder="Enter your email address"
						required
					/>
				</div>
				<div class="grid gap-2">
					<Button type="submit" class="w-full">Send email</Button>
					<p style="color: red">{message ?? ''}</p>
				</div>
			</div>
		</form>
	</Card.Content>
</Card.Root>
