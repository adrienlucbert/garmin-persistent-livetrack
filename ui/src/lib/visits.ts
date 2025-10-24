import type { Visits } from '$lib/server/db/schema';

export type TotalVisits = { date: Date; count: number }

export function transformTotalVisits(visits: Visits[]): TotalVisits[] {
	const counts = new Map<number, number>();

	for (const visit of visits) {
		const date = new Date(new Date(visit.timestamp).toDateString()).getTime();
		counts.set(date, (counts.get(date) || 0) + 1);
	}

	return Array.from(counts.entries()).map(([date, count]) => {
		return { date: new Date(date), count };
	});
}

type PerUserVisits = { date: Date } & { [user: string]: number | Date };

export function transformPerUserVisits(visits: Visits[]): PerUserVisits[] {
	const dailyCounts = new Map<number, { [user: string]: number }>();

	for (const visit of visits) {
		const user = visit.visitorUserUUID || 'Visitor';
		const date = new Date(new Date(visit.timestamp).toDateString()).getTime();
		const dateCounts = dailyCounts.get(date) || {};
		dateCounts[user] = (dateCounts[user] || 0) + 1;
		dailyCounts.set(date, dateCounts);
	}

	return Array.from(dailyCounts.entries()).map(([date, counts]) => {
		return { date: new Date(date), ...counts };
	});
}

export function listUniqueUsers(visits: Visits[]): string[] {
	let users = new Set<string>();
	for (const visit of visits) {
		users.add(visit.visitorUserUUID || 'Visitor');
	}
	return [...users];
}

