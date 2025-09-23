<script lang="ts">
	import type { TrackingLinks } from '$lib/server/db/schema';
	import { cn } from '$lib/utils';

	let { link, class: className, ...restProps }: { link: TrackingLinks; class?: string } = $props();
</script>

<iframe
	class={cn(className)}
	frameborder="0"
	title="LiveTrack session"
	src={link.link}
	{...restProps}
>
</iframe>
