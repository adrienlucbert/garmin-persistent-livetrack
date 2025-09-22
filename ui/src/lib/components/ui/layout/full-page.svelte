<script lang="ts">
	let { children, ...restProps } = $props();
</script>

<div class="grid min-h-[calc(100vh-var(--header-height))] place-items-center" {...restProps}>
	{@render children?.()}
</div>
