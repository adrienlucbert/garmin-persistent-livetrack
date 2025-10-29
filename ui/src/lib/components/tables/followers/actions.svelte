<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { FollowerStats } from '$lib/server/followers/followers';
	import { FollowStatus } from '$lib/types/followers';

	let {
		stats,
		approveFollower,
		denyFollower,
		banFollower
	}: {
		stats: FollowerStats;
		approveFollower: () => Promise<void>;
		denyFollower: () => Promise<void>;
		banFollower: () => Promise<void>;
	} = $props();

	let open = $state(false);
</script>

{#if [FollowStatus.PENDING, FollowStatus.DENIED].includes(stats.status)}
	<Button variant="success-outline" size="sm" onclick={approveFollower}>Approve</Button>
{/if}
{#if [FollowStatus.PENDING, FollowStatus.APPROVED].includes(stats.status)}
	<AlertDialog.Root bind:open>
		<AlertDialog.Trigger class={buttonVariants({ variant: 'destructive-outline', size: 'sm' })}>
			{stats.status === FollowStatus.PENDING ? 'Deny' : 'Revoke'}
		</AlertDialog.Trigger>
		<AlertDialog.Content interactOutsideBehavior="close">
			<AlertDialog.Header>
				<AlertDialog.Title>Are you sure?</AlertDialog.Title>
				<AlertDialog.Description>
					Do you want to permanently or temporarily {stats.status === FollowStatus.PENDING
						? 'deny'
						: 'revoke'} access?
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Action
					class={buttonVariants({ variant: 'destructive-outline' })}
					onclick={() => banFollower().finally(() => (open = false))}
				>
					Permanently {stats.status === FollowStatus.PENDING ? 'deny' : 'revoke'} access
				</AlertDialog.Action>
				<AlertDialog.Action
					class={buttonVariants({ variant: 'destructive' })}
					onclick={() => denyFollower().finally(() => (open = false))}
				>
					{stats.status === FollowStatus.PENDING ? 'Deny' : 'Revoke'} access
				</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
{/if}
