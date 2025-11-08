<script lang="ts">
	import type { UUID } from 'crypto';
	import { toast } from 'svelte-sonner';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { FollowingDataTable } from '$lib/components/tables/following';
	import { m } from '$lib/paraglide/messages.js';
	import type { FollowersWithNames } from '$lib/server/followers/followers';

	async function fetchFollowing(): Promise<FollowersWithNames[]> {
		return fetch('/api/following').then((r) => r.json());
	}
	let followingPromise = $state(fetchFollowing());

	async function refreshFollowing(): Promise<FollowersWithNames[]> {
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
					throw m.unexpected_server_error({ code: res.status });
				});
				throw message;
			}
		} catch (error) {
			toast.error(m.an_error_occurred(), {
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
		{m.following_issue_loading()}
	{/if}
{:catch error}
	{error.message}
{/await}
