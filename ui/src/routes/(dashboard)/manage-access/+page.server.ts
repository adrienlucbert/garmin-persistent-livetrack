import { fail } from '@sveltejs/kit';
import type { Actions } from "./$types";
import { m } from '$lib/paraglide/messages.js';
import { createFollowLink } from '$lib/server/followers/followers';
import type { UUID } from 'crypto';

const expiresInMap: Record<string, number | null> = {
	'never': null,
	'30m': 1000 * 60 * 30,
	'1h': 1000 * 60 * 60,
	'6h': 1000 * 60 * 60 * 6,
	'1d': 1000 * 60 * 60 * 24,
	'7d': 1000 * 60 * 60 * 24 * 7,
	'30d': 1000 * 60 * 60 * 24 * 30,
	'3M': 1000 * 60 * 60 * 24 * 30 * 3,
	'1y': 1000 * 60 * 60 * 24 * 365,
}

export const actions: Actions = {
	invitePeople: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { message: m.user_not_logged_in() })
		}

		const formData = await request.formData()
		const uses = formData.get('uses') as 'single' | 'multi' | null

		if (!uses || !['single', 'multi'].includes(uses)) {
			return fail(400, { message: m.missing_field_in_body({ field: 'uses' }) })
		}

		const expiresIn = formData.get('expires_in') as string | null

		if (!expiresIn || !Object.keys(expiresInMap).includes(expiresIn)) {
			return fail(400, { message: m.missing_field_in_body({ field: 'expires_in' }) })
		}

		try {
			const link = await createFollowLink(locals.user.uuid as UUID, uses, expiresInMap[expiresIn])
			return { link }
		} catch (message) {
			return fail(500, { message: String(message) })
		}
	},
}
