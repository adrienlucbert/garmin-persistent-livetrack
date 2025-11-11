<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';
	import type { PublicUserWithTraits } from '$lib/server/db/schema';
	import { ResendEmailButton } from '$lib/components/forms/verifyEmail';
	import { m } from '$lib/paraglide/messages.js';

	let { user }: { user: PublicUserWithTraits } = $props();
</script>

{#if user.email && !user.isEmailVerified}
	<Alert.Root variant="warning">
		<CircleAlertIcon />
		<Alert.Title class="line-clamp-none tracking-normal">{m.verify_email_title()}</Alert.Title>
		<Alert.Description>
			<div class="flex flex-col gap-4 md:flex-row">
				<p>
					{@html m.verify_email_text({ email: user.email })}
				</p>
				<ResendEmailButton variant="warning-outline" />
			</div>
		</Alert.Description>
	</Alert.Root>
{/if}
