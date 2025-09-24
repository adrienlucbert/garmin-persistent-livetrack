import type { PageServerLoad } from "./$types";
import { getTrackingLink } from "$lib/server/link/trackingLink";

export const load: PageServerLoad = async ({ locals }) => {
	try {
		const link = await getTrackingLink(locals.user.uuid)
		return { trackingLink: link }
	} catch (e) {
		return { trackingLink: null }
	}
};
