<script>
	import { Button } from '$lib/components/ui/button';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="" />
</svelte:head>

<div class="grid min-h-[60vh] w-full place-items-center">
	<div class="flex max-w-[80rem] items-center justify-center gap-4 p-4 py-12 text-center">
		<div class="max-w-xl">
			<div class="px-2 py-8 text-4xl font-bold md:text-6xl" style="line-height: 1.2;">
				<span class="title-highlight">
					<span class="text-primary">One</span>
					Tracking Link
				</span>
				Share, Notify, Ride
				<span class="title-highlight"> Worry-Free </span>
				🚴
			</div>
			<div class="mt-6 text-sm md:mt-10 md:text-lg">
				Transform your <b>ever-changing</b> Garmin Live-Tracking link into a <b>persistent</b> URL
				and ensure <b>continuous updates</b> with built-in activity start notifications for your
				<b>friends and family</b>.
			</div>
			<div class="mt-6 flex justify-center gap-4 md:mt-4">
				<Button href="/link">Create my link</Button>
				<Button variant="outline">How it works</Button>
			</div>
		</div>
	</div>
</div>
