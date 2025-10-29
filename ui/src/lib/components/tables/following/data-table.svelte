<script lang="ts">
	import DataTable from '$lib/components/ui/data-table/data-table.svelte';
	import type { ColumnDef } from '@tanstack/table-core';
	import RowActions from './actions.svelte';
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	import { renderComponent } from '$lib/components/ui/data-table';
	import type { UUID } from 'crypto';
	import type { Followers } from '$lib/server/db/schema';
	import { getAthleteLink } from '$lib/link';
	import ButtonIcon from '$lib/components/button-icon.svelte';
	import ToggleNotifications from './toggle-notifications.svelte';
	import { FollowStatus } from '$lib/types/followers';

	let {
		following,
		cancelFollowRequest,
		unfollow
	}: {
		following: Followers[];
		cancelFollowRequest: (userUUID: UUID) => Promise<void>;
		unfollow: (userUUID: UUID) => Promise<void>;
	} = $props();

	async function updateNotificationsPreference(userUUID: UUID, enable: boolean) {
		const res = await fetch(`/api/following/${userUUID}/notifications`, {
			method: 'PUT',
			body: JSON.stringify({ enabled: enable })
		});
		if (!res.ok) {
			const { message } = await res.json().catch(() => {
				throw `Unexpected server error ${res.status}`;
			});
			throw message;
		}
	}

	export const columns: ColumnDef<Followers>[] = [
		{
			header: 'User',
			accessorKey: 'userUUID'
		},
		{
			header: 'Notifications',
			cell: ({ row }) => {
				return renderComponent(ToggleNotifications, {
					checked: row.original.enabledNotifications || false,
					disabled: row.original.status !== FollowStatus.APPROVED,
					onToggle: (enabled: boolean) =>
						updateNotificationsPreference(row.original.userUUID as UUID, enabled)
				});
			}
		},
		{
			header: 'Tracking link',
			cell: ({ row }) => {
				return renderComponent(ButtonIcon, {
					icon: ExternalLinkIcon,
					href: getAthleteLink(row.original.userUUID as UUID).href,
					target: '_blank'
				});
			}
		},
		{
			header: 'Actions',
			cell: ({ row }) => {
				return renderComponent(RowActions, {
					follow: row.original,
					cancelFollowRequest: () => cancelFollowRequest(row.original.userUUID as UUID),
					unfollow: () => unfollow(row.original.userUUID as UUID)
				});
			}
		}
	];
</script>

<DataTable data={following} {columns} />
