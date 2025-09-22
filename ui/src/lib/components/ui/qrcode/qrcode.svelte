<script lang="ts">
	import QRCode from 'qrcode';

	let {
		data,
		...restProps
	}: {
		data: any;
	} = $props();

	let qrUrl: string | null = $state(null);
	$effect(() => {
		(async () => {
			qrUrl = await QRCode.toDataURL(data);
		})();
	});
</script>

{#if qrUrl}
	<img src={qrUrl} alt="QR code" {...restProps} />
{/if}
