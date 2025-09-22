import type { Actions, PageServerLoad } from "./$types";
import { createBlankTrackingLink, getTrackingLink } from "$lib/server/link/trackingLink";
import { fail } from "@sveltejs/kit";

export const actions: Actions = {
	create: async (event) => {
		if (!event.locals?.user?.uuid) {
			return fail(400, { message: 'User must be logged in to create a tracking link' })
		}
		try {
			return await createBlankTrackingLink(event.locals.user.uuid)
		} catch (e) {
			return fail(400, { message: 'Link already exists' })
		}
	},
}

export const load: PageServerLoad = async ({ locals }) => {
	try {
		const link = await getTrackingLink(locals.user.uuid)
		return { trackingLink: link }
	} catch (e) {
		return { trackingLink: null }
	}
};
