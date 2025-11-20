<script lang="ts">
	import { Button, Container, Heading, Paragraph } from '@uraniadev/emailer';
	import { m } from '$lib/paraglide/messages.js';

	interface Props {
		expiresIn: string;
		resendURL: string;
		callbackURL: string;
	}
	const { expiresIn, resendURL: recoverURL, callbackURL: resetURL }: Props = $props();
</script>

<Container>
	<Heading class="text-center">{m.mail_reset_password_title()}</Heading>
	<Container class="rounded-md border-2 border-solid border-gray-200 p-4">
		<Paragraph>{m.mail_reset_password_p1()}</Paragraph>
		<Paragraph>{m.mail_reset_password_p2()}</Paragraph>

		<Button
			class="m-auto my-4 max-w-max rounded-lg bg-neutral-800 px-6 py-4 !text-white"
			href={resetURL}
		>
			{m.mail_reset_password_button()}
		</Button>

		<Paragraph>
			{m.mail_reset_password_link_expires({ expiresIn })}
			<a href={recoverURL}>{m.mail_reset_password_click_get_new_one()}</a>.
		</Paragraph>
	</Container>
	<Container class="mx-auto mt-8 max-w-lg">
		<Paragraph class="text-center text-sm">
			{m.mail_reset_password_p3()}
		</Paragraph>
		<Paragraph class="text-center text-sm">
			{m.mail_trouble_clicking_button({ button: m.mail_reset_password_button() })}
			<a class="wrap-break-word" href={resetURL}>
				{resetURL}
			</a>
		</Paragraph>
	</Container>
</Container>
