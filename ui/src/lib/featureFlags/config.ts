import { env } from '$env/dynamic/private';
import { parseEnv } from '$lib/server/env';
import { FeatureFlagsEnum, type FeatureFlags } from '.';

export const FeatureFlagsConfig: FeatureFlags = {
	[FeatureFlagsEnum.ENABLE_RECOVER_PASSWORD]: parseEnv<boolean>(env.ENABLE_RECOVER_PASSWORD) ?? true,
	[FeatureFlagsEnum.ENABLE_VERIFY_EMAIL]: parseEnv<boolean>(env.ENABLE_VERIFY_EMAIL) ?? true,
	[FeatureFlagsEnum.ENABLE_OAUTH_GITHUB]: parseEnv<boolean>(env.ENABLE_OAUTH_GITHUB) ?? false,
	[FeatureFlagsEnum.ENABLE_OAUTH_GOOGLE]: parseEnv<boolean>(env.ENABLE_OAUTH_GOOGLE) ?? false,
	[FeatureFlagsEnum.ENABLE_VISITS_STATISTICS]: parseEnv<boolean>(env.ENABLE_VISITS_STATISTICS) ?? true,
}
