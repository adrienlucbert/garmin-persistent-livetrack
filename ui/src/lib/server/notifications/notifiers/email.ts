import { env } from '$env/dynamic/public';
import { APP_NAME } from "$env/static/private";
import { getAthleteLink } from '$lib/link';
import type { Users } from "$lib/server/db/schema";
import { send } from "$lib/server/email/sender";
import { NewActivity, NewFollowRequest } from "$lib/server/email/templates";
import type { Notifier } from "./notifier";

export const EmailNotifier = {
	async follow_request(target: Users, follower: Users): Promise<void> {
		if (!target.email) {
			return
		}

		await send(NewFollowRequest(follower.name), {
			username: follower.name,
			approveURL: `${env.PUBLIC_URL ?? 'http://localhost'}/api/followers/${follower.uuid}/approve`,
			denyURL: `${env.PUBLIC_URL ?? 'http://localhost'}/api/followers/${follower.uuid}/ban`,
			manageAccessURL: `${env.PUBLIC_URL ?? 'http://localhost'}/manage-access`,
			appName: APP_NAME
		}, target.email, target.preferredLocale)
	},

	async new_livetrack(target: Users, athlete: Users): Promise<void> {
		if (!target.email) {
			return
		}

		await send(NewActivity(athlete.name), {
			username: athlete.name,
			athleteURL: getAthleteLink(athlete.name).toString(),
			accountURL: `${env.PUBLIC_URL ?? 'http://localhost'}/account`,
		}, target.email, target.preferredLocale)
	}
} satisfies Notifier
