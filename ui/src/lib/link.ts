import { env } from '$env/dynamic/public';

export function getAthleteLink(username: string): URL {
	return new URL(`${env.PUBLIC_URL}/athlete/${username}`)
}
