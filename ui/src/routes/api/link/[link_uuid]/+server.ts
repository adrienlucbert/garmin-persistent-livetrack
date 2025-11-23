import { FeatureFlagsConfig as flags } from '$lib/featureFlags/config';
import { error } from '@sveltejs/kit'
import type { RequestEvent } from './$types'
import { updateTrackingLink } from '$lib/server/link/trackingLink'
import type { UUID } from 'crypto'
import { broadcast } from '$lib/server/sse'
import { m } from '$lib/paraglide/messages.js';
import { listFollowers } from "$lib/server/followers/followers";
import { send } from "$lib/server/email/sender";
import { NewActivity } from "$lib/server/email/templates";
import { getUserByUUID } from "$lib/server/auth/user";
import { getAthleteLink } from "$lib/link";
import { env } from '$env/dynamic/public';
import { env as privEnv } from '$env/dynamic/private';
import { FollowStatus } from "$lib/types/followers";
import { userCanReceiveEmail } from '$lib/server/email/helpers';

export async function PUT({ params, request }: RequestEvent) {
	const auth = request.headers.get("Authorization");
	if (!auth) {
		error(400, { message: m.missing_header({ header: "Authorization" }) })
	}

	if (auth !== `Basic ${btoa(privEnv.SMTP_PROXY_BASIC_AUTH)}`) {
		error(401, { message: m.invalid_header({ header: "Authorization" }) })
	}

	const body = await request.json()
	if (!body.link) {
		error(400, { message: m.missing_field_in_body({ field: "link" }) })
	}

	try {
		const updatedTrackingLink = await updateTrackingLink(params.link_uuid as UUID, body.link)
		try {
			broadcast(`update-link-${params.link_uuid}`, updatedTrackingLink)

			const user = await getUserByUUID(updatedTrackingLink.userUUID as UUID)
			if (!user) {
				throw m.invalid_user_uuid()
			}
			const followers = await listFollowers(updatedTrackingLink.userUUID as UUID)
			const sendJobs: Promise<any>[] = []

			for (const follow of followers) {
				if (follow.status !== FollowStatus.APPROVED || !follow.enabledNotifications || !userCanReceiveEmail(follow.followerUser)) {
					continue
				}

				const sendJob = send(NewActivity(user.name), {
					username: user.name,
					athleteURL: getAthleteLink(user.name).toString(),
					accountURL: `${env.PUBLIC_URL ?? 'http://localhost'}/account`,
				}, follow.followerUser.email, follow.followerUser.preferredLocale)

				sendJobs.push(sendJob)
			}

			await Promise.all(sendJobs)
		} catch (e) { console.error(e) }
	} catch (e) {
		if (e === m.invalid_user_uuid()) {
			error(404)
		} else {
			error(500, { message: String(e) })
		}
	}

	return new Response()
}
