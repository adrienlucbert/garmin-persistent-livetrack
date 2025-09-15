<script lang="ts">
	import '../app.css';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import CircleUserRound from '@lucide/svelte/icons/circle-user-round';

	import { ModeWatcher } from 'mode-watcher';
	import { navigating } from '$app/state';
	import { expoOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	let { data, children } = $props();
</script>

<ModeWatcher />

<div class="flex items-center bg-white dark:bg-neutral-800">
	<div class="container mx-auto flex min-h-16 items-center p-2">
		<div class="flex-1">
			<a class="px-4 text-xl font-semibold no-underline" href="/">
				<span class="hidden sm:inline">Garmin Persistent</span> Livetrack
			</a>
		</div>
		<div class="flex-none">
			<ul class="inline-flex flex-row flex-wrap space-x-1 p-2 text-lg font-bold">
				{#if data.session}
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							<Button variant="ghost" size="icon">
								<CircleUserRound />
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content>
							<a href="/account" class="no-underline">
								<DropdownMenu.Item>Account</DropdownMenu.Item>
							</a>
							<a href="/auth/signout" class="no-underline">
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
					<SunIcon class="scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90" />
					<MoonIcon
						class="absolute scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0"
					/>
					<span class="sr-only">Toggle theme</span>
				</Button>
			</ul>
		</div>
	</div>
</div>

{#if navigating}
	<!--
		Loading animation for next page since svelte doesn't show any indicator.
		 - delay 100ms because most page loads are instant, and we don't want to flash
		 - long 12s duration because we don't actually know how long it will take
		 - exponential easing so fast loads (>100ms and <1s) still see enough progress,
			 while slow networks see it moving for a full 12 seconds
	-->
	<div
		class="bg-primary-700 fixed top-0 right-0 left-0 z-50 h-1 w-full"
		in:slide={{ delay: 100, duration: 12000, axis: 'x', easing: expoOut }}
	></div>
{/if}

<div class="">
	{@render children()}
</div>

<div class="flex-grow"></div>
<div class="">
	<footer
		class="grid w-full grid-flow-row place-content-center place-items-start gap-x-48 gap-y-8 bg-white p-10 text-base sm:grid-flow-col sm:gap-y-10 lg:gap-x-64 xl:gap-x-96 dark:bg-neutral-800"
	>
		<nav class="grid place-items-start gap-2">
			<span class="mb-2 font-bold uppercase opacity-80">Explore</span>
			<a class="mb-1" href="#how-it-works">How it works</a>
			<a class="mb-1" href="#self-host">Self-Host</a>
			<a class="my-1" href="https://github.com/adrienlucbert/garmin-persistent-livetrack/">Github</a
			>
		</nav>
		<aside class="grid place-items-start gap-2">
			<span class="mb-2 font-bold uppercase opacity-80">Notice</span>
			<span class="max-w-[260px]">
				This service is in no way related to <a class="link" href="https://www.garmin.com/"
					>Garmin&reg;</a
				> but extends and simplifies the use of its LiveTrack feature.
			</span>
		</aside>
	</footer>
</div>
