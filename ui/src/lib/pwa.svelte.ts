export let deferredInstall = $state<{
	available: boolean
	event: Event | undefined
}>({
	available: typeof window !== 'undefined' && window.__deferredInstallPrompt !== undefined,
	event: typeof window !== 'undefined' ? window.__deferredInstallPrompt : undefined
})

if (typeof window !== 'undefined') {
	window.addEventListener("pwa-install-available", (e) => {
		deferredInstall.event = e.detail;
		deferredInstall.available = true;
	});
}

export const supportsInstallPrompt = typeof window !== 'undefined' && 'onbeforeinstallprompt' in window;

export async function installPWA(): Promise<boolean> {
	if (!deferredInstall.event) {
		return false
	}
	deferredInstall.event.prompt();
	const result = await deferredInstall.event.userChoice;
	return result.outcome === 'accepted'
}
