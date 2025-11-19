import type { TrackingLinkWithUser } from '$lib/server/link/trackingLink.js';

function pickPublicTrackingLink(trackingLink: TrackingLinkWithUser | undefined): Omit<TrackingLinkWithUser, 'link'> | undefined {
	if (trackingLink === undefined) {
		return undefined
	}
	const { link, ...rest } = trackingLink
	return rest
}

export const load = async ({ data, params }) => {
	const { trackingLink, follow, ...restData } = data

	return {
		...restData,
		trackingLink: pickPublicTrackingLink(trackingLink),
		follow,
		hideFooter: true,
		hideSidebar: true,
		seo: {
			title: params.identifier
		},
	};
};
