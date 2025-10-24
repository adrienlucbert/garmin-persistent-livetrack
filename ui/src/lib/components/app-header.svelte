<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import CircleUserRound from '@lucide/svelte/icons/circle-user-round';
	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import type { Sessions } from '$lib/server/db/schema';
	import { page } from '$app/state';
	import { pages } from '$lib/pages.svelte';

	let {
		userSession
	}: {
		userSession?: Sessions;
	} = $props();
</script>

<div
	class="sticky top-0 z-50 flex h-[var(--header-height)] w-full shrink-0 items-center gap-2 border-b bg-white px-2 dark:bg-neutral-800"
>
	{#if page.data.hideSidebar !== true}
		<Sidebar.Trigger class="h-10 w-10"></Sidebar.Trigger>
		<Separator orientation="vertical" />
	{/if}
	<div class="flex w-full justify-center">
		<div class="container flex items-center">
			<div class="flex-1">
				<a class="px-4 text-xl font-semibold" href={pages().home.url}>
					<span class="hidden sm:inline">Garmin Persistent</span> Livetrack
				</a>
			</div>
			<div class="flex-none">
				<ul class="inline-flex flex-row flex-wrap space-x-1 p-2 text-lg font-bold">
					{#if userSession}
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								<Button variant="ghost" size="icon">
									<CircleUserRound />
								</Button>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content>
								<a href={pages().account.url}>
									<DropdownMenu.Item>{pages().account.title}</DropdownMenu.Item>
								</a>
								<a href="/auth/signout">
									<DropdownMenu.Item>Sign out</DropdownMenu.Item>
								</a>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					{:else}
						<Button variant="ghost" size="icon" href="/auth">
							<CircleUserRound />
						</Button>
					{/if}
					<Button onclick={toggleMode} variant="ghost" size="icon">
						<SunIcon class="rotate-0 scale-100 !transition-all dark:-rotate-90 dark:scale-0" />
						<MoonIcon
							class="absolute rotate-90 scale-0 !transition-all dark:rotate-0 dark:scale-100"
						/>
						<span class="sr-only">Toggle theme</span>
					</Button>
				</ul>
			</div>
		</div>
	</div>
</div>
