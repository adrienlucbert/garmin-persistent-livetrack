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
	import type { UUID } from 'crypto';

	let { data } = $props();
	let { user, link, flags } = data;
	let linkIsPublic = $derived(link?.isPublic);
	let linkURL = $derived(user && getAthleteLink(user.uuid as UUID));

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
					throw `Unexpected server error ${res.status}`;
				});
				throw message;
			}
		} catch (error) {
			toast.error('An error occurred', {
				description: String(error),
				duration: 10000
			});
		} finally {
			updatingLinkVisibility = false;
		}
	}
</script>

{#if link}
	<h3>General access</h3>

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
							{linkIsPublic ? 'Anyone with the link' : 'Restricted'}
						</Select.Trigger>
						<Select.Content>
							<Select.Item value={'public'}>Anyone with the link</Select.Item>
							<Select.Item value={'private'}>Restricted</Select.Item>
						</Select.Content>
					</Select.Root>
				</span>
				<span
					class="col-start-2 grid justify-items-start gap-1 pl-2 text-sm text-muted-foreground [&_p]:leading-relaxed"
				>
					{#if linkIsPublic}
						Anyone on the internet with the link can view your LiveTrack.
					{:else}
						Only people with explicit access can open your LiveTrack.
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
					toast.success('Link copied to clipboard', { duration: 3000 });
				}}
			>
				Copy Link
			</Button>
		</div>
	</div>

	<h3>People with access</h3>

	<p class="text-sm text-muted-foreground">
		The list of users with explicit access to your LiveTrack. If your link access is <i
			>restricted</i
		>, only those listed below that have been approved will be able to access your LiveTrack.
	</p>
	<div class="mt-2">
		<FollowersTable showLastSeen={flags.ENABLE_VISITS_STATISTICS} />
	</div>

	{#if flags.ENABLE_VISITS_STATISTICS}
		<h3>Visits history</h3>

		<div class="mt-6">
			<VisitsCharts />
		</div>
	{/if}
{:else}
	<p class="mt-6 text-center text-xl text-muted-foreground">
		You don't have a LiveTrack link setup yet.
	</p>
	<div class="mt-6 flex justify-center gap-4">
		<Button size="lg" href={pages().gettingStarted.url}>Getting started</Button>
	</div>
	{#if user}
		<LinkSetupAlert {user} {link} />
	{/if}
{/if}
