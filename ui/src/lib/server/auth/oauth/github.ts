import { GitHub, OAuth2Tokens } from "arctic";
import { env } from '$env/dynamic/private'
import type { OAuthProvider, OAuthTokensWithState } from "$lib/server/auth/oauth/provider";
import type { URL } from "url";
import type { Cookies } from "@sveltejs/kit";
import { AuthMethod, createUser, getUser } from "$lib/server/auth/user";
import { generateCustomState, validateState } from "./state";
import { m } from '$lib/paraglide/messages.js';
import type { Users } from "$lib/server/db/schema"

export const github = new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET, null)

export const GithubOAuthProvider: OAuthProvider = {
	createAuthorizationURL(cookies: Cookies, followURL: string | null): URL {
		const { state, csrf } = generateCustomState(followURL);
		const url = github.createAuthorizationURL(state, ['user:email']);

		cookies.set("github_oauth_csrf", csrf, {
			path: "/",
			httpOnly: true,
			maxAge: 60 * 10,
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
		const stateData = await validateState(state, cookies.get("github_oauth_csrf") ?? null)

		try {
			const tokens = await github.validateAuthorizationCode(code);
			return {
				tokens,
				state: stateData,
			}
		} catch (e) {
			return Promise.reject(String(e))
		}
	},

	async findOrCreateUser(tokens: OAuth2Tokens): Promise<Users> {
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
			return existingUser;
		}

		const githubUserEmailsResponse = await fetch("https://api.github.com/user/emails", {
			headers: {
				Authorization: `Bearer ${tokens.accessToken()}`
			}
		});
		const githubUserEmails = await githubUserEmailsResponse.json() as { primary: boolean, email: string, verified: boolean }[];
		const primaryEmail = githubUserEmails.find(e => e.primary)

		return await createUser(AuthMethod.Github, primaryEmail?.email, primaryEmail?.verified, githubUserId, githubUsername);
	}
}
