<script lang="ts">
	import DataTable from '$lib/components/ui/data-table/data-table.svelte';
	import type { ColumnDef } from '@tanstack/table-core';
	import RowActions from './actions.svelte';
	import { renderComponent } from '$lib/components/ui/data-table';
	import CheckIcon from '@lucide/svelte/icons/check';
	import XIcon from '@lucide/svelte/icons/x';
	import { type FollowerStats } from '$lib/server/followers/followers';
	import type { UUID } from 'crypto';
	import IconWithTooltip from '$lib/components/icon-with-tooltip.svelte';
	import { m } from '$lib/paraglide/messages.js';

	let {
		showLastSeen,
		followersStats,
		approveFollower,
		denyFollower,
		banFollower
	}: {
		showLastSeen: boolean;
		followersStats: FollowerStats[];
		approveFollower: (followerUserUUID: UUID) => Promise<void>;
		denyFollower: (followerUserUUID: UUID) => Promise<void>;
		banFollower: (followerUserUUID: UUID) => Promise<void>;
	} = $props();

	export const columns: ColumnDef<FollowerStats>[] = [
		{
			header: m.followers_user_header(),
			accessorKey: 'followerUserUUID'
		},
		{
			header: m.followers_notifications_header(),
			cell: ({ row }) => {
				return row.original.enabledNotifications
					? renderComponent(IconWithTooltip, {
							title: 'Enabled',
							icon: CheckIcon,
							size: '1em'
						})
					: renderComponent(IconWithTooltip, {
							title: 'Disabled',
							icon: XIcon,
							size: '1em'
						});
			}
		},
		...(showLastSeen
			? [
					{
						header: m.followers_visits_header(),
						accessorKey: 'visits'
					},
					{
						header: m.followers_last_seen_header(),
						accessorFn: (row: FollowerStats) => row['lastSeen']?.toLocaleString() || '-'
					}
				]
			: []),
		{
			header: m.followers_actions_header(),
			cell: ({ row }) => {
				return renderComponent(RowActions, {
					stats: row.original,
					approveFollower: () => approveFollower(row.original.followerUserUUID as UUID),
					denyFollower: () => denyFollower(row.original.followerUserUUID as UUID),
					banFollower: () => banFollower(row.original.followerUserUUID as UUID)
				});
			}
		}
	];
</script>

<DataTable data={followersStats} {columns} />
