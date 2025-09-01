import type { Component, ComponentProps } from "svelte";
import { env } from "$env/dynamic/private";

export type EmailTemplate<T extends Component<ComponentProps<T>, any, any>> = { subject: string, template: T }

import { default as RecoverPasswordTemplate } from "./recoverPassword.svelte";
export const RecoverPassword: (() => EmailTemplate<typeof RecoverPasswordTemplate>) = () => ({ subject: `[${env.APP_NAME ?? 'App'}] Please reset your password`, template: RecoverPasswordTemplate })
