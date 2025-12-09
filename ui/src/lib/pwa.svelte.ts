export const supportsInstallPrompt = typeof window !== 'undefined' && 'onbeforeinstallprompt' in window;

export async function installPWA(): Promise<boolean> {
	if (!window.deferredInstallPrompt) {
		return false
	}
	window.deferredInstallPrompt.prompt();
	const result = await window.deferredInstallPrompt.userChoice;
	return result.outcome === 'accepted'
}
