import { type TimeInterval } from 'd3-time';
import { scaleUtc } from 'd3-scale';

export function formatDuration(ms: number): string {
	if (ms < 0) ms = -ms;
	const time = {
		day: Math.floor(ms / 86400000),
		hour: Math.floor(ms / 3600000) % 24,
		minute: Math.floor(ms / 60000) % 60,
		second: Math.floor(ms / 1000) % 60,
		millisecond: Math.floor(ms) % 1000
	};
	return Object.entries(time)
		.filter(val => val[1] !== 0)
		.map(([key, val]) => `${val} ${key}${val !== 1 ? 's' : ''}`)
		.join(', ');
};

function toUTCDate(date: Date): Date {
	return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

export function resampleToTimeInterval<T extends Record<K, Date>, K extends keyof T>(
	series: T[],
	timeKey: K,
	interval: TimeInterval,
	defaultValue: Omit<T, K>,
	merger: (a: Omit<T, K>, b: Omit<T, K>) => Omit<T, K> = (a, b) => ({ ...a, ...b })
): T[] {
	const valueMap = new Map<number, Omit<T, K>>();
	for (let { [timeKey]: d, ...value } of series) {
		const key = interval.floor(toUTCDate(d)).getTime()
		const agg = valueMap.get(key);
		if (agg) {
			valueMap.set(key, merger(agg, value));
		} else {
			valueMap.set(key, value);
		}
	}

	const ticks = scaleUtc()
		.domain([...series.map((v: T) => interval.floor(toUTCDate(v[timeKey]))), interval.floor(toUTCDate(new Date()))])
		.ticks(interval);

	return ticks.map((date: Date) => {
		return {
			[timeKey]: date,
			...(valueMap.get(interval.floor(date).getTime()) ?? defaultValue)
		} as T;
	});
}

