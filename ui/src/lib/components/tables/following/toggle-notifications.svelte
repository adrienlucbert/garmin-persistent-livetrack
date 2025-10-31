<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { toast } from 'svelte-sonner';
	import { m } from '$lib/paraglide/messages.js';

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
			toast.error(m.an_error_occurred(), {
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
				aria-label={m.toggle_notifications()}
				class="cursor-pointer"
				id="toggle-notifications"
				bind:checked
				onCheckedChange={toggleHandler}
			/>
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>{m.toggle_notifications_tooltip()}</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
