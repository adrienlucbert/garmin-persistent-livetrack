<script lang="ts">
	import type { SvelteURL } from 'svelte/reactivity';
	import * as Select from '$lib/components/ui/select/index.js';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';

	import { Button } from '../ui/button';
	import Separator from '../ui/separator/separator.svelte';
	let {
		active,
		url
	}: {
		active: string;
		url: SvelteURL;
	} = $props();

	const isMobile = new IsMobile();

	const items = $derived([
		{
			id: '#profile',
			label: 'User profile',
			visible: true
		},
		{
			id: '#following',
			label: 'Following',
			visible: true
		}
	]);
</script>

<div class="flex max-h-max w-full flex-col md:max-w-[15rem] lg:max-w-xs">
	{#if isMobile.current}
		<div class="flex w-full flex-col gap-2 p-2">
			<Select.Root
				type="single"
				bind:value={active}
				onValueChange={(v) => {
					url.hash = `${v}`;
					window.location.hash = `${v}`;
				}}
			>
				<div class="flex w-full items-center p-4">
					<Select.Trigger class="w-full font-semibold">
						{#if active === '#profile'}
							Profile
						{:else if active === '#following'}
							Following
						{/if}
					</Select.Trigger>
					<Select.Content>
						{#each items as item (item.id)}
							{#if item.visible === true}
								<Select.Item value={item.id}>{item.label}</Select.Item>
							{/if}
						{/each}
					</Select.Content>
				</div>
			</Select.Root>
		</div>
		<Separator />
	{:else}
		<div class="flex w-full flex-col gap-2 p-2">
			{#each items as item (item.id)}
				{#if item.visible === true}
					<div class="h-max w-full">
						<Button
							onclick={() => {
								url.hash = `${item.id}`;
								window.location.hash = `${item.id}`;
							}}
							variant={active === item.id ? 'default' : 'ghost'}
							class="w-full cursor-pointer justify-start"
						>
							{item.label}
						</Button>
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</div>
