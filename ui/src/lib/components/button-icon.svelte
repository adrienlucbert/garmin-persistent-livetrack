<script lang="ts">
	import type { Component } from 'svelte';
	import { Button, type ButtonProps } from './ui/button';

	let { icon: Icon, ...restProps }: { icon: Component } & ButtonProps = $props();
</script>

<Button variant="ghost" size="icon" {...restProps}>
	<Icon />
</Button>
