// See https://svelte.dev/docs/kit/types#app.d.ts

import type { PublicUserWithTraits, Sessions, TrackingLinks } from '$lib/server/db/schema';

// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user?: PublicUserWithTraits
			session?: Sessions
			link?: TrackingLinks
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
