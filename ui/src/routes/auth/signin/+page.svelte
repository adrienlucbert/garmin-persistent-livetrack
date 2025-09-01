<script lang="ts">
	import { enhance } from '$app/forms';
	import type { FeatureFlags } from '$lib/featureFlags/index';

	let { form, data } = $props();
	let { flags }: { flags: FeatureFlags } = data;
</script>

<h1>Sign-in</h1>
<form method="post" action="?/signin" use:enhance>
	<label>
		Email address
		<input
			name="email"
			type="email"
			class="mt-1 rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
		/>
	</label>
	<br />
	<label>
		Password
		<input
			type="password"
			name="password"
			class="mt-1 rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
		/>
	</label>
	<br />
	<button class="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
		>Sign-in</button
	>
</form>
<p style="color: red">{form?.message ?? ''}</p>
{#if flags.ENABLE_RECOVER_PASSWORD}
	<a href="/auth/recover">Forgot your password?</a>
	<br />
{/if}
Or&nbsp;<a href="/auth/signup">sign-up</a>
