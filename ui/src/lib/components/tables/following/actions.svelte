<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { Followers } from '$lib/server/db/schema';
	import { FollowStatus } from '$lib/types/followers';
	import { m } from '$lib/paraglide/messages.js';

	let {
		follow,
		cancelFollowRequest,
		unfollow
	}: {
		follow: Followers;
		cancelFollowRequest: () => Promise<void>;
		unfollow: () => Promise<void>;
	} = $props();

	let open = $state(false);
</script>

{#if [FollowStatus.PENDING, FollowStatus.DENIED].includes(follow.status)}
	<Button size="sm" variant="warning-outline" onclick={cancelFollowRequest}>
		{m.following_cancel_request()}
	</Button>
{:else if follow.status === FollowStatus.APPROVED}
	<AlertDialog.Root bind:open>
		<AlertDialog.Trigger class={buttonVariants({ variant: 'destructive-outline', size: 'sm' })}>
			{m.following_unfollow()}
		</AlertDialog.Trigger>
		<AlertDialog.Content interactOutsideBehavior="close">
			<AlertDialog.Header>
				<AlertDialog.Title>{m.are_you_sure()}</AlertDialog.Title>
				<AlertDialog.Description>
					{m.following_unfollow_text()}
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel class={buttonVariants({ variant: 'destructive-outline' })}>
					{m.cancel()}
				</AlertDialog.Cancel>
				<AlertDialog.Action
					class={buttonVariants({ variant: 'destructive' })}
					onclick={() => unfollow().finally(() => (open = false))}
				>
					{m.following_unfollow()}
				</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
{/if}
