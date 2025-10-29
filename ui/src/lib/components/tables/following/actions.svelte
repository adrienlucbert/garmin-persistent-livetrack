<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { Followers } from '$lib/server/db/schema';
	import { FollowStatus } from '$lib/types/followers';

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
	<Button size="sm" variant="warning-outline" onclick={cancelFollowRequest}>Cancel request</Button>
{:else if follow.status === FollowStatus.APPROVED}
	<AlertDialog.Root bind:open>
		<AlertDialog.Trigger class={buttonVariants({ variant: 'destructive-outline', size: 'sm' })}>
			Unfollow
		</AlertDialog.Trigger>
		<AlertDialog.Content interactOutsideBehavior="close">
			<AlertDialog.Header>
				<AlertDialog.Title>Are you sure?</AlertDialog.Title>
				<AlertDialog.Description>
					You will no longer be able to access their tracking link if it is private and will no
					longer receive notifications when they start an activity.
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel class={buttonVariants({ variant: 'destructive-outline' })}
					>Cancel</AlertDialog.Cancel
				>
				<AlertDialog.Action
					class={buttonVariants({ variant: 'destructive' })}
					onclick={() => unfollow().finally(() => (open = false))}
				>
					Unfollow
				</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
{/if}
