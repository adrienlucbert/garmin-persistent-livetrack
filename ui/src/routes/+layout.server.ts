import { FeatureFlagsConfig } from "$lib/featureFlags/config";

export const load = () => {
	return {
		flags: FeatureFlagsConfig,
	};
};
