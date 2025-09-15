import { generateState, GitHub, OAuth2Tokens } from "arctic";
import { env } from '$env/dynamic/private'
import { type OAuthProvider } from "$lib/server/auth/oauth/provider";
import type { URL } from "url";
import type { Cookies } from "@sveltejs/kit";
import { type UUID } from "crypto";
import { AuthMethod, createUser, getUser } from "$lib/server/auth/user";

export const github = new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET, null)

export const GithubOAuthProvider: OAuthProvider = {
	createAuthorizationURL(cookies: Cookies): URL {
		const state = generateState();
		const url = github.createAuthorizationURL(state, []);

		cookies.set("github_oauth_state", state, {
			path: "/",
			httpOnly: true,
			maxAge: 60 * 10,
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
		const storedState = cookies.get("github_oauth_state") ?? null;
		if (storedState === null) {
			return Promise.reject('Missing callback URL parameters');
		}
		if (state !== storedState) {
			return Promise.reject('OAuth state is invalid or has expired')
		}

		try {
			return await github.validateAuthorizationCode(code);
		} catch (e) {
			return Promise.reject(String(e))
		}
	},

	async findOrCreateUser(tokens: OAuth2Tokens): Promise<UUID> {
		const githubUserResponse = await fetch("https://api.github.com/user", {
			headers: {
				Authorization: `Bearer ${tokens.accessToken()}`
			}
		});
		const githubUser = await githubUserResponse.json();
		const githubUserId = githubUser.id;
		const githubUsername = githubUser.login;

		const existingUser = await getUser(AuthMethod.Github, githubUserId);

		if (existingUser) {
			return existingUser.uuid as UUID;
		}

		return await createUser(AuthMethod.Github, githubUserId, githubUsername);
	}
}
