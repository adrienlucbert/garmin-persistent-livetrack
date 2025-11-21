import { decodeIdToken, generateCodeVerifier, Google, OAuth2Tokens } from "arctic";
import { env as privEnv } from '$env/dynamic/private'
import { env as pubEnv } from '$env/dynamic/public'
import type { OAuthProvider, OAuthTokensWithState } from "$lib/server/auth/oauth/provider";
import type { Cookies } from "@sveltejs/kit";
import type { URL } from "url";
import { type UUID } from "crypto";
import { AuthMethod, createUser, getUser } from "$lib/server/auth/user";
import { generateCustomState, validateState } from "./state";
import { m } from '$lib/paraglide/messages.js';
import type { Users } from "$lib/server/db/schema"

export const google = new Google(
	privEnv.GOOGLE_CLIENT_ID,
	privEnv.GOOGLE_CLIENT_SECRET,
	`${pubEnv.PUBLIC_URL}/auth/oauth/google/callback`
);

export const GoogleOAuthProvider: OAuthProvider = {
	createAuthorizationURL(cookies: Cookies, followURL: string | null): URL {
		const { state, csrf } = generateCustomState(followURL);
		const codeVerifier = generateCodeVerifier();
		const url = google.createAuthorizationURL(state, codeVerifier, ["openid", "profile", "email"]);

		cookies.set("google_oauth_csrf", csrf, {
			path: "/",
			httpOnly: true,
			maxAge: 60 * 10, // 10 minutes
			sameSite: "lax"
		});
		cookies.set("google_code_verifier", codeVerifier, {
			path: "/",
			httpOnly: true,
			maxAge: 60 * 10, // 10 minutes
			sameSite: "lax"
		});
		return url;
	},

	async validateAuthorizationCode(cookies: Cookies, urlSearchParams: URLSearchParams): Promise<OAuthTokensWithState> {
		const code = urlSearchParams.get("code");
		const state = urlSearchParams.get("state");
		if (code === null) {
			return Promise.reject(m.missing_cookie({ name: 'code' }));
		}
		if (state === null) {
			return Promise.reject(m.missing_cookie({ name: 'state' }));
		}
		const stateData = await validateState(state, cookies.get("google_oauth_csrf") ?? null)

		const codeVerifier = cookies.get("google_code_verifier") ?? null;
		if (codeVerifier === null) {
			return Promise.reject(m.missing_cookie({ name: 'google_code_verifier' }));
		}

		try {
			const tokens = await google.validateAuthorizationCode(code, codeVerifier);
			return {
				tokens,
				state: stateData,
			}
		} catch (e) {
			return Promise.reject(String(e))
		}
	},

	async findOrCreateUser(tokens: OAuth2Tokens): Promise<Users> {
		const claims = decodeIdToken(tokens.idToken()) as { sub: string, name: string, email: string, email_verified: boolean };
		const { sub: googleUserId, name: username, email, email_verified } = claims;

		const existingUser = await getUser(AuthMethod.Google, googleUserId);
		if (existingUser) {
			return existingUser;
		}

		return await createUser(AuthMethod.Google, email, email_verified, googleUserId, username);
	}
}
