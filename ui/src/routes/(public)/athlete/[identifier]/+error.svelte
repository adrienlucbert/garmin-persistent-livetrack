<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { FullPage, NarrowSection } from '$lib/components/ui/layout';
	import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';
	import { pages } from '$lib/pages.svelte';
	import { m } from '$lib/paraglide/messages.js';
</script>

<NarrowSection>
	<FullPage class="grid place-items-center">
		<div class="text-center">
			<h2
				class="flex flex-col items-center gap-5 border-none px-2 py-8 font-bold md:flex-row"
				style="line-height: 1.2;"
			>
				<TriangleAlertIcon size="1.5em" />
				<span>{page.error?.message}</span>
			</h2>
			{#if [401, 403].includes(page.status) && page.error?.message === m.tracking_link_is_not_public()}
				<div class="flex justify-center gap-4">
					<Button
						size="lg"
						variant="outline"
						href={`${page.params.identifier}/follow`}
						data-sveltekit-reload
					>
						{m.request_access()}
					</Button>
				</div>
			{:else}
				<div class="flex justify-center gap-4">
					<Button size="lg" variant="outline" href="/">{m.go_back_home()}</Button>
					<Button size="lg" href={`${pages().account.url}#following`}
						>{m.see_access_requests()}</Button
					>
				</div>
			{/if}
		</div>
	</FullPage>
</NarrowSection>
