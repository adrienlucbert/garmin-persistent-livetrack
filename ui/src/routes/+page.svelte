<script lang="ts">
	let { data } = $props();
	let { flags } = data;

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

<h1>Hi, {data.user.email}!</h1>
<p>Your user ID is {data.user.uuid}.</p>
{#if flags.ENABLE_VERIFY_EMAIL}
	{#if !data.user.isEmailVerified}
		{#if !success}
			<form onsubmit={askVerify}>
				<button>Verify email</button>
			</form>
		{/if}
		{message}
	{/if}
{/if}
<form method="post" action="/auth/signout">
	<button>Sign out</button>
</form>
