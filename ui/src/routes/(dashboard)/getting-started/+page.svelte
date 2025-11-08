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
	import { pages } from '$lib/pages.svelte';
	import { toast } from 'svelte-sonner';
	import { m } from '$lib/paraglide/messages.js';

	let { data } = $props();
	let { user, link } = data;

	let linkURL = $derived(user && getAthleteLink(user.name));

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
	<p class="text-muted-foreground mt-6 text-xl">
		{m.gs_follow_those_steps()}
	</p>
	<ul>
		<li>
			<h3>
				<QrCodeIcon class="mr-4 inline size-6 align-middle" />
				{m.gs_create_a_livetrack_recipient_title()}
			</h3>
			<p>
				{m.gs_create_a_livetrack_recipient_text()}
			</p>
			<div class="mt-6">
				<div class="mt-2 flex flex-col items-center">
					{#if vcard}
						<QRCode data={vcard} class="max-w-60" />
						<Button href={vcardBlobUrl} download="contact.vcf" variant="link"
							>{m.gs_download_vcard()}</Button
						>
					{/if}
				</div>
				<br />
				{m.gs_scan_or_download_contact()}
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
				{m.gs_set_it_in_garmin_connect_title()}
			</h3>
			<p>
				{@html m.gs_set_it_in_garmin_connect_text()}
			</p>
			<p>{m.gs_heres_a_video()}</p>
			<div class="mt-2">
				<Youtube id="DzfFG0gdhF4" animations={false} />
			</div>
			<Alert.Root class="mt-6">
				<CircleAlertIcon />
				<Alert.Title class="line-clamp-none tracking-normal"
					>{m.gs_turn_on_auto_start_title()}</Alert.Title
				>
				<Alert.Description>
					{@html m.gs_turn_on_auto_start_text()}
				</Alert.Description>
			</Alert.Root>
		</li>
		<li>
			<h3>
				<SquareCheckBigIcon class="mr-4 inline size-6 align-middle" />
				{m.gs_try_it_out_title()}
			</h3>
			{#if user}
				<LinkSetupAlert {user} {link} />
			{/if}
		</li>
		<li>
			<h3>
				<Share2Icon class="mr-4 inline size-6 align-middle" />
				{m.hiw_share_once_done_forever_title()}
			</h3>
			<p>
				{m.hiw_share_once_done_forever_text()}
			</p>

			{#if link}
				<div class="my-6 flex items-center gap-2">
					<Label for="link" class="sr-only">Link</Label>
					<Input id="link" value={linkURL?.href} readonly class="h-8" />
					<Button
						class="shadow-none"
						onclick={() => {
							navigator.clipboard.writeText(linkURL?.href || '');
							toast.success(m.link_copied(), { duration: 3000 });
						}}
					>
						{m.copy_link()}
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
