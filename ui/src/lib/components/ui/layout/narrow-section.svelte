<script lang="ts">
	let { children, ...restProps } = $props();
</script>

<div class="flex w-full flex-col items-center justify-center">
	<div class="max-w-xl" {...restProps}>
		{@render children?.()}
	</div>
</div>
