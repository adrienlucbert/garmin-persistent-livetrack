<script lang="ts">
	import type { UUID } from 'crypto';
	import { toast } from 'svelte-sonner';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { FollowingDataTable } from '$lib/components/tables/following';
	import type { Followers } from '$lib/server/db/schema';

	async function fetchFollowing(): Promise<Followers[]> {
		return fetch('/api/following').then((r) => r.json());
	}
	let followingPromise = $state(fetchFollowing());

	async function refreshFollowing(): Promise<Followers[]> {
		const stats = await fetchFollowing();
		followingPromise = Promise.resolve(stats);
		return stats;
	}

	async function removeFollowRequest(userUUID: UUID): Promise<void> {
		try {
			const res = await fetch(`/api/following/${userUUID}`, { method: 'DELETE' });
			if (res.ok) {
				await refreshFollowing();
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
		}
	}
</script>

{#await followingPromise}
	<Skeleton class="h-20 w-full" />
{:then following}
	{#if following}
		<FollowingDataTable
			{following}
			cancelFollowRequest={removeFollowRequest}
			unfollow={removeFollowRequest}
		/>
	{:else}
		There was an issue loading followers.
	{/if}
{:catch error}
	{error.message}
{/await}
