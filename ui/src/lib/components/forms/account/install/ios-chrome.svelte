<script lang="ts">
	import IOSShareIcon from '$static/img/install/ios-share.svg';
	import AddToHomeScreenIcon from '$static/img/install/add-to-home-screen.svg';
	import { IconFrame } from '$lib/components/ui/icon-frame';
	import { m } from '$lib/paraglide/messages';
</script>

<div>
	<ul>
		<li>
			<IconFrame><IOSShareIcon /></IconFrame>
			1. {m.install_ios_chrome_1()}
		</li>
		<li>
			<IconFrame><AddToHomeScreenIcon /></IconFrame>
			2. {m.install_ios_chrome_2()}
		</li>
	</ul>
</div>
