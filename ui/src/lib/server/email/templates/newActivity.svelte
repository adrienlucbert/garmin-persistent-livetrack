<script lang="ts">
	import { Button, Container, Heading, Paragraph } from '@uraniadev/emailer';
	import { m } from '$lib/paraglide/messages.js';

	interface Props {
		username: string;
		athleteURL: string;
		accountURL: string;
	}
	const { username, athleteURL, accountURL }: Props = $props();
</script>

<Container>
	<Heading class="text-center">{m.mail_new_activity_title({ username })}</Heading>
	<Button
		class="m-auto my-4 max-w-max rounded-lg bg-neutral-800 px-6 py-4 !text-white"
		href={athleteURL}
	>
		{m.mail_new_activity_button()}
	</Button>
	<Container class="mx-auto mt-8 max-w-lg">
		<Paragraph class="text-center text-sm">
			{@html m.mail_new_activity_p1({ username, link: accountURL, label: m.pages_account() })}
		</Paragraph>
		<Paragraph class="text-center text-sm">
			{m.mail_trouble_clicking_button({ button: m.mail_new_activity_button() })}
			<a class="wrap-break-word" href={athleteURL}>
				{athleteURL}
			</a>
		</Paragraph>
	</Container>
</Container>
