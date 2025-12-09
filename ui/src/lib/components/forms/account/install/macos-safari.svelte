<script lang="ts">
	import IOSShareIcon from '$static/img/install/ios-share.svg';
	import AddToDockIcon from '$static/img/install/add-to-dock.svg';
	import { IconFrame } from '$lib/components/ui/icon-frame';
	import { m } from '$lib/paraglide/messages';
</script>

<div>
	<ul>
		<li>
			<IconFrame><IOSShareIcon /></IconFrame>
			1. {m.install_macos_safari_1()}
		</li>
		<li>
			<IconFrame><AddToDockIcon /></IconFrame>
			2. {m.install_macos_safari_2()}
		</li>
	</ul>
</div>
