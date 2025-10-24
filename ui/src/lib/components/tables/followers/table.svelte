<script lang="ts">
	import DataTable from '$lib/components/ui/data-table/data-table.svelte';
	import type { ColumnDef } from '@tanstack/table-core';
	import RowActions from './actions.svelte';
	import { renderComponent } from '$lib/components/ui/data-table';
	import CheckIcon from '@lucide/svelte/icons/check';
	import XIcon from '@lucide/svelte/icons/x';
	import { type FollowerStats } from '$lib/server/followers/followers';
	import IconWithTitle from './icon-with-title.svelte';
	import type { UUID } from 'crypto';

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
			accessorKey: 'followerUserUUID',
			header: 'User'
		},
		{
			cell: ({ row }) => {
				return row.original.enabledNotifications
					? renderComponent(IconWithTitle, {
							title: 'Enabled',
							icon: CheckIcon,
							size: '1em'
						})
					: renderComponent(IconWithTitle, {
							title: 'Disabled',
							icon: XIcon,
							size: '1em'
						});
			},
			header: 'Notifications'
		},
		...(showLastSeen
			? [
					{
						accessorKey: 'visits',
						header: 'Visits'
					},
					{
						accessorFn: (row: FollowerStats) => row['lastSeen']?.toLocaleString() || '-',
						header: 'Last seen'
					}
				]
			: []),
		{
			header: 'Actions',
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
