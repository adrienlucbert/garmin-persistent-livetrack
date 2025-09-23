import type { PageServerLoad } from "./$types";
import { getTrackingLink } from "$lib/server/link/trackingLink";
import { error } from "@sveltejs/kit";
import { type UUID } from "crypto";

export const load: PageServerLoad = async ({ params, locals }) => {
	try {
		if (/^[0-9A-Fa-f]{8}(-[0-9A-Fa-f]{4}){3}-[0-9A-Fa-f]{12}$/.test(params.identifier)) {
			const link = await getTrackingLink(params.identifier as UUID)
			return { trackingLink: link }
		}
		return error(400, 'Athlete identifier is not a valid UUID.')
	} catch (e) {
		return { trackingLink: null }
	}
};
