<script lang="ts">
	import { Button, type ButtonVariant } from '$lib/components/ui/button';
	import { Spinner } from '$lib/components/ui/spinner';
	import MailIcon from '@lucide/svelte/icons/mail';
	import CheckIcon from '@lucide/svelte/icons/check';
	import { toast } from 'svelte-sonner';
	import { m } from '$lib/paraglide/messages.js';

	let { variant = 'outline', class: className }: { variant?: ButtonVariant; class?: string } =
		$props();

	let submitting = $state(false);
	let succeeded = $state(false);

	async function askVerify(e: SubmitEvent) {
		e.preventDefault();
		submitting = true;

		try {
			const res = await fetch('/auth/verify', { method: 'POST' });
			if (res.ok) {
				succeeded = true;
				toast.success(m.new_verify_link_sent(), { duration: 3000 });
			} else {
				const data = await res.json();
				toast.error(data.message, { duration: 3000 });
			}
		} finally {
			submitting = false;
		}
	}
</script>

<form onsubmit={askVerify}>
	<Button type="submit" {variant} class={className} disabled={submitting || succeeded}>
		{#if submitting}
			<Spinner />
		{:else if succeeded}
			<CheckIcon />
		{:else}
			<MailIcon />
		{/if}
		{m.resend_email()}
	</Button>
</form>
