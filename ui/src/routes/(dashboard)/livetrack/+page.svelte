<script lang="ts">
	import LivetrackIframe from '$lib/components/livetrack-iframe.svelte';

	let { data } = $props();
</script>

{#if data.trackingLink}
	<LivetrackIframe class="w-full flex-grow" link={data.trackingLink} />
{/if}
