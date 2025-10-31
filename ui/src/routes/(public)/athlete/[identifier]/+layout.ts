export const load = async ({ params }) => {
	return {
		hideFooter: true,
		hideSidebar: true,
		seo: {
			title: params.identifier
		},
	};
};
