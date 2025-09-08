import { decodeIdToken, generateCodeVerifier, generateState, Google, OAuth2Tokens } from "arctic";
import { env as privEnv } from '$env/dynamic/private'
import { env as pubEnv } from '$env/dynamic/public'
import { type OAuthProvider } from "$lib/server/auth/oauth/provider";
import type { Cookies } from "@sveltejs/kit";
import type { URL } from "url";
import { type UUID } from "crypto";
import { AuthMethod, createUser, getUser } from "$lib/server/auth/user";

export const google = new Google(
	privEnv.GOOGLE_CLIENT_ID,
	privEnv.GOOGLE_CLIENT_SECRET,
	`${pubEnv.PUBLIC_URL}/auth/oauth/google/callback`
);

export const GoogleOAuthProvider: OAuthProvider = {
	createAuthorizationURL(cookies: Cookies): URL {
		const state = generateState();
		const codeVerifier = generateCodeVerifier();
		const url = google.createAuthorizationURL(state, codeVerifier, ["openid", "profile"]);

		cookies.set("google_oauth_state", state, {
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

	async validateAuthorizationCode(cookies: Cookies, urlSearchParams: URLSearchParams): Promise<OAuth2Tokens> {
		const code = urlSearchParams.get("code");
		const state = urlSearchParams.get("state");
		if (code === null || state === null) {
			return Promise.reject('Missing state cookies');
		}
		const storedState = cookies.get("google_oauth_state") ?? null;
		const codeVerifier = cookies.get("google_code_verifier") ?? null;
		if (storedState === null || codeVerifier === null) {
			return Promise.reject('Missing callback URL parameters');
		}
		if (state !== storedState) {
			return Promise.reject('OAuth state is invalid or has expired')
		}

		try {
			return await google.validateAuthorizationCode(code, codeVerifier);
		} catch (e) {
			return Promise.reject(String(e))
		}
	},

	async findOrCreateUser(tokens: OAuth2Tokens): Promise<UUID> {
		const claims = decodeIdToken(tokens.idToken()) as { sub: string, name: string };
		const { sub: googleUserId, name: username } = claims;

		const existingUser = await getUser(AuthMethod.Google, googleUserId);
		if (existingUser) {
			return existingUser.uuid as UUID;
		}

		return await createUser(AuthMethod.Google, googleUserId, username);
	}
}
