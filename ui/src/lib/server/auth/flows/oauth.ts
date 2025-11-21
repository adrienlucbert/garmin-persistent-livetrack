import type { URL } from "url"
import type { Cookies, RequestEvent } from "@sveltejs/kit"
import type { UUID } from "crypto"
import { GithubOAuthProvider, GoogleOAuthProvider } from "$lib/server/auth/oauth"
import { createSession } from "$lib/server/auth/session"
import type { OAuthStateWithoutCSRF } from "../oauth/state"
import { m } from '$lib/paraglide/messages.js';
import { setUserPreferredLocale } from "../user"
import { getLocale } from "$lib/paraglide/runtime"
import type { Users } from "$lib/server/db/schema"

export async function initOAuth(provider: string, cookies: Cookies, followURL: string | null): Promise<URL> {
	switch (provider) {
		case 'github': {
			return GithubOAuthProvider.createAuthorizationURL(cookies, followURL)
		}
		case 'google': {
			return GoogleOAuthProvider.createAuthorizationURL(cookies, followURL)
		}
		default: {
			return Promise.reject(m.invalid_oauth_provider({ provider }))
		}
	}
}

export async function resolveOAuth(provider: string, event: RequestEvent): Promise<OAuthStateWithoutCSRF> {
	let user: Users;
	let stateData: OAuthStateWithoutCSRF;

	switch (provider) {
		case 'github': {
			const { tokens, state } = await GithubOAuthProvider.validateAuthorizationCode(event.cookies, event.url.searchParams)
			stateData = state
			user = await GithubOAuthProvider.findOrCreateUser(tokens)
			break
		}
		case 'google': {
			const { tokens, state } = await GoogleOAuthProvider.validateAuthorizationCode(event.cookies, event.url.searchParams)
			stateData = state
			user = await GoogleOAuthProvider.findOrCreateUser(tokens)
			break
		}
		default: {
			return Promise.reject(m.invalid_oauth_provider({ provider }))
		}
	}

	if (user.preferredLocale !== getLocale()) {
		await setUserPreferredLocale(user.uuid as UUID, getLocale())
			.catch(console.error)
	}

	const session = await createSession(user.uuid as UUID)
	session.persist(event)

	return stateData
}
