export const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
export const isAndroid = () => /android/i.test(navigator.userAgent);
export const isMacOS = () =>
	/Macintosh|Mac|Mac OS|MacIntel|MacPPC|Mac68K/gi.test(navigator.userAgent);
export const isWindows = () => /Win32|Win64|Windows|Windows NT|WinCE/gi.test(navigator.userAgent);
export const isChromeOS = () => /CrOS/gi.test(navigator.userAgent);
export const isLinux = () => /Linux/gi.test(navigator.userAgent);
export const getBrowser = () => {
	const { userAgent } = navigator;

	if (userAgent.match(/edg/i)) return 'edge';
	if (userAgent.match(/chrome|chromium|crios/i)) return 'chrome';
	if (userAgent.match(/firefox|fxios/i)) return 'firefox';
	if (userAgent.match(/safari/i)) return 'safari';
	if (userAgent.match(/opr\//i)) return 'opera';
	if (userAgent.match(/android/i)) return 'android';
	if (userAgent.match(/iphone/i)) return 'iphone';
	return 'unknown';
};

export const getPlatform = () => {
	if (isIOS()) return 'ios';
	if (isAndroid()) return 'android';
	if (isMacOS()) return 'macos';
	if (isChromeOS()) return 'chromeos';
	if (isWindows()) return 'windows';
	if (isLinux()) return 'linux';
	return 'unknown';
};

export const getIOSVersion = () => {
	const m = navigator.userAgent.match(/Version\/([0-9._]+)/);
	if (!m) {
		return null;
	}

	const parts = m[1].split(/[._]/).map((n) => parseInt(n, 10));
	return {
		raw: m[1],
		major: parts[0] || 0,
		minor: parts[1] || 0,
		patch: parts[2] || 0,
		parts
	};
};

export const isInstalled = () => window.matchMedia('(display-mode: standalone)').matches;
