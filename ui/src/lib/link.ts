import { env } from '$env/dynamic/public';
import type { UUID } from 'crypto';

export function getAthleteLink(userUUID: UUID): URL {
	return new URL(`${env.PUBLIC_URL}/athlete/${userUUID}`)
}
