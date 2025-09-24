<script lang="ts">
	import { cn } from '$lib/utils.js';
	import LoaderCircleIcon from '@lucide/svelte/icons/loader-circle';

	let { class: className, ...restProps }: { class?: string } = $props();
</script>

<LoaderCircleIcon class={cn('animate-spin', className)} {...restProps} />
