<script lang="ts">
	import FollowingTable from './following-table.svelte';
	import { m } from '$lib/paraglide/messages.js';

	let { data } = $props();
	let { user, flags } = data;

	let success = $state(false);
	let message = $state('');

	async function askVerify(e: SubmitEvent) {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);

		const res = await fetch('/auth/verify', {
			method: 'POST',
			body: formData
		});
		success = res.status >= 200 && res.status < 300;
		const data = await res.json();
		message = data.message;
	}
</script>

<h3>Hi, {user?.name}!</h3>
<p>Your user ID is {user?.uuid}.</p>
{#if flags.ENABLE_VERIFY_EMAIL}
	{#if user?.passwordTrait && !user?.passwordTrait.isEmailVerified}
		{#if !success}
			<form onsubmit={askVerify}>
				<button>{m.verify_email()}</button>
			</form>
		{/if}
		{message}
	{/if}
{/if}

<h3 id="following">{m.following_title()}</h3>
<p class="text-muted-foreground text-sm">
	{@html m.following_text()}
</p>
<div class="mt-2">
	<FollowingTable />
</div>
