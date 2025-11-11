<script lang="ts">
	import { toast } from 'svelte-sonner';
	import LinkSetupAlert from '$lib/components/link-setup-alert.svelte';
	import { Button } from '$lib/components/ui/button';
	import { pages } from '$lib/pages.svelte.js';
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import GlobeIcon from '@lucide/svelte/icons/globe';
	import LockKeyHoleIcon from '@lucide/svelte/icons/lock-keyhole';
	import FollowersTable from './followers-table.svelte';
	import VisitsCharts from './visits-charts.svelte';
	import { getAthleteLink } from '$lib/link';
	import { m } from '$lib/paraglide/messages.js';

	let { data } = $props();
	let { user, link, flags } = data;
	let linkIsPublic = $derived(link?.isPublic);
	let linkURL = $derived(user && getAthleteLink(user.name));

	let updatingLinkVisibility = $state(false);
	async function updateLinkVisibility(isPublic: boolean) {
		updatingLinkVisibility = true;

		try {
			const res = await fetch('/api/link/visibility', {
				method: 'PUT',
				body: JSON.stringify({ is_public: isPublic })
			});
			if (res.ok) {
				linkIsPublic = isPublic;
			} else {
				const { message } = await res.json().catch(() => {
					throw m.unexpected_server_error({ code: res.status });
				});
				throw message;
			}
		} catch (error) {
			toast.error(m.an_error_occurred(), {
				description: String(error),
				duration: 10000
			});
		} finally {
			updatingLinkVisibility = false;
		}
	}
</script>

<div class="p-2">
	{#if link}
		<h3>{m.ma_general_access()}</h3>

		<div class="mt-6">
			<div class="mb-4 flex gap-2 align-middle">
				<div class="flex items-center">
					{#if linkIsPublic}
						<GlobeIcon class="flex items-center align-middle" />
					{:else}
						<LockKeyHoleIcon class="flex items-center align-middle" />
					{/if}
				</div>
				<div class="flex flex-col">
					<span class="col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight">
						<Select.Root
							disabled={updatingLinkVisibility}
							type="single"
							bind:value={
								() => (linkIsPublic ? 'public' : 'private'),
								async (v) => await updateLinkVisibility(v === 'public')
							}
						>
							<Select.Trigger class="cursor-pointer" aria-label="Edit" variant="ghost">
								{linkIsPublic ? m.ma_anyone_with_the_link() : m.ma_restricted()}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value={'public'}>{m.ma_anyone_with_the_link()}</Select.Item>
								<Select.Item value={'private'}>{m.ma_restricted()}</Select.Item>
							</Select.Content>
						</Select.Root>
					</span>
					<span
						class="text-muted-foreground col-start-2 grid justify-items-start gap-1 pl-2 text-sm [&_p]:leading-relaxed"
					>
						{#if linkIsPublic}
							{m.ma_anyone_with_the_link_description()}
						{:else}
							{m.ma_restricted_description()}
						{/if}
					</span>
				</div>
			</div>

			<div class="flex items-center gap-2">
				<Label for="link" class="sr-only">Link</Label>
				<Input id="link" value={linkURL?.href} readonly class="h-8" />
				<Button
					class="shadow-none"
					onclick={() => {
						navigator.clipboard.writeText(linkURL?.href || '');
						toast.success(m.link_copied(), { duration: 3000 });
					}}
				>
					{m.copy_link()}
				</Button>
			</div>
		</div>

		<h3>{m.ma_people_with_access_title()}</h3>

		<p class="text-muted-foreground text-sm">
			{@html m.ma_people_with_access_text()}
		</p>
		<div class="mt-2">
			<FollowersTable showLastSeen={flags.ENABLE_VISITS_STATISTICS} />
		</div>

		{#if flags.ENABLE_VISITS_STATISTICS}
			<h3>{m.ma_visits_history()}</h3>
			<div class="mt-6">
				<VisitsCharts />
			</div>
		{/if}
	{:else}
		<p class="text-muted-foreground mt-6 text-center text-xl">
			{m.no_livetrack_link_setup_yet()}
		</p>
		<div class="mt-6 flex justify-center gap-4">
			<Button size="lg" href={pages().gettingStarted.url}>{pages().gettingStarted.title}</Button>
		</div>
		{#if user}
			<LinkSetupAlert {user} {link} />
		{/if}
	{/if}
</div>
