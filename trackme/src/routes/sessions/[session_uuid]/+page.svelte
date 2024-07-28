<script lang="ts">
import type { LiveTrackSession } from '$lib/orm/models/LiveTrackSession'

export let data: LiveTrackSession
</script>

<style>
		#content
		{
				position:absolute;
				height: 100%;
				overflow: hidden;
				margin: 0;
				padding: 0;
				left: 0;
				right: 0;
				bottom: 0;
				top: 0; 
		}
</style>

<svelte:head>
		<title>Garmin Live Track</title>
</svelte:head>

<div id="content">
		<iframe width="100%" height="100%" frameborder="0" src="{data.link}"></iframe>
</div>
