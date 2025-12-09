<script lang="ts">
	import MenuVertIcon from '$static/img/install/menu-vert.svg';
	import InstallPhoneIcon from '$static/img/install/install-phone.svg';
	import { IconFrame } from '$lib/components/ui/icon-frame';
	import { m } from '$lib/paraglide/messages';
</script>

<div>
	<ul>
		<li>
			<IconFrame><MenuVertIcon /></IconFrame>
			1. {m.install_android_firefox_1()}
		</li>
		<li>
			<IconFrame><InstallPhoneIcon /></IconFrame>
			2. {m.install_android_firefox_2()}
		</li>
	</ul>
</div>
