<script lang="ts">
	import { env as pubEnv } from '$env/dynamic/public';
	import { env as privEnv } from '$env/dynamic/private';
	import { Button, Container, Heading, Paragraph } from '@uraniadev/emailer';
	import { m } from '$lib/paraglide/messages.js';

	interface Props {
		email: string;
		callbackURL: string;
	}
	const { email, callbackURL }: Props = $props();
</script>

<Container>
	<Heading class="text-center">{m.mail_verify_email_title()}</Heading>
	<Container class="rounded-md border-2 border-solid border-gray-200 p-4">
		<Paragraph>
			{m.mail_verify_email_p1()}
			<a href={`mailto:${email}`}>{email}</a>
		</Paragraph>

		<Button
			class="m-auto my-4 max-w-max rounded-lg bg-neutral-800 px-6 py-4 !text-white"
			href={callbackURL}
		>
			{m.mail_verify_email_button()}
		</Button>
		<Paragraph class="mt-8 text-center text-sm">
			{m.mail_verify_email_p2({ appName: privEnv.APP_NAME })}
		</Paragraph>
	</Container>
	<Container class="mx-auto max-w-lg">
		<Paragraph class="mt-8 text-center text-sm">
			{m.mail_verify_email_p3()} <a href={pubEnv.PUBLIC_URL}>{privEnv.APP_NAME}</a>.
			{m.mail_verify_email_p4()}
		</Paragraph>
		<Paragraph class="text-center text-sm">
			{m.mail_trouble_clicking_button({ button: m.mail_verify_email_button() })}
			<a style="overflow-wrap: break-word; word-wrap: break-word;" href={callbackURL}>
				{callbackURL}
			</a>
		</Paragraph>
	</Container>
</Container>
