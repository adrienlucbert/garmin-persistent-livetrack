import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { m } from '$lib/paraglide/messages.js';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';

export const PUT: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) {
		error(401, m.user_not_logged_in());
	}

	const body = await request.json()
	const notification = body.notification ?? error(400, { message: m.missing_field_in_body({ field: 'notification' }) })
	const channel = body.channel ?? error(400, { message: m.missing_field_in_body({ field: 'channel' }) })
	const enabled = body.enabled ?? error(400, { message: m.missing_field_in_body({ field: 'enabled' }) })

	try {
		await db()
			.update(users)
			.set({
				notificationPreferences: sql`jsonb_set(
				${users.notificationPreferences}, 
				${sql.raw(`'{${notification},${channel}}'`)}, 
				${sql.raw(`'${String(enabled)}'`)},
				true
			)`
			})
			.where(eq(users.uuid, locals.user.uuid))
	} catch (message) {
		throw error(500, { message: String(message) })
	}

	return json({ success: true })
};
