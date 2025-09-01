<script lang="ts">
	let { data } = $props();
	let { success, message }: { success: boolean; message?: string } = data;
</script>

{#if success}
	<h2>Your email address was successfully verified.</h2>
	<p>You can now close this page.</p>
	<a href="/auth/signin">Go to the login page</a>
{:else}
	<p class="text-red-600">
		{message}
	</p>
	<a href="/auth/signin">Go to the login page</a>
{/if}
