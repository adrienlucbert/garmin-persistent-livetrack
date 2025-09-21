<script lang="ts">
	import vCardsJS from 'vcards-js';
	import QRCode from 'qrcode';
	import { Button } from '$lib/components/ui/button';

	let linkUUID = $state('e12568e3-3de1-48c9-bad2-512ed592d7a0');

	let vcard = $derived.by(() => {
		const v = vCardsJS();
		v.firstName = 'Garmin Persistent Livetrack';
		v.lastName = 'Webhook';
		v.uid = linkUUID;
		v.email = `trackme-${linkUUID}@lucbert.dev`;
		return v;
	});
	let vcardData = $derived(vcard.getFormattedString());

	const blobUrl = $derived(URL.createObjectURL(new Blob([vcardData], { type: 'text/vcard' })));

	let qrUrl: string | null = $state(null);
	$effect(() => {
		(async () => {
			qrUrl = await QRCode.toDataURL(vcardData);
		})();
	});
</script>

<h1>vCard Generator</h1>

<br />
<label for="linkUUID">Link UUID</label>
<input type="text" name="linkUUID" id="linkUUID" bind:value={linkUUID} />
<br />

<Button href={blobUrl} download="contact.vcf">Download vCard</Button>

{#if qrUrl}
	<img src={qrUrl} alt="vCard QR" style="width:200px" />
{/if}
