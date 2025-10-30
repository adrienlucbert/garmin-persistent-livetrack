<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Youtube from 'svelte-youtube-embed';
	import { generateVCard } from '$lib/vcard';
	import { QRCode } from '$lib/components/ui/qrcode';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import QrCodeIcon from '@lucide/svelte/icons/qr-code';
	import SquareCheckBigIcon from '@lucide/svelte/icons/square-check-big';
	import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';
	import Share2Icon from '@lucide/svelte/icons/share-2';
	import { NarrowSection } from '$lib/components/ui/layout';
	import { env } from '$env/dynamic/public';
	import * as Alert from '$lib/components/ui/alert';
	import LinkSetupAlert from '$lib/components/link-setup-alert.svelte';
	import { getAthleteLink } from '$lib/link.js';
	import type { UUID } from 'crypto';
	import { pages } from '$lib/pages.svelte';
	import { toast } from 'svelte-sonner';

	let { data } = $props();
	let { user, link } = data;

	let linkURL = $derived(user && getAthleteLink(user.uuid as UUID));

	let vcard = $derived(
		user &&
			generateVCard({
				firstName: 'Garmin Persistent Livetrack',
				lastName: 'Webhook',
				uid: user.uuid,
				email: `garmin-persistent-livetrack-${user.uuid}@${env.PUBLIC_SMTP_PROXY_HOSTNAME}`,
				...(linkURL ? { url: linkURL.href } : {})
			})
	);
	const vcardBlobUrl = $derived(
		vcard && URL.createObjectURL(new Blob([vcard], { type: 'text/vcard' }))
	);
</script>

<NarrowSection class="mb-14">
	<p class="mt-6 text-xl text-muted-foreground">
		Follow those steps to setup your persistent LiveTrack link with your Garmin device.
	</p>
	<ul>
		<li>
			<h3>
				<QrCodeIcon class="mr-4 inline size-6 align-middle" />
				Create a LiveTrack recipient
			</h3>
			<p>
				For Garmin to notify us when you start a LiveTrack session, we need you to add us as
				recipient for your LiveTrack.
			</p>
			<div class="mt-6">
				<div class="mt-2 flex flex-col items-center">
					{#if vcard}
						<QRCode data={vcard} class="max-w-60" />
						<Button href={vcardBlobUrl} download="contact.vcf" variant="link">Download vCard</Button
						>
					{/if}
				</div>
				<br /> First, scan or download this contact card that contains a dedicated recipient email address.
			</div>
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
				<SquareCheckBigIcon class="mr-4 inline size-6 align-middle" />
				Try it out!
			</h3>
			{#if user}
				<LinkSetupAlert {user} {link} />
			{/if}
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

			{#if link}
				<div class="my-6 flex items-center gap-2">
					<Label for="link" class="sr-only">Link</Label>
					<Input id="link" value={linkURL?.href} readonly class="h-8" />
					<Button
						class="shadow-none"
						onclick={() => {
							navigator.clipboard.writeText(linkURL?.href || '');
							toast.success('Link copied to clipboard', { duration: 3000 });
						}}
					>
						Copy Link
					</Button>
				</div>
				<div class="mt-6 flex justify-center gap-4 md:mt-4">
					<Button variant="outline" href={pages().manageAccess.url}
						>{pages().manageAccess.title}</Button
					>
				</div>
			{/if}
		</li>
	</ul>
</NarrowSection>
