<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { FullPage, NarrowSection } from '$lib/components/ui/layout';
	import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';
</script>

<NarrowSection>
	<FullPage class="grid place-items-center">
		<div class="text-center">
			<h2
				class="flex flex-col items-center gap-5 border-none px-2 py-8 font-bold md:flex-row"
				style="line-height: 1.2;"
			>
				<TriangleAlertIcon size="1.5em" />
				<span>{page.error.message}</span>
			</h2>
			{#if [401, 403].includes(page.status) && page.error.message === 'This tracking link is not public.'}
				<div class="flex justify-center gap-4">
					<Button size="lg" variant="outline" href={`${page.params.identifier}/follow`}>
						Request access
					</Button>
				</div>
			{/if}
		</div>
	</FullPage>
</NarrowSection>
