<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';

	let { data, form } = $props();
	let trackingLink = $derived(data.trackingLink);
	let submitting = $state(false);
</script>

{#if trackingLink}
	Here's your tracking link
	<pre>
 {JSON.stringify(trackingLink, null, 2)} 
	</pre>
{:else}
	<form
		method="POST"
		action="?/create"
		use:enhance={() => {
			submitting = true;
		}}
	>
		<div class="flex flex-col gap-6">
			<div class="gap-2">
				<Button disabled={submitting} type="submit">Create your link</Button>
				<p style="color: red">{form?.message ?? ''}</p>
			</div>
		</div>
	</form>
{/if}
