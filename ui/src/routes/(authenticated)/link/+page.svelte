<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';
	import { generateVCard } from '$lib/vcard';
	import { QRCode } from '$lib/components/ui/qrcode';

	let submitting = $state(false);

	let { data, form } = $props();
	let trackingLink = $derived(data.trackingLink);

	let vcard = $derived(
		trackingLink &&
			generateVCard({
				firstName: 'Garmin Persistent Livetrack',
				lastName: 'Webhook',
				uid: trackingLink.userUUID,
				email: `trackme-${trackingLink.userUUID}@lucbert.dev`
			})
	);
	const vcardBlobUrl = $derived(
		vcard && URL.createObjectURL(new Blob([vcard], { type: 'text/vcard' }))
	);

	type Tab = 'preview' | 'stats';
	let tab = $derived((page.url.searchParams.get('tab') as Tab) ?? 'preview');
</script>

{#if !trackingLink}
	<form
		method="POST"
		action="?/create"
		use:enhance={() => {
			submitting = true;
		}}
	>
		<div class="flex flex-col gap-6">
			<div class="gap-2">
				<Button disabled={submitting} type="submit">Create your link</Button>
				<p style="color: red">{form?.message ?? ''}</p>
			</div>
		</div>
	</form>
{:else}
	<Card.Root>
		<Card.Content>
			<Tabs.Root value={tab}>
				<Tabs.List>
					<Tabs.Trigger value="preview">Preview</Tabs.Trigger>
					<Tabs.Trigger value="stats">Stats</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="preview">
					Here's your tracking link
					<pre>{JSON.stringify(trackingLink, null, 2)}</pre>
					{#if vcard}
						<Button href={vcardBlobUrl} download="contact.vcf">Download vCard</Button>
						<QRCode data={vcard} />
					{/if}
				</Tabs.Content>
				<Tabs.Content value="stats"></Tabs.Content>
			</Tabs.Root></Card.Content
		>
	</Card.Root>
{/if}
