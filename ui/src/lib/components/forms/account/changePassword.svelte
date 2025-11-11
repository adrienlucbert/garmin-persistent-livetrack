<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';
	import { m } from '$lib/paraglide/messages.js';

	let {
		method,
		action,
		message
	}: {
		method?: 'dialog' | 'get' | 'post' | 'DIALOG' | 'GET' | 'POST';
		action: string;
		message?: string;
	} = $props();
</script>

<form
	{method}
	{action}
	use:enhance={() => {
		return async ({ update, result }) => {
			if (
				(result.type === 'success' || result.type === 'failure') &&
				typeof result.data?.message === 'string'
			) {
				if (result.type === 'success') {
					await update({ reset: true });
					toast.success(result.data.message);
				} else {
					await update({ reset: false });
					toast.error(result.data.message);
				}
			}
		};
	}}
>
	<div class="flex flex-col gap-6">
		<div class="grid gap-2">
			<Label for="old_password">{m.old_password_label()}</Label>
			<Input
				id="old_password"
				name="old_password"
				type="password"
				placeholder={m.old_password_placeholder()}
				required
			/>
		</div>
		<div class="grid gap-2">
			<Label for="confirm_password">{m.new_password_label()}</Label>
			<Input
				id="new_password"
				name="new_password"
				type="password"
				placeholder={m.new_password_placeholder()}
				required
			/>
		</div>
		<div class="grid gap-2">
			<div class="text-left">
				<Button type="submit" variant="outline" class="px-10">{m.save_button()}</Button>
			</div>
			<p class="m-0 text-red-400">{message ?? ''}</p>
		</div>
	</div>
</form>
