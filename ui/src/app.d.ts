// See https://svelte.dev/docs/kit/types#app.d.ts

import type { PublicUserWithTraits, Sessions } from '$lib/server/db/schema';
import type { TrackingLinkWithUser } from '$lib/server/link/trackingLink';

// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			appName: string
			user?: PublicUserWithTraits
			session?: Sessions
		}
		interface PageData {
			hideFooter?: boolean
			hideSidebar?: boolean
			seo?: {
				title?: string
				description?: string
			}
		}
	} // interface Error {}
	// interface Locals {}
} // interface PageData {}
// interface PageState {}

// interface Platform {}
export { };
