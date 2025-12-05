import type { Users } from "$lib/server/db/schema";
import type { UUID } from "crypto";
import { notifyUser } from "../webpush";
import type { Notifier } from "./notifier";
import { m } from "$lib/paraglide/messages";
import { getLocale, isLocale } from "$lib/paraglide/runtime";
import { env } from '$env/dynamic/public';
import { getAthleteLink } from "$lib/link";

export const WebPushNotifier = {
	async follow_request(target: Users, follower: Users): Promise<void> {
		const locale = isLocale(target.preferredLocale) ? target.preferredLocale : getLocale()
		notifyUser(target.uuid as UUID, {
			title: m.notif_new_follow_request_title({ username: follower.name }, { locale }),
			body: m.notif_new_follow_request_body({}, { locale }),
			icon: "https://img.icons8.com/color/96/cycling-road--v1.png",
			badge: "https://img.icons8.com/color/96/cycling-road--v1.png",
			data: {
				open: `${env.PUBLIC_URL ?? 'http://localhost'}/manage-access`
			}
		})
	},

	async new_livetrack(target: Users, athlete: Users): Promise<void> {
		const locale = isLocale(target.preferredLocale) ? target.preferredLocale : getLocale()
		notifyUser(target.uuid as UUID, {
			title: m.notif_new_activity_title({ username: athlete.name }, { locale }),
			icon: "https://img.icons8.com/color/96/cycling-road--v1.png",
			badge: "https://img.icons8.com/color/96/cycling-road--v1.png",
			data: {
				open: getAthleteLink(athlete.name).toString()
			}
		})
	}
} satisfies Notifier
