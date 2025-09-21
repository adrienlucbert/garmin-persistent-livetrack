import { FeatureFlagsConfig } from "$lib/featureFlags/config";
import type { PublicUserWithTraits, Sessions } from "$lib/server/db/schema";

export const load = ({ locals }) => {
	return {
		flags: FeatureFlagsConfig,
		user: locals.user as PublicUserWithTraits | undefined,
		session: locals.session as Sessions | undefined,
		hideSidebar: !Boolean(locals.session),
	};
};
