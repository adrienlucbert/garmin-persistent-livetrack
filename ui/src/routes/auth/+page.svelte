<script lang="ts">
	import type { FeatureFlags } from '$lib/featureFlags/index';
	import * as Tabs from '$lib/components/ui/tabs';
	import { SigninForm } from '$lib/components/forms/signin';
	import { SignupForm } from '$lib/components/forms/signup';
	import { RecoverPasswordForm } from '$lib/components/forms/recoverPassword';
	import { ResetPasswordForm } from '$lib/components/forms/resetPassword';
	import { VerifyEmailResult } from '$lib/components/forms/verifyEmail';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	type Tab = 'signin' | 'signup' | 'reset';
	let tab = $derived((page.url.searchParams.get('tab') as Tab) ?? 'signin');
	let token = $derived(page.url.searchParams.get('token'));
	let followURL = $derived(page.url.searchParams.get('follow'));

	let { form, data } = $props();
	let { flags }: { flags: FeatureFlags } = data;

	function navigate(next: Tab) {
		page.url.searchParams.set('tab', next);
		goto(`?${page.url.searchParams.toString()}`, { replaceState: true });
	}

	let success = $state(data.success || false);
	let message = $state(data.message);
</script>

<div class="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
	<Tabs.Root value={tab}>
		<Tabs.Content value="signin">
			<SigninForm
				method="post"
				action="?/signin"
				{navigate}
				{followURL}
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
				{followURL}
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
						{followURL}
						message={form?.message}
					/>
				{:else}
					<ResetPasswordForm
						method="post"
						action="?/resetPassword"
						{navigate}
						{followURL}
						message={form?.message}
						{token}
					/>
				{/if}
			</Tabs.Content>
		{/if}
		{#if flags.ENABLE_VERIFY_EMAIL}
			<Tabs.Content value="verify">
				<VerifyEmailResult {success} {message} {navigate} />
			</Tabs.Content>
		{/if}
	</Tabs.Root>
</div>
