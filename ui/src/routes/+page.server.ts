import { redirect } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const user = requireLogin()
	return { user };
};

function requireLogin() {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return redirect(302, "/auth/signin");
	}

	return locals.user;
}
