<script lang="ts">
	import { Button, Container, Heading, Paragraph } from '@uraniadev/emailer';
	import { m } from '$lib/paraglide/messages.js';

	interface Props {
		appName: string;
		username: string;
		approveURL: string;
		denyURL: string;
		manageAccessURL: string;
	}
	const { appName, username, approveURL, denyURL, manageAccessURL }: Props = $props();
</script>

<Container>
	<Heading class="text-center">{m.mail_new_follow_request_title({ username, appName })}</Heading>
	<Container class="rounded-md border-2 border-solid border-gray-200 p-4">
		<Paragraph>
			{m.mail_new_follow_request_p1()}
		</Paragraph>

		<Container class="my-4 flex justify-center gap-4">
			<Button
				class="m-0 rounded-md border border-solid border-emerald-500 bg-[rgb(250,250,250)] px-3 text-sm text-emerald-500 shadow-xs"
				href={approveURL}
			>
				{m.followers_approve()}
			</Button>
			<Button
				class="m-0 rounded-md border border-solid border-red-600 bg-[rgb(250,250,250)] px-3 text-sm text-red-600 shadow-xs"
				href={denyURL}
			>
				{m.followers_deny()}
			</Button>
		</Container>
		<Paragraph></Paragraph>
	</Container>
	<Container class="mx-auto mt-8 max-w-lg">
		<Paragraph class="text-center text-sm">
			{m.mail_new_follow_request_p2({ tab: m.pages_manage_access() })}
			<a class="wrap-break-word" href={manageAccessURL}>
				{manageAccessURL}
			</a>
		</Paragraph>
	</Container>
</Container>
