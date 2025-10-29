<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { toast } from 'svelte-sonner';

	let {
		checked,
		disabled,
		onToggle
	}: {
		checked: boolean;
		disabled?: boolean;
		onToggle: (enabled: boolean) => Promise<void>;
	} = $props();

	let updatingNotificationsPreference = $state(false);

	async function toggleHandler(enable: boolean) {
		checked = !enable;
		updatingNotificationsPreference = true;

		try {
			await onToggle(enable);
			checked = enable;
		} catch (error) {
			checked = !enable;
			toast.error('An error occurred', {
				description: String(error),
				duration: 10000
			});
		} finally {
			updatingNotificationsPreference = false;
		}
	}
</script>

<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<Switch
				disabled={disabled || updatingNotificationsPreference}
				aria-label="Toggle notifications"
				class="cursor-pointer"
				id="per-user"
				bind:checked
				onCheckedChange={toggleHandler}
			/>
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>Get notified about when this user starts a new activity.</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
