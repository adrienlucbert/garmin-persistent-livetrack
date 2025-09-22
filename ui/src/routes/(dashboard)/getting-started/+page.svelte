<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import Youtube from 'svelte-youtube-embed';
	import { generateVCard } from '$lib/vcard';
	import { QRCode } from '$lib/components/ui/qrcode';
	import QrCodeIcon from '@lucide/svelte/icons/qr-code';
	import SquareCheckBigIcon from '@lucide/svelte/icons/square-check-big';
	import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';
	import Share2Icon from '@lucide/svelte/icons/share-2';
	import { NarrowSection } from '$lib/components/ui/layout';
	import { env } from '$env/dynamic/public';

	import * as Alert from '$lib/components/ui/alert/index.js';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';

	let submitting = $state(false);

	let { data, form } = $props();
	let trackingLink = $derived(data.trackingLink);

	let vcard = $derived(
		trackingLink &&
			generateVCard({
				firstName: 'Garmin Persistent Livetrack',
				lastName: 'Webhook',
				uid: trackingLink.userUUID,
				email: `trackme-${trackingLink.userUUID}@lucbert.dev`,
				...(data.user
					? {
							url: `${env.PUBLIC_URL}/athletes/${data?.user?.uuid}`
						}
					: {})
			})
	);
	const vcardBlobUrl = $derived(
		vcard && URL.createObjectURL(new Blob([vcard], { type: 'text/vcard' }))
	);
</script>

<NarrowSection>
	<p class="mt-6 text-xl text-muted-foreground">
		Follow those steps to setup your persistent LiveTrack link with your Garmin device.
	</p>
	<ul>
		<li>
			<h3>
				<QrCodeIcon class="center mr-4 inline size-6 align-middle" />
				Create your link
			</h3>
			<p>
				When you create your own personal persistent LiveTrack link, we give you a dedicated contact
				to add to your phone — it contains an email address that connects to our service.
			</p>
			{#if !trackingLink}
				<Alert.Root variant="warning" class="mt-2">
					<AlertCircleIcon />
					<Alert.Title>You don't have a tracking link yet.</Alert.Title>
					<Alert.Description>
						<p>Create one to start sharing your LiveTrack.</p>
						<form
							method="POST"
							action="?/create"
							use:enhance={() => {
								submitting = true;
							}}
						>
							<div class="mt-2 flex flex-col gap-2">
								<Button disabled={submitting} type="submit" variant="warning-outline">
									Create your link
								</Button>
								<p class="m-0 text-destructive">{form?.message ?? ''}</p>
							</div>
						</form>
					</Alert.Description>
				</Alert.Root>
			{:else}
				<div class="mt-2 flex flex-col items-center">
					{#if vcard}
						<QRCode data={vcard} class="max-w-60" />
						<Button href={vcardBlobUrl} download="contact.vcf" variant="link">Download vCard</Button
						>
					{/if}
				</div>
				Scan this QR code or download the vCard to add our dedicated contact to your phone.
				<br />
			{/if}
		</li>
		<li>
			<h3>
				<svg
					class="center mr-4 inline size-6 align-middle"
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
				Set it in Garmin Connect™
			</h3>
			<p>
				In the <a href="https://www.garmin.com/en-US/p/125677/">Garmin Connect™ app</a>, add our
				contact as an email recipient for your LiveTrack sessions. That way, whenever you start
				LiveTrack, Garmin will send the tracking email to us.
			</p>
			<p>Here's a video showing you how to do this:</p>
			<div class="mt-2">
				<Youtube id="DzfFG0gdhF4" animations={false} />
			</div>
			<Alert.Root class="mt-6">
				<CircleAlertIcon />
				<Alert.Title class="line-clamp-none tracking-normal">Turn on Auto Start</Alert.Title>
				<Alert.Description>
					<p>
						It is recommended that you turn on Auto Start from the Garmin Connect™ app's LiveTrack
						menu. This way, your tracking link here is automatically updated, without you needing to
						manually start a LiveTrack session.
					</p>
					<p>
						Beware, while LiveTrack is active on your Garmin device, it consumes more battery on
						both your phone and Garmin device.
					</p>
				</Alert.Description>
			</Alert.Root>
		</li>
		<li>
			<h3>
				<SquareCheckBigIcon class="center mr-4 inline size-6 align-middle" />
				You're all set
			</h3>
			<div class="mt-6 flex items-center gap-4">
				<p class="m-0">
					This should be it! Try it by starting a new activity on your Garmin device and starting
					the LiveTrack session from your Garmin Connect™ app.
				</p>
			</div>
		</li>
		<li>
			<h3>
				<Share2Icon class="center mr-4 inline size-6 align-middle" />
				Share once, done forever
			</h3>
			<p>
				Instead of sending your friends a new link every ride, just share your personal static URL
				once. They can bookmark it — it will always point to your most recent LiveTrack.
			</p>
		</li>
	</ul>
</NarrowSection>
