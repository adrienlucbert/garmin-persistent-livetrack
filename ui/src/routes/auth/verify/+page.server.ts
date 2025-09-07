import { redirect } from '@sveltejs/kit';
import { verifyEmail } from '$lib/server/auth/flows';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const token = event.url.searchParams.get('token') as string
	if (!token) {
		return redirect(302, "/auth/signin");
	}
	try {
		await verifyEmail(token)
	} catch (message) {
		return { success: false, message: String(message) }
	}
	return { success: true }
};
