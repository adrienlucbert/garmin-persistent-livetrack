import type { GithubTraits } from "./github";
import type { GoogleTraits } from "./google";
import type { PasswordTraits } from "./password";

export * from "./password";
export * from "./github";
export * from "./google";

export type Traits = PasswordTraits | GithubTraits | GoogleTraits
