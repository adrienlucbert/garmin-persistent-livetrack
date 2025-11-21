<script lang="ts">
	import { Button, Container, Heading, Paragraph } from '@uraniadev/emailer';
	import { m } from '$lib/paraglide/messages.js';
	import type { Locale } from '$lib/paraglide/runtime';

	interface Props {
		locale?: Locale;
		expiresIn: string;
		resendURL: string;
		callbackURL: string;
	}
	const { locale, expiresIn, resendURL: recoverURL, callbackURL: resetURL }: Props = $props();
</script>

<Container>
	<Heading class="text-center">{m.mail_reset_password_title({}, { locale })}</Heading>
	<Container class="rounded-md border-2 border-solid border-gray-200 p-4">
		<Paragraph>{m.mail_reset_password_p1({}, { locale })}</Paragraph>
		<Paragraph>{m.mail_reset_password_p2({}, { locale })}</Paragraph>

		<Button
			class="m-auto my-4 max-w-max rounded-lg bg-neutral-800 px-6 py-4 !text-white"
			href={resetURL}
		>
			{m.mail_reset_password_button({}, { locale })}
		</Button>

		<Paragraph>
			{m.mail_reset_password_link_expires({ expiresIn }, { locale })}
			<a href={recoverURL}>{m.mail_reset_password_click_get_new_one({}, { locale })}</a>.
		</Paragraph>
	</Container>
	<Container class="mx-auto mt-8 max-w-lg">
		<Paragraph class="text-center text-sm">
			{m.mail_reset_password_p3({}, { locale })}
		</Paragraph>
		<Paragraph class="text-center text-sm">
			{m.mail_trouble_clicking_button(
				{ button: m.mail_reset_password_button({}, { locale }) },
				{ locale }
			)}
			<a class="wrap-break-word" href={resetURL}>
				{resetURL}
			</a>
		</Paragraph>
	</Container>
</Container>
