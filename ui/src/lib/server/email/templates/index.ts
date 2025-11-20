import type { Component, ComponentProps } from "svelte";
import { m } from '$lib/paraglide/messages.js';

export type EmailTemplate<T extends Component<ComponentProps<T>, any, any>> = { subject: string, template: T }

import { default as RecoverPasswordTemplate } from "./recoverPassword.svelte";
export const RecoverPassword: (() => EmailTemplate<typeof RecoverPasswordTemplate>) = () => ({ subject: `${m.mail_reset_password_subject()}`, template: RecoverPasswordTemplate })

import { default as AskVerifyEmailTemplate } from "./askVerifyEmail.svelte";
export const AskVerifyEmail: (() => EmailTemplate<typeof AskVerifyEmailTemplate>) = () => ({ subject: `${m.mail_verify_email_subject()}`, template: AskVerifyEmailTemplate })

import { default as NewFollowRequestTemplate } from "./newFollowRequest.svelte";
export const NewFollowRequest: ((username: string) => EmailTemplate<typeof NewFollowRequestTemplate>) = (username: string) => ({ subject: `${m.mail_new_follow_request_subject({ username })}`, template: NewFollowRequestTemplate })

import { default as NewActivityTemplate } from "./newActivity.svelte";
export const NewActivity: ((username: string) => EmailTemplate<typeof NewActivityTemplate>) = (username: string) => ({ subject: `${m.mail_new_activity_subject({ username })}`, template: NewActivityTemplate })
