import { FeatureFlagsConfig as flags } from '$lib/featureFlags/config';
import type { Users } from "$lib/server/db/schema";

export function userCanReceiveEmail(user: Users): boolean {
	if (!user.email) {
		return false
	}
	if (flags.ENABLE_VERIFY_EMAIL && !user.isEmailVerified) {
		return false
	}
	return true
}
