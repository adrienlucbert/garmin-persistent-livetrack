<script lang="ts">
	import type { FeatureFlags } from '$lib/featureFlags/index';
	import * as Tabs from '$lib/components/ui/tabs';
	import { SigninForm } from '$lib/components/ui/forms/signin';
	import { SignupForm } from '$lib/components/ui/forms/signup';
	import { RecoverPasswordForm } from '$lib/components/ui/forms/recoverPassword';
	import { ResetPasswordForm } from '$lib/components/ui/forms/resetPassword';
	import { VerifyEmailForm } from '$lib/components/ui/forms/verifyEmail';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	type Tab = 'signin' | 'signup' | 'reset';
	let tab = $derived((page.url.searchParams.get('tab') as Tab) ?? 'signin');
	let token = $derived(page.url.searchParams.get('token'));

	let { form, data } = $props();
	let { flags }: { flags: FeatureFlags } = data;

	function navigate(next: Tab) {
		goto(`?tab=${next}`, { replaceState: true });
	}

	let success = $state(data.success);
	let message = $state(data.message);

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

<div class="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
	<Tabs.Root value={tab}>
		<Tabs.Content value="signin">
			<SigninForm
				method="post"
				action="?/signin"
				{navigate}
				message={form?.message}
				withRecoverPassword={flags.ENABLE_RECOVER_PASSWORD}
				withGoogle={flags.ENABLE_OAUTH_GOOGLE}
				withGithub={flags.ENABLE_OAUTH_GITHUB}
			/>
		</Tabs.Content>
		<Tabs.Content value="signup">
			<SignupForm
				method="post"
				action="?/signup"
				{navigate}
				message={form?.message}
				withGoogle={flags.ENABLE_OAUTH_GOOGLE}
				withGithub={flags.ENABLE_OAUTH_GITHUB}
			/>
		</Tabs.Content>
		{#if flags.ENABLE_RECOVER_PASSWORD}
			<Tabs.Content value="reset">
				{#if !token}
					<RecoverPasswordForm
						method="post"
						action="?/recoverPassword"
						{navigate}
						message={form?.message}
					/>
				{:else}
					<ResetPasswordForm
						method="post"
						action="?/resetPassword"
						{navigate}
						message={form?.message}
						{token}
					/>
				{/if}
			</Tabs.Content>
		{/if}
		{#if flags.ENABLE_VERIFY_EMAIL}
			<Tabs.Content value="verify">
				{#if !success}
					<form onsubmit={askVerify}>
						<button>Verify email</button>
					</form>
				{/if}
				{message}

				<VerifyEmailForm success={success ?? false} {navigate} {message} />
			</Tabs.Content>
		{/if}
	</Tabs.Root>
</div>
