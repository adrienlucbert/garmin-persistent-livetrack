import { env } from '$env/dynamic/private'
import { FeatureFlagsConfig } from "$lib/featureFlags/config";
import type { PublicUserWithTraits, Sessions, TrackingLinks } from "$lib/server/db/schema";

export const load = ({ locals }) => {
	return {
		flags: FeatureFlagsConfig,
		appName: locals.appName,
		user: locals.user as PublicUserWithTraits | undefined,
		session: locals.session as Sessions | undefined,
		link: locals.link as TrackingLinks | undefined,
		hideSidebar: !Boolean(locals.session),
	};
};
