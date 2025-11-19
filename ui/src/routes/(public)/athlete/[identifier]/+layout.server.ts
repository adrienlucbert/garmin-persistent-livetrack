import type { LayoutServerLoad } from './$types';
import { getTrackingLink, type TrackingLinkWithUser } from "$lib/server/link/trackingLink";
import { type UUID } from "crypto";
import { getUserUUID } from "$lib/server/auth/user";
import { getFollower } from '$lib/server/followers/followers';
import type { Followers } from '$lib/server/db/schema';

export const load: LayoutServerLoad = async ({ params, locals }) => {
	let link: TrackingLinkWithUser | undefined
	let follow: Followers | undefined

	try {
		let userUUID = await getUserUUID(params.identifier)
		link = await getTrackingLink(userUUID as UUID)

		if (link && locals.user && link.userUUID !== locals.user.uuid) {
			follow = await getFollower(link.userUUID as UUID, locals.user.uuid as UUID)
		}
	} catch { }

	return { trackingLink: link, follow }
};
