export enum FeatureFlagsEnum {
	ENABLE_RECOVER_PASSWORD = "ENABLE_RECOVER_PASSWORD",
}

export type FeatureFlags = { [key in FeatureFlagsEnum]: boolean }
