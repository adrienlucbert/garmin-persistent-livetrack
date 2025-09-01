<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let token = $page.url.searchParams.get('token');
</script>

{#if !token}
	<h1>Recover password</h1>
	<form method="post" action="?/recoverPassword" use:enhance>
		<label>
			Email address
			<input
				name="email"
				type="email"
				class="mt-1 rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
		</label>
		<br />
		<button class="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
			>Recover</button
		>
	</form>
	<p style="color: red">{form?.message ?? ''}</p>
	Or&nbsp;<a href="/auth/signin">sign-in</a>
{:else}
	<h1>Reset password</h1>
	<form method="post" action="?/resetPassword" use:enhance>
		<input name="token" type="hidden" value={token} />
		<label>
			New password
			<input
				name="password"
				type="password"
				class="mt-1 rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
		</label>
		<br />
		<label>
			Confirm new password
			<input
				name="confirm_password"
				type="password"
				class="mt-1 rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
		</label>
		<br />
		<button class="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
			>Reset</button
		>
	</form>
{/if}
