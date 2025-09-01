<script lang="ts">
	import { enhance } from '$app/forms';

	let { data } = $props();
</script>

<h1>Hi, {data.user.email}!</h1>
<p>Your user ID is {data.user.uuid}.</p>
<form method="post" action="?/signout" use:enhance>
	<button>Sign out</button>
</form>
