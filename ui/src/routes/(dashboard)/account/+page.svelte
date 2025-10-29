<script lang="ts">
	import FollowingTable from './following-table.svelte';

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

{#if user.passwordTrait}
	<h3>Hi, {user.passwordTrait.email}!</h3>
{/if}
{#if user.githubTrait}
	<h3>Hi, {user.githubTrait.username}!</h3>
{/if}
{#if user.googleTrait}
	<h3>Hi, {user.googleTrait.username}!</h3>
{/if}
<p>Your user ID is {user.uuid}.</p>
{#if flags.ENABLE_VERIFY_EMAIL}
	{#if user.passwordTrait && !user.passwordTrait.isEmailVerified}
		{#if !success}
			<form onsubmit={askVerify}>
				<button>Verify email</button>
			</form>
		{/if}
		{message}
	{/if}
{/if}

<h3>Following</h3>

<p class="text-muted-foreground text-sm">
	The list of users you are following or sent a follow request to. If their link access is
	<i>restricted</i>, your follow request will need to be approved in order to access their
	LiveTrack.
</p>
<div class="mt-2">
	<FollowingTable />
</div>
