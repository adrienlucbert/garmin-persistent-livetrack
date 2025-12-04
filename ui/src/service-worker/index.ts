self.addEventListener('push', function (event: any) {
	const data = event.data.json();
	const { title, ...opts }: { title: string } & NotificationOptions = data;

	const registration = (self as any).registration as ServiceWorkerRegistration;
	event.waitUntil(
		registration.showNotification(title, opts)
	);
} as EventListener);

self.addEventListener('notificationclick', function (event: any) {
	event.notification.close();
	if (event.notification?.data?.open) {
		clients.openWindow(event.notification?.data?.open);
	}
})
