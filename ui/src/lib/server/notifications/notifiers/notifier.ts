import type { Users } from "$lib/server/db/schema";
import { Notification } from "$lib/types/notifications";

type Satisfies<Constraint, Target extends Constraint> = Target;

export type Notifier = Satisfies<{
	[K in Notification]: (target: Users, ...args: any[]) => Promise<void>;
}, {
	follow_request: (target: Users, follower: Users) => Promise<void>
	new_livetrack: (target: Users, athlete: Users) => Promise<void>
}>
