<script lang="ts">
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
	<h1>Hi, {user.passwordTrait.email}!</h1>
{/if}
{#if user.githubTrait}
	<h1>Hi, {user.githubTrait.username}!</h1>
{/if}
{#if user.googleTrait}
	<h1>Hi, {user.googleTrait.username}!</h1>
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
