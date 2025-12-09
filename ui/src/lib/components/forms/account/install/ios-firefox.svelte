<script lang="ts">
	import MenuIcon from '$static/img/install/menu.svg';
	import IOSShareIcon from '$static/img/install/ios-share.svg';
	import AddToHomeScreenIcon from '$static/img/install/add-to-home-screen.svg';
	import { IconFrame } from '$lib/components/ui/icon-frame';
	import { m } from '$lib/paraglide/messages';
</script>

<div>
	<ul>
		<li>
			<IconFrame><MenuIcon /></IconFrame>
			1. {m.install_ios_firefox_1()}
		</li>
		<li>
			<IconFrame><IOSShareIcon /></IconFrame>
			2. {m.install_ios_firefox_2()}
		</li>
		<li>
			<IconFrame><AddToHomeScreenIcon /></IconFrame>
			3. {m.install_ios_firefox_3()}
		</li>
	</ul>
</div>
