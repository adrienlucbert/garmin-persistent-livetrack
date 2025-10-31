import { generateState } from 'arctic'
import { m } from '$lib/paraglide/messages.js';

export type OAuthStateData = {
	csrf: string;
	followURL: string | null
}
export type OAuthStateWithoutCSRF = Omit<OAuthStateData, 'csrf'>

export function generateCustomState(followURL: string | null): { state: string; csrf: string } {
	const csrf = generateState()
	const stateData: OAuthStateData = {
		csrf,
		followURL,
	}
	const state = Buffer
		.from(JSON.stringify(stateData))
		.toString('base64');
	return { state, csrf }
}

export async function validateState(state: string, csrf_cookie: string | null): Promise<OAuthStateWithoutCSRF> {
	if (csrf_cookie === null) {
		return Promise.reject(m.missing_cookie({ name: 'CSRF' }));
	}

	const { csrf, ...data }: OAuthStateData = JSON.parse(
		Buffer
			.from(state, 'base64')
			.toString('utf-8')
	);

	if (csrf !== csrf_cookie) {
		return Promise.reject(m.oauth_state_invalid_or_expired())
	}

	return data;
}
