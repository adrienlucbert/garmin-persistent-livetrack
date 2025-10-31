import type { Component, ComponentProps } from "svelte";
import { env } from "$env/dynamic/private";
import { m } from '$lib/paraglide/messages.js';

export type EmailTemplate<T extends Component<ComponentProps<T>, any, any>> = { subject: string, template: T }

import { default as RecoverPasswordTemplate } from "./recoverPassword.svelte";
export const RecoverPassword: (() => EmailTemplate<typeof RecoverPasswordTemplate>) = () => ({ subject: `[${env.APP_NAME ?? 'App'}] ${m.mail_reset_password_subject()}`, template: RecoverPasswordTemplate })

import { default as AskVerifyEmailTemplate } from "./askVerifyEmail.svelte";
export const AskVerifyEmail: (() => EmailTemplate<typeof AskVerifyEmailTemplate>) = () => ({ subject: `[${env.APP_NAME ?? 'App'}] ${m.mail_verify_email_subject()}`, template: AskVerifyEmailTemplate })
