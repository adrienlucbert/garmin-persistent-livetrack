<script>
import { Alert, Button } from 'flowbite-svelte'
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="" />
</svelte:head>

<div class="grid w-full place-items-center min-h-[60vh]">
	<div class="flex items-center justify-center max-w-[80rem] gap-4 p-4 text-center py-12">
		<div class="max-w-xl">
			<div
				class="text-xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-4 md:mb-8"
			>
				Defy Quickstart Demo
			</div>

			<div
				class="text-4xl md:text-6xl font-bold px-2"
				style="line-height: 1.2;"
			>
				<span class="title-highlight">
					One Tracking Link
				</span>
				, Share, Notify, Ride
				<span class="title-highlight">
					Worry-Free
				</span>
				🚴
			</div>
			<div class="mt-6 md:mt-10 text-sm md:text-lg">
				Transform your <b>ever-changing</b> Garmin Live-Tracking link into a <b>persistent</b> URL and
				ensure <b>continuous updates</b> with built-in activity start notifications for your <b>friends and family</b>.
			</div>
			<div class="mt-6 md:mt-4 flex justify-center gap-4">
				<Button size="sm">Create my link</Button>
				<Button outline size="sm">How it works</Button>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
.title-highlight {
	@apply underline decoration-orange-500 decoration-4 md:decoration-[6px];
}
</style>
