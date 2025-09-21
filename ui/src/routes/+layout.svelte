<script lang="ts">
	import '../app.css';

	import { page } from '$app/state';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import AppHeader from '$lib/components/app-header.svelte';
	import AppFooter from '$lib/components/app-footer.svelte';

	let { data, children } = $props();
	import { ModeWatcher } from 'mode-watcher';
	import { navigating } from '$app/state';
	import { expoOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
</script>

<ModeWatcher />

<Sidebar.Provider>
	{#if page.data.hideSidebar !== true}
		<AppSidebar />
	{/if}
	<main class="flex w-full flex-col">
		<AppHeader userSession={data.session} />
		<main class="p-2">
			{@render children?.()}
		</main>
		<div class="flex-grow"></div>
		{#if page.data.hideFooter !== true}
			<AppFooter />
		{/if}
	</main>
</Sidebar.Provider>

{#if navigating?.to}
	<!--
		Loading animation for next page since svelte doesn't show any indicator.
		 - delay 100ms because most page loads are instant, and we don't want to flash
		 - long 12s duration because we don't actually know how long it will take
		 - exponential easing so fast loads (>100ms and <1s) still see enough progress,
			 while slow networks see it moving for a full 12 seconds
	-->
	<div
		class="fixed top-0 right-0 left-0 z-50 h-1 w-full bg-primary"
		in:slide={{ delay: 100, duration: 12000, axis: 'x', easing: expoOut }}
	></div>
{/if}
