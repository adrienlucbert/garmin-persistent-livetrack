import { VAPID_PUBLIC_KEY } from '$env/static/private';
import { FeatureFlagsConfig } from "$lib/featureFlags/config";
import type { PublicUserWithTraits, Sessions } from "$lib/server/db/schema";

export const load = ({ locals }) => {
	return {
		flags: FeatureFlagsConfig,
		appName: locals.appName,
		vapidPublicKey: VAPID_PUBLIC_KEY,
		user: locals.user as PublicUserWithTraits | undefined,
		session: locals.session as Sessions | undefined,
		hideSidebar: !Boolean(locals.session),
	};
};
