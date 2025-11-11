<script lang="ts">
	import AccountSidebar from '$lib/components/sidebars/account-sidebar.svelte';
	import FollowingTable from './following-table.svelte';
	import { EditUserForm, ChangePasswordForm } from '$lib/components/forms/account';
	import { Separator } from '$lib/components/ui/separator';
	import { SvelteURL } from 'svelte/reactivity';
	import { VerifyEmailForm } from '$lib/components/forms/account';
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages.js';

	let { data } = $props();
	let { user, flags } = data;

	const url = new SvelteURL(page.url);
	let active = $derived(url.hash || '#profile');
</script>

<div class="flex h-full w-full flex-col md:flex-row">
	<AccountSidebar {url} {active} />
	<Separator class="mx-0 hidden md:block" orientation="vertical" />
	<div class="flex w-full flex-col">
		{#key active}
			<div class="mx-auto flex w-full max-w-2xl flex-col content-start gap-4 p-4 py-5 pb-9">
				{#if active === '#profile'}
					<h3 class="mt-0">{m.user_profile_title()}</h3>
					{#if user}
						{#if flags.ENABLE_VERIFY_EMAIL}
							<VerifyEmailForm {user} />
						{/if}
						<EditUserForm method="post" action="?/editUser" message={''} userWithTraits={user} />
						{#if user.passwordTrait}
							<h3 class="mt-0">{m.change_password_title()}</h3>
							<ChangePasswordForm method="post" action="?/changePassword" message={''} />
						{/if}
					{/if}
				{/if}

				{#if active === '#following'}
					<h3 class="mt-0">{m.following_title()}</h3>
					<p class="text-sm text-muted-foreground">
						{@html m.following_text()}
					</p>
					<div class="mt-2">
						<FollowingTable />
					</div>
				{/if}
			</div>
		{/key}
	</div>
</div>
