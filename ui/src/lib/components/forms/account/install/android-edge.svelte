<script lang="ts">
	import MenuIcon from '$static/img/install/menu.svg';
	import AddToPhoneIcon from '$static/img/install/add-to-phone.svg';
	import { IconFrame } from '$lib/components/ui/icon-frame';
	import { m } from '$lib/paraglide/messages';
</script>

<div>
	<ul>
		<li>
			<IconFrame><MenuIcon /></IconFrame>
			1. {m.install_android_edge_1()}
		</li>
		<li>
			<IconFrame><AddToPhoneIcon /></IconFrame>
			2. {m.install_android_edge_2()}
		</li>
	</ul>
</div>
