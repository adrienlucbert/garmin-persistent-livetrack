<script lang="ts">
	import { enhance } from '$app/forms';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { toast } from 'svelte-sonner';
	import { m } from '$lib/paraglide/messages.js';

	let {
		method,
		action
	}: {
		method?: 'dialog' | 'get' | 'post' | 'DIALOG' | 'GET' | 'POST';
		action: string;
	} = $props();

	let open = $state(false);
	let form: HTMLFormElement | null = $state(null);
</script>

<form
	{method}
	{action}
	bind:this={form}
	use:enhance={() => {
		return async ({ update, result }) => {
			await update();
			if (result.type === 'failure' && typeof result.data?.message === 'string') {
				toast.error(result.data.message);
			}
		};
	}}
>
	<div class="flex flex-col gap-6">
		<div class="grid gap-2">
			<div class="text-left">
				<AlertDialog.Root bind:open>
					<AlertDialog.Trigger
						class={buttonVariants({ variant: 'destructive-outline' })}
						type="button"
					>
						{m.delete_account_button()}
					</AlertDialog.Trigger>
					<AlertDialog.Content interactOutsideBehavior="close">
						<AlertDialog.Header>
							<AlertDialog.Title>{m.are_you_sure()}</AlertDialog.Title>
							<AlertDialog.Description>
								{m.delete_account_text()}
							</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Cancel class={buttonVariants({ variant: 'destructive-outline' })}>
								{m.cancel()}
							</AlertDialog.Cancel>
							<AlertDialog.Action
								class={buttonVariants({ variant: 'destructive' })}
								onclick={() => {
									open = false;
									form?.requestSubmit();
								}}
							>
								{m.delete_account_button()}
							</AlertDialog.Action>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog.Root>
			</div>
		</div>
	</div>
</form>
