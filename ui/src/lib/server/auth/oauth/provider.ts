import type { Cookies } from "@sveltejs/kit";
import type { OAuth2Tokens } from "arctic";
import type { UUID } from "crypto";
import type { URL } from "url";
import type { OAuthStateWithoutCSRF } from "./state";

export type OAuthTokensWithState = {
	tokens: OAuth2Tokens
	state: OAuthStateWithoutCSRF
}

export type OAuthProvider = {
	createAuthorizationURL: (cookies: Cookies, followURL: string | null) => URL;
	validateAuthorizationCode: (cookies: Cookies, urlSearchParams: URLSearchParams) => Promise<OAuthTokensWithState>;
	findOrCreateUser: (tokens: OAuth2Tokens) => Promise<UUID>;
}
