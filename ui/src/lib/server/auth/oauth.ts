import { GitHub, Google } from "arctic";
import { env as privEnv } from '$env/dynamic/private'
import { env as pubEnv } from '$env/dynamic/public'

export const github = new GitHub(privEnv.GITHUB_CLIENT_ID, privEnv.GITHUB_CLIENT_SECRET, null)

export const google = new Google(
	privEnv.GOOGLE_CLIENT_ID,
	privEnv.GOOGLE_CLIENT_SECRET,
	`${pubEnv.PUBLIC_URL}/auth/signin/google/callback`
);
