<script lang="ts">
	import IOSShareIcon from '$static/img/install/ios-share.svg';
	import AddToHomeScreenIcon from '$static/img/install/add-to-home-screen.svg';
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import { IconFrame } from '$lib/components/ui/icon-frame';
	import { m } from '$lib/paraglide/messages';
</script>

<div>
	<ul>
		<li>
			<IconFrame><Ellipsis /></IconFrame>
			1. {m.install_ios_26_safari_1()}
		</li>
		<li>
			<IconFrame><IOSShareIcon /></IconFrame>
			2. {m.install_ios_26_safari_2()}
		</li>
		<li>
			<IconFrame><Ellipsis /></IconFrame>
			3. {m.install_ios_26_safari_3()}
		</li>
		<li>
			<IconFrame><AddToHomeScreenIcon /></IconFrame>
			4. {m.install_ios_26_safari_4()}
		</li>
	</ul>
</div>
