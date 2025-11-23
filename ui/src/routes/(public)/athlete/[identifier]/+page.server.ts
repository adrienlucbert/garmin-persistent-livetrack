import type { LayoutServerLoad } from './$types';
import { error } from "@sveltejs/kit";
import { type UUID } from "crypto";
import { FeatureFlagsConfig as flags } from '$lib/featureFlags/config';
import { recordVisit } from "$lib/server/visits/visits";
import { FollowStatus } from "$lib/types/followers";
import { m } from '$lib/paraglide/messages.js';
import type { PublicTrackingLinkWithUser } from '$lib/server/link/trackingLink';
import type { Followers } from '$lib/server/db/schema';

export const load: LayoutServerLoad = async ({ locals, parent, getClientAddress }) => {
	const { trackingLink, follow } = await parent() as Awaited<ReturnType<typeof parent>> & {
		trackingLink: PublicTrackingLinkWithUser | undefined;
		follow: Followers | undefined
	};

	if (!trackingLink) {
		throw error(404, m.tracking_link_does_not_exist())
	}

	if (trackingLink.userUUID !== locals.user?.uuid && !trackingLink.isPublic) {
		if (!locals.user) {
			throw error(401, m.tracking_link_is_not_public())
		}

		if (follow === undefined) {
			throw error(403, m.tracking_link_is_not_public())
		}

		if (follow.status !== FollowStatus.APPROVED) {
			throw error(403, m.access_request_pending_approval())
		}
	}

	if (flags.ENABLE_VISITS_STATISTICS) {
		if (trackingLink.userUUID !== locals.user?.uuid) {
			try {
				await recordVisit(trackingLink.userUUID as UUID, locals.user?.uuid as UUID | null, getClientAddress(), new Date())
			} catch (e) { console.error(e) }
		}
	}

	return { trackingLink, follow }
};
