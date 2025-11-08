import type { PageServerLoad } from "./$types";
import { getTrackingLink } from "$lib/server/link/trackingLink";
import { error } from "@sveltejs/kit";
import { type UUID } from "crypto";
import { FeatureFlagsConfig as flags } from '$lib/featureFlags/config';
import type { TrackingLinks } from "$lib/server/db/schema";
import { recordVisit } from "$lib/server/visits/visits";
import { getFollower } from "$lib/server/followers/followers";
import { FollowStatus } from "$lib/types/followers";
import { m } from '$lib/paraglide/messages.js';
import { getUserUUID } from "$lib/server/auth/user";

export const load: PageServerLoad = async ({ params, locals, getClientAddress }) => {
	let link: TrackingLinks

	try {
		let userUUID = await getUserUUID(params.identifier)
		link = await getTrackingLink(userUUID as UUID)
	} catch (e) {
		throw error(404, m.tracking_link_does_not_exist())
	}

	if (link.userUUID !== locals.user?.uuid && !link.isPublic) {
		if (!locals.user) {
			throw error(401, m.tracking_link_is_not_public())
		}

		const follower = await getFollower(link.userUUID as UUID, locals.user.uuid as UUID)
		if (follower === undefined) {
			throw error(403, m.tracking_link_is_not_public())
		}
		if (follower.status !== FollowStatus.APPROVED) {
			throw error(403, m.access_request_pending_approval())
		}
	}

	if (flags.ENABLE_VISITS_STATISTICS) {
		if (link.userUUID !== locals.user?.uuid) {
			try {
				await recordVisit(link.userUUID as UUID, locals.user?.uuid as UUID | null, getClientAddress(), new Date())
			} catch (e) { console.error(e) }
		}
	}
	return { trackingLink: link }
};
