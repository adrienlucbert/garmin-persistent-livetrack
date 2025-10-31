import { currentPage } from '$lib/pages.svelte';

export const load = async ({ url }) => {
	return {
		hideFooter: false,
		seo: {
			title: currentPage(url)?.title
		},
	};
};
