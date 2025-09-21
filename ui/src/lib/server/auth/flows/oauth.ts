import type { URL } from "url"
import type { Cookies, RequestEvent } from "@sveltejs/kit"
import type { UUID } from "crypto"
import { GithubOAuthProvider, GoogleOAuthProvider } from "$lib/server/auth/oauth"
import { createSession } from "$lib/server/auth/session"
import type { OAuthStateWithoutCSRF } from "../oauth/state"

export async function initOAuth(provider: string, cookies: Cookies, followURL: string | null): Promise<URL> {
	switch (provider) {
		case 'github': {
			return GithubOAuthProvider.createAuthorizationURL(cookies, followURL)
		}
		case 'google': {
			return GoogleOAuthProvider.createAuthorizationURL(cookies, followURL)
		}
		default: {
			return Promise.reject(`Invalid OAuth provider: ${provider}`)
		}
	}
}

export async function resolveOAuth(provider: string, event: RequestEvent): Promise<OAuthStateWithoutCSRF> {
	let userUUID: UUID;
	let stateData: OAuthStateWithoutCSRF;

	switch (provider) {
		case 'github': {
			const { tokens, state } = await GithubOAuthProvider.validateAuthorizationCode(event.cookies, event.url.searchParams)
			stateData = state
			userUUID = await GithubOAuthProvider.findOrCreateUser(tokens)
			break
		}
		case 'google': {
			const { tokens, state } = await GoogleOAuthProvider.validateAuthorizationCode(event.cookies, event.url.searchParams)
			stateData = state
			userUUID = await GoogleOAuthProvider.findOrCreateUser(tokens)
			break
		}
		default: {
			return Promise.reject(`Invalid OAuth provider: ${provider}`)
		}
	}

	const session = await createSession({ uuid: userUUID })
	session.persist(event)

	return stateData
}
