import { currentPage } from '$lib/pages.svelte';

export const load = async ({ url }) => {
	return {
		seo: {
			title: currentPage(url)?.title
		},
	};
};
