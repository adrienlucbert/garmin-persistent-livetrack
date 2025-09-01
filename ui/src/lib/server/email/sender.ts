import { env } from '$env/dynamic/private';
import Emailer from '@uraniadev/emailer';
import nodemailer, { type SentMessageInfo } from 'nodemailer';
import type { Component, ComponentProps } from 'svelte';
import type { EmailTemplate } from './templates';
import { parseEnv } from '$lib/server/env';

const transporter = nodemailer.createTransport(env.SMTP_CONNECTION_URI)

export async function send<T extends Component<ComponentProps<T>, any, any>>(
	template: EmailTemplate<T>,
	args?: ComponentProps<T>,
	to?: string,
): Promise<SentMessageInfo> {
	const emailer = new Emailer()
	const html = emailer.render(template.template, args)
	const from = parseEnv<string>(env.SMTP_FROM) ?? 'sender@example.com'

	return await transporter.sendMail({
		from, html, subject: template.subject, to,
	})
}
