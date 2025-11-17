<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { PublicUserWithTraits } from '$lib/server/db/schema';
	import { m } from '$lib/paraglide/messages.js';
	import { toast } from 'svelte-sonner';

	let {
		action,
		userWithTraits
	}: {
		action: string;
		userWithTraits: PublicUserWithTraits;
	} = $props();
</script>

<form
	method="POST"
	{action}
	use:enhance={() => {
		return async ({ update, result }) => {
			await update({ reset: false });
			if (
				(result.type === 'success' || result.type === 'failure') &&
				typeof result.data?.message === 'string'
			) {
				if (result.type === 'success') {
					toast.success(result.data.message);
				} else {
					toast.error(result.data.message);
				}
			}
		};
	}}
>
	<div class="flex flex-col gap-6">
		<div class="grid gap-2">
			<Label for="username">{m.username_label()}</Label>
			<Input
				id="username"
				name="username"
				type="text"
				placeholder="Username"
				value={userWithTraits.name}
				required
			/>
		</div>
		<div class="grid gap-2">
			<Label for="email">{m.email_label()}</Label>
			<Input
				id="email"
				name="email"
				type="email"
				placeholder={m.email_placeholder()}
				value={userWithTraits.email}
				required
			/>
		</div>
		<div class="grid gap-2">
			<div class="text-left">
				<Button type="submit" variant="outline">{m.save_button()}</Button>
			</div>
		</div>
	</div>
</form>
