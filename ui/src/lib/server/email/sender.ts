import { env } from '$env/dynamic/private';
import Emailer from '@uraniadev/emailer';
import nodemailer, { type SentMessageInfo } from 'nodemailer';
import type { Component, ComponentProps } from 'svelte';
import type { EmailTemplate } from './templates';
import { parseEnv } from '$lib/server/env';
import { getLocale, isLocale, type Locale } from '$lib/paraglide/runtime';

let _transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function transporter() {
	if (_transporter) return _transporter

	_transporter = nodemailer.createTransport(env.SMTP_CONNECTION_URI)
	return _transporter
}

export async function send<T extends Component<{ locale?: Locale } & ComponentProps<T>, any, any>>(
	template: EmailTemplate<T>,
	args?: Omit<ComponentProps<T>, 'locale'>,
	to?: string,
	locale?: Locale | string | null,
): Promise<SentMessageInfo> {
	const resolvedLocale = isLocale(locale) ? locale : getLocale()
	const emailer = new Emailer()
	const html = emailer.render(template.template, { locale: resolvedLocale, ...args } as ComponentProps<T>)
	const from = parseEnv<string>(env.SMTP_FROM) ?? 'sender@example.com'

	return await transporter().sendMail({
		from, html, subject: template.subject(resolvedLocale), to,
	})
}
