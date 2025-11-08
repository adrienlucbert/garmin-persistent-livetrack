import { db } from '$lib/server/db';
import { users, visits, type Visits } from '$lib/server/db/schema';
import { type UUID } from 'crypto';
import { and, eq, getTableColumns, gt } from 'drizzle-orm';

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

export type VisitsWithName = Visits & { visitorUserName: string | null };

export async function listVisits(linkUserUUID: UUID, since?: Date): Promise<VisitsWithName[]> {
	const filters = [eq(visits.linkUserUUID, linkUserUUID)]
	if (since) {
		filters.push(gt(visits.timestamp, since))
	}
	return await db()
		.select({
			...getTableColumns(visits),
			visitorUserName: users.name,
		})
		.from(visits)
		.leftJoin(users, eq(visits.visitorUserUUID, users.uuid))
		.where(and(...filters))
}
