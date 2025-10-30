<script>
	import { Button } from '$lib/components/ui/button';
	import QrCodeIcon from '@lucide/svelte/icons/qr-code';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import Share2Icon from '@lucide/svelte/icons/share-2';
	import { FullPage, NarrowSection } from '$lib/components/ui/layout';
	import { pages } from '$lib/pages.svelte';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="" />
</svelte:head>

<NarrowSection>
	<FullPage class="grid place-items-center">
		<div class="text-center">
			<h1 class="px-2 py-8 text-4xl font-bold md:text-6xl" style="line-height: 1.2;">
				<span class="title-highlight">
					<span class="text-primary">One</span>
					Tracking Link
				</span>
				Share, Notify, Ride
				<span class="title-highlight"> Worry-Free </span>
				🚴
			</h1>
			<div class="mt-6 text-sm md:mt-10 md:text-lg">
				Transform your <b>ever-changing</b> Garmin Live-Tracking link into a <b>persistent</b> URL
				and ensure <b>continuous updates</b> with built-in activity start notifications for your
				<b>friends and family</b>.
			</div>
			<div class="mt-6 flex justify-center gap-4 md:mt-4">
				<Button href={pages().gettingStarted.url}>{pages().gettingStarted.title}</Button>
				<Button variant="outline" href="#how-it-works">How it works</Button>
			</div>
		</div>
	</FullPage>
	<div id="how-it-works" class="mb-14 scroll-m-20">
		<h1>How it works</h1>
		<ul>
			<li>
				<h3>
					<QrCodeIcon class="mr-4 inline size-6 align-middle" />
					Create your link
				</h3>
				<p>
					When you create your own personal persistent LiveTrack link, we give you a dedicated
					contact to add to your phone — it contains an email address that connects to our service.
				</p>
			</li>
			<li>
				<h3>
					<svg
						class="mr-4 inline size-6 align-middle"
						viewBox="0 0 48 48"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						><path
							class="a"
							d="M45,15.38a22.15,22.15,0,0,0-8.4-10A22.29,22.29,0,0,0,9.8,7.78,21.74,21.74,0,0,0,3,20.88h7.4A14.72,14.72,0,0,1,20.7,9.78c7.1-1.9,12.6.7,16.1,5.6Z"
						/><path
							class="a"
							d="M45,32.58a22,22,0,0,1-39.4,2.2A19.48,19.48,0,0,1,3,27h7.4a14.66,14.66,0,0,0,26.3,5.5Z"
						/></svg
					>
					Set it in Garmin Connect
				</h3>
				<p>
					In the <a href="https://www.garmin.com/en-US/p/125677/">Garmin Connect™ app</a>, you add
					our contact as a recipient for your LiveTrack sessions. That way, whenever you start
					LiveTrack, Garmin will send the tracking email to us.
				</p>
			</li>
			<li>
				<h3>
					<MapPinIcon class="mr-4 inline size-6 align-middle" />
					We handle the link for you
				</h3>
				<p>
					Every time your start a LiveTrack session, Garmin sends us a link, our service catches it,
					updates your personal page, and makes sure it always shows the newest link.
				</p>
			</li>
			<li>
				<h3>
					<Share2Icon class="mr-4 inline size-6 align-middle" />
					Share once, done forever
				</h3>
				<p>
					Instead of sending your friends a new link every ride, just share your personal static URL
					once. They can bookmark it — it will always point to your most recent LiveTrack.
				</p>
			</li>
		</ul>
		<div class="mt-12 flex justify-center gap-4">
			<Button size="lg" href={pages().gettingStarted.url}>Let's get started!</Button>
		</div>
	</div>
</NarrowSection>
