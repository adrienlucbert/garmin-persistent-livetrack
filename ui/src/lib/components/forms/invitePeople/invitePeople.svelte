<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Share2Icon from '@lucide/svelte/icons/share-2';
	import LinkIcon from '@lucide/svelte/icons/link';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';
	import { m } from '$lib/paraglide/messages.js';

	let { action }: { action: string } = $props();

	const usesChoices = [
		{
			value: 'single',
			label: 'Single-use',
			description: 'The link will expire after used by one user.'
		},
		{
			value: 'multi',
			label: 'Multi-use',
			description:
				'The link can be used by any number of users as long as its expiry date is not passed.'
		}
	] as const;

	let usesValue = $state<(typeof usesChoices)[number]['value']>('multi');

	const usesContent = $derived(usesChoices.find((f) => f.value === usesValue)?.label);
	const usesDescription = $derived(usesChoices.find((f) => f.value === usesValue)?.description);

	const expireInChoices = [
		{ value: 'never', label: 'Never' },
		{ value: '30m', label: '30 minutes' },
		{ value: '1h', label: '1 hour' },
		{ value: '6h', label: '6 hours' },
		{ value: '1d', label: '1 day' },
		{ value: '7d', label: '7 days' },
		{ value: '30d', label: '30 days' },
		{ value: '3M', label: '3 months' },
		{ value: '1y', label: '1 year' }
	] as const;

	let expireInValue = $state<(typeof expireInChoices)[number]['value']>('never');

	const expireInContent = $derived(
		expireInChoices.find((f) => f.value === expireInValue)?.label ?? 'Expire in'
	);

	let open = $state(false);
	let form: HTMLFormElement | null = $state(null);
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: 'default' })} type="button">
		<Share2Icon /> Invite people
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Invite people</Dialog.Title>
			<Dialog.Description>Invite people to follow you by giving them a link.</Dialog.Description>
		</Dialog.Header>

		<form
			method="POST"
			{action}
			bind:this={form}
			use:enhance={() => {
				return async ({ update, result }) => {
					await update({ reset: false });
					if (result.type === 'success') {
						navigator.clipboard.writeText((result.data?.link as string) || '');
						toast.success(m.link_copied(), { duration: 3000 });
					} else if (result.type === 'failure' && typeof result.data?.message === 'string') {
						toast.error(result.data.message);
					}
				};
			}}
		>
			<div class="grid gap-4 py-4">
				<div class="grid grid-cols-4 items-center gap-x-4">
					<Label for="username" class="text-right">Uses</Label>
					<Select.Root type="single" name="uses" bind:value={usesValue}>
						<Select.Trigger class="col-span-3 w-full">
							{usesContent}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								{#each usesChoices as choice (choice.value)}
									<Select.Item value={choice.value} label={choice.label}>
										{choice.label}
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
					<div class="col-span-1"></div>
					<p class="col-span-3 m-0 text-sm text-muted-foreground">{usesDescription}</p>
				</div>

				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="username" class="text-right">Expire in</Label>
					<Select.Root type="single" name="expires_in" bind:value={expireInValue}>
						<Select.Trigger class="col-span-3 w-full">
							{expireInContent}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								{#each expireInChoices as choice (choice.value)}
									<Select.Item value={choice.value} label={choice.label}>
										{choice.label}
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</div>
			</div>
		</form>

		<Dialog.Footer>
			<Button
				onclick={() => {
					open = false;
					form?.requestSubmit();
				}}
			>
				<LinkIcon /> Generate invite link
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
