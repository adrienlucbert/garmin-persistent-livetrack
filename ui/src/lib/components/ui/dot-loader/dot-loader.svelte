<script lang="ts">
	import { cn } from '$lib/utils.js';
	let { class: className, ...restProps }: { class?: string } = $props();
</script>

<div class={cn('loader inline-block w-6', className)} {...restProps}></div>

<style lang="css">
	.loader {
		aspect-ratio: 5;
		background: radial-gradient(circle closest-side, currentColor 70%, transparent) 0 /
			calc(100% / 3) 100% space;
		clip-path: inset(0 100% 0 0);
		animation: l1 2s steps(4) infinite;
	}
	@keyframes l1 {
		to {
			clip-path: inset(0 -34% 0 0);
		}
	}
</style>
