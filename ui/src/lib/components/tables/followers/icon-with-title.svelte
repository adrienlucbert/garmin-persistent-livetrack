<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import type { Component } from 'svelte';

	let { title, icon: Icon, ...restProps }: { title: string; icon: Component } = $props();
</script>

<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<Icon {...restProps} />
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>{title}</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
