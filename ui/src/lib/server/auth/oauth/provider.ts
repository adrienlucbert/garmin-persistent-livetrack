import type { Cookies } from "@sveltejs/kit";
import type { OAuth2Tokens } from "arctic";
import type { UUID } from "crypto";
import type { URL } from "url";

export type OAuthProvider = {
	createAuthorizationURL: (cookies: Cookies) => URL;
	validateAuthorizationCode: (cookies: Cookies, urlSearchParams: URLSearchParams) => Promise<OAuth2Tokens>;
	findOrCreateUser: (tokens: OAuth2Tokens) => Promise<UUID>;
}
