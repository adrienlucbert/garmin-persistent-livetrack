import { env } from '$env/dynamic/private';
import { parseEnv } from '$lib/server/env';
import { FeatureFlagsEnum, type FeatureFlags } from '.';

export const FeatureFlagsConfig: FeatureFlags = {
	[FeatureFlagsEnum.ENABLE_RECOVER_PASSWORD]: parseEnv<boolean>(env.ENABLE_RECOVER_PASSWORD) ?? true,
}

