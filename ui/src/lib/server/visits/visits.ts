import { db } from '$lib/server/db';
import { visits, type Visits } from '$lib/server/db/schema';
import { type UUID } from 'crypto';
import { and, count, eq, gt, max } from 'drizzle-orm';

export async function recordVisit(linkUserUUID: UUID, visitorUserUUID: UUID | null, ip: string, timestamp: Date): Promise<void> {
	await db()
		.insert(visits)
		.values({
			linkUserUUID,
			visitorUserUUID,
			ip,
			timestamp,
		})
}

export type VisitStats = {
	linkUserUUID: string;
	visitorUserUUID: string | null;
	ip: string | null;
	lastSeen: Date | null;
	visits: number;
}

export async function listVisitStats(linkUserUUID: UUID): Promise<VisitStats[]> {
	return await db()
		.select({
			linkUserUUID: visits.linkUserUUID,
			visitorUserUUID: visits.visitorUserUUID,
			ip: visits.ip,
			lastSeen: max(visits.timestamp),
			visits: count(),
		})
		.from(visits)
		.where(eq(visits.linkUserUUID, linkUserUUID))
		.groupBy(visits.linkUserUUID, visits.visitorUserUUID, visits.ip);
}

export async function listVisits(linkUserUUID: UUID, since?: Date): Promise<Visits[]> {
	const filters = [eq(visits.linkUserUUID, linkUserUUID)]
	if (since) {
		filters.push(gt(visits.timestamp, since))
	}
	return await db()
		.select()
		.from(visits)
		.where(and(...filters))
}
