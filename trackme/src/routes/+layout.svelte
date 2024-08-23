<script lang="ts">
	import '../app.css'

	import { navigating } from "$app/stores"
	import { expoOut } from "svelte/easing"
	import { slide } from "svelte/transition"
	import { DarkMode } from 'flowbite-svelte'
	import { UserCircleSolid, MoonSolid, SunSolid } from 'flowbite-svelte-icons'
</script>

<div class="bg-white dark:bg-neutral-800 flex items-center">
	<div class="flex items-center p-2 min-h-16 container mx-auto">
		<div class="flex-1">
			<a class="font-semibold text-xl px-4" href="/">Garmin Persistent Livetrack</a>
		</div>
		<div class="flex-none">
			<ul class="p-2 flex-wrap inline-flex flex-row space-x-1 font-bold text-lg ">
				<a href="/auth" class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none rounded-lg text-sm p-2.5">
					<UserCircleSolid size="lg"/>
				</a>
				<DarkMode size="lg" btnClass="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-xl p-2">
					<MoonSolid size="lg" slot="darkIcon" />
					<SunSolid size="lg" slot="lightIcon" />
				</DarkMode>
			</ul>
		</div>
	</div>
</div>
{#if $navigating}
	<!--
		Loading animation for next page since svelte doesn't show any indicator.
		 - delay 100ms because most page loads are instant, and we don't want to flash
		 - long 12s duration because we don't actually know how long it will take
		 - exponential easing so fast loads (>100ms and <1s) still see enough progress,
			 while slow networks see it moving for a full 12 seconds
	-->
	<div
		class="fixed w-full top-0 right-0 left-0 h-1 z-50 bg-primary-700"
		in:slide={{ delay: 100, duration: 12000, axis: "x", easing: expoOut }}
	></div>
{/if}


<div class="">
	<slot />
</div>

<div class="flex-grow"></div>
<div class="">
	<div class="border-t max-w-[1000px] mx-auto"></div>
	<footer
		class="bg-white dark:bg-neutral-800 grid w-full grid-flow-row place-items-start sm:grid-flow-col sm:gap-y-10 p-10 gap-x-48 lg:gap-x-64 xl:gap-x-96 place-content-center text-base"
	>
		<nav class="grid place-items-start gap-2">
			<span class="mb-2 font-bold uppercase opacity-80">Explore</span>
			<a class="link mb-1" href="#">How it works</a>
			<a class="link mb-1" href="#">Self-Host</a>
			<a class="link my-1" href="https://github.com/adrienlucbert/garmin-persistent-livetrack/">Github</a>
		</nav>
		<aside class="grid place-items-start gap-2">
			<span class="mb-2 font-bold uppercase opacity-80">Notice</span>
			<span class="max-w-[260px]">
				This service is in no way related to <a class="link" href="https://www.garmin.com/">Garmin&reg;</a> but extends and simplifies the use of its LiveTrack feature.
			</span>
		</aside>
	</footer>
</div>
