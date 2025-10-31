<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { FollowerStats } from '$lib/server/followers/followers';
	import { FollowStatus } from '$lib/types/followers';
	import { m } from '$lib/paraglide/messages.js';

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
	<Button variant="success-outline" size="sm" onclick={approveFollower}
		>{m.followers_approve()}</Button
	>
{/if}
{#if [FollowStatus.PENDING, FollowStatus.APPROVED].includes(stats.status)}
	<AlertDialog.Root bind:open>
		<AlertDialog.Trigger class={buttonVariants({ variant: 'destructive-outline', size: 'sm' })}>
			{stats.status === FollowStatus.PENDING ? m.followers_deny() : m.followers_revoke()}
		</AlertDialog.Trigger>
		<AlertDialog.Content interactOutsideBehavior="close">
			<AlertDialog.Header>
				<AlertDialog.Title>{m.are_you_sure()}</AlertDialog.Title>
				<AlertDialog.Description>
					{m.followers_permanently_or_temporarily({
						action: (stats.status === FollowStatus.PENDING
							? m.followers_deny()
							: m.followers_revoke()
						).toLowerCase()
					})}
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Action
					class={buttonVariants({ variant: 'destructive-outline' })}
					onclick={() => banFollower().finally(() => (open = false))}
				>
					{m.followers_permanently({
						action:
							stats.status === FollowStatus.PENDING ? m.followers_deny() : m.followers_revoke()
					})}
				</AlertDialog.Action>
				<AlertDialog.Action
					class={buttonVariants({ variant: 'destructive' })}
					onclick={() => denyFollower().finally(() => (open = false))}
				>
					{stats.status === FollowStatus.PENDING ? m.followers_deny() : m.followers_revoke()}
					{m.followers_access()}
				</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
{/if}
