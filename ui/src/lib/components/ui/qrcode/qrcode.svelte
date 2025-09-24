<script lang="ts">
	import { cn } from '$lib/utils';
	import QRCode from 'qrcode';

	let {
		data,
		class: className,
		...restProps
	}: {
		data: any;
		class?: string;
	} = $props();

	let qrUrl: string | null = $state(null);
	$effect(() => {
		(async () => {
			qrUrl = await QRCode.toDataURL(data);
		})();
	});
</script>

{#if qrUrl}
	<img src={qrUrl} alt="QR code" class={cn(className)} {...restProps} />
{/if}
