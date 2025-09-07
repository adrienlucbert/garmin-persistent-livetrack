import type { URL } from "url"
import type { Cookies, RequestEvent } from "@sveltejs/kit"
import type { UUID } from "crypto"
import { GithubOAuthProvider, GoogleOAuthProvider } from "$lib/server/auth/oauth"
import { createSession } from "$lib/server/auth/session"

export async function initOAuth(provider: string, cookies: Cookies): Promise<URL> {
	switch (provider) {
		case 'github': {
			return GithubOAuthProvider.createAuthorizationURL(cookies)
		}
		case 'google': {
			return GoogleOAuthProvider.createAuthorizationURL(cookies)
		}
		default: {
			return Promise.reject(`Invalid OAuth provider: ${provider}`)
		}
	}
}

export async function resolveOAuth(provider: string, event: RequestEvent): Promise<void> {
	let userUUID: UUID;

	switch (provider) {
		case 'github': {
			const tokens = await GithubOAuthProvider.validateAuthorizationCode(event.cookies, event.url.searchParams)
			userUUID = await GithubOAuthProvider.findOrCreateUser(tokens)
			break
		}
		case 'google': {
			const tokens = await GoogleOAuthProvider.validateAuthorizationCode(event.cookies, event.url.searchParams)
			userUUID = await GoogleOAuthProvider.findOrCreateUser(tokens)
			break
		}
		default: {
			return Promise.reject(`Invalid OAuth provider: ${provider}`)
		}
	}

	const session = await createSession({ uuid: userUUID })
	session.persist(event)
}
