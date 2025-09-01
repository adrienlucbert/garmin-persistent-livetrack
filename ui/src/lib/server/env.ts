export function parseEnv<T extends boolean | null | number | string | undefined>(
	value?: boolean | null | number | string | undefined
): T {
	if (value == null || value === "null") return null as T;

	const strValue = `${value}`.toLowerCase();

	switch (true) {
		case /^\d+$/.test(strValue):
			return parseInt(strValue, 10) as T;

		case /^(1|true|yes)$/i.test(strValue):
			return true as T;

		case /^(0|false|no|\s)$/i.test(strValue):
			return false as T;

		default:
			return value as T;
	}
};
