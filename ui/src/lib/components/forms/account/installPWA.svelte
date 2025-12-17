<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import AndroidEdge from './install/android-edge.svelte';
	import AndroidFirefox from './install/android-firefox.svelte';
	import Ios26Safari from './install/ios-26-safari.svelte';
	import IosChrome from './install/ios-chrome.svelte';
	import IosEdge from './install/ios-edge.svelte';
	import IosFirefox from './install/ios-firefox.svelte';
	import IosSafari from './install/ios-safari.svelte';
	import MacosSafari from './install/macos-safari.svelte';
	import DesktopFirefox from './install/desktop-firefox.svelte';
	import Unknown from './install/unknown.svelte';
	import { getBrowser, getIOSVersion, getPlatform, isIOS } from '$lib/platform';
	import type { Component } from 'svelte';
	import { installPWA, supportsInstallPrompt, deferredInstall } from '$lib/pwa.svelte';
	import { m } from '$lib/paraglide/messages';
	import { Button, buttonVariants, type ButtonVariant } from '$lib/components/ui/button';

	let {
		appName,
		variant = 'outline',
		open = $bindable(false)
	}: {
		appName: string;
		variant?: ButtonVariant;
		open?: boolean;
	} = $props();

	const instructions: { [key: string]: Component } = {
		'ios-safari': IosSafari,
		'ios-26-safari': Ios26Safari,
		'ios-chrome': IosChrome,
		'ios-edge': IosEdge,
		'ios-firefox': IosFirefox,
		'android-edge': AndroidEdge,
		'android-firefox': AndroidFirefox,
		'macos-safari': MacosSafari,
		'macos-firefox': DesktopFirefox,
		'windows-firefox': DesktopFirefox,
		'linux-firefox': DesktopFirefox
	};

	export const getInstallInstructions = () => {
		if (isIOS() && getIOSVersion()?.major === 26) {
			return instructions['ios-26-safari'];
		}

		const key = `${getPlatform()}-${getBrowser()}`;
		return instructions[key] ?? Unknown;
	};

	const InstallInstructions = getInstallInstructions();
</script>

{#if supportsInstallPrompt && deferredInstall.available}
	<Button {variant} onclick={installPWA}>
		{m.install_button()}
	</Button>
{:else}
	<Drawer.Root bind:open>
		<Drawer.Trigger class={buttonVariants({ variant })}>
			{m.install_button()}
		</Drawer.Trigger>
		<Drawer.Content>
			<div class="mx-auto w-full max-w-md">
				<Drawer.Header class="flex-row">
					<div class="mr-2 inline-flex items-center justify-center">
						<img alt="app icon" src="/icons/icon-192x192.png" class="w-20" />
					</div>
					<div>
						<Drawer.Title>
							{m.install_drawer_title({ appName })}
						</Drawer.Title>
						<Drawer.Description>
							{m.install_drawer_description({ appName })}
						</Drawer.Description>
					</div>
				</Drawer.Header>
				<div class="p-4 text-justify [&_li]:mb-1 [&_li]:flex [&_li]:items-center [&_li]:gap-4">
					<InstallInstructions />
				</div>
			</div>
		</Drawer.Content>
	</Drawer.Root>
{/if}
