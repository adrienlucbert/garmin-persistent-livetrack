export const NotificationSubscriptionManager = {
	isAvailable: () => 'Notification' in window && 'serviceWorker' in navigator,

	isGranted: () => Notification.permission === 'granted',

	isSubscribed: async () => {
		const registration = await navigator.serviceWorker.ready;
		const subscription = await registration.pushManager.getSubscription();
		return subscription !== null;
	},

	requestPermission: async () => {
		return Notification.requestPermission()
			.then((permission) => {
				return permission === 'granted';
			});
	},

	subscribe: async (pubkey: string) => {
		const registration = await navigator.serviceWorker.ready;
		return registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: pubkey
		});
	},

	unsubscribe: async () => {
		const registration = await navigator.serviceWorker.ready;
		const subscription = await registration.pushManager.getSubscription();
		if (subscription) {
			return await subscription.unsubscribe();
		}
		return true
	},

	persist: async (subscription: PushSubscription) => {
		const res = await fetch('/api/user/notifications/subscribe', {
			method: 'POST',
			body: JSON.stringify({ subscription })
		});
		return res.ok
	}
}

export async function ensureNotificationSubscription(pubkey: string) {
	if (
		NotificationSubscriptionManager.isAvailable()
		&& NotificationSubscriptionManager.isGranted()
		&& !(await NotificationSubscriptionManager.isSubscribed())
	) {
		return NotificationSubscriptionManager.subscribe(pubkey)
			.then(NotificationSubscriptionManager.persist);
	}
	return false
}
