export enum FeatureFlagsEnum {
	ENABLE_RECOVER_PASSWORD = "ENABLE_RECOVER_PASSWORD",
	ENABLE_VERIFY_EMAIL = "ENABLE_VERIFY_EMAIL",
}

export type FeatureFlags = { [key in FeatureFlagsEnum]: boolean }
