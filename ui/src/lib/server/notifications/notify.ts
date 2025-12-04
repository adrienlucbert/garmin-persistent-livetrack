import { Notification } from "$lib/types/notifications";
import { userCanReceiveEmail } from '$lib/server/email/helpers';
import { EmailNotifier, WebPushNotifier, type Notifier } from "./notifiers";

export async function notify<K extends Notification>(notification: K, ...args: Parameters<Notifier[K]>) {
	const [user, ..._] = args
	const preference = user.notificationPreferences?.[notification];
	if (!preference) {
		return
	}
	if (preference.email === true && userCanReceiveEmail(user)) {
		EmailNotifier[notification].call(null, ...args)
	}
	if (preference.push === true) {
		WebPushNotifier[notification].call(null, ...args)
	}
}
