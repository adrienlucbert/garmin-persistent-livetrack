<script lang="ts">
	import type { PublicTrackingLinkWithUser } from '$lib/server/link/trackingLink';
	import { cn } from '$lib/utils';

	let {
		link,
		class: className,
		...restProps
	}: {
		link: PublicTrackingLinkWithUser;
		class?: string;
	} = $props();
</script>

<iframe
	class={cn(className)}
	frameborder="0"
	title="LiveTrack session"
	src={link.link}
	{...restProps}
>
</iframe>
