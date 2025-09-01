<script lang="ts">
	import { env as pubEnv } from '$env/dynamic/public';
	import { env as privEnv } from '$env/dynamic/private';
	import { Button, Card, Container, Heading, inline, Paragraph } from '@uraniadev/emailer';

	interface Props {
		email: string;
		callbackURL: string;
	}
	const { email, callbackURL }: Props = $props();
</script>

<Container>
	<Heading class="text-center">Verify your email address</Heading>
	<Container class="rounded-md border-2 border-solid border-gray-200 p-4">
		<Paragraph>
			To activate your account, we just need to verify your email address:
			<a href={`mailto:${email}`}>{email}</a>
		</Paragraph>

		<Button
			class="m-auto my-4 max-w-max rounded-lg bg-neutral-800 px-6 py-4 !text-white"
			href={callbackURL}>Verify email address</Button
		>
		<Paragraph class="mt-8 text-center text-sm">
			This will let you receive notifications and password resets from {privEnv.APP_NAME}
		</Paragraph>
	</Container>
	<Container class="mx-auto max-w-lg">
		<Paragraph class="mt-8 text-center text-sm">
			You're receiving this email because you recently created an account requested at
			<a href={pubEnv.PUBLIC_URL}>{privEnv.APP_NAME}</a>. If it wasn't you, please ignore this
			email.
		</Paragraph>
		<Paragraph class="text-center text-sm">
			If you're having trouble clicking the "Verify email address" button, copy and paste the URL
			below into your web browser: <a
				style="overflow-wrap: break-word; word-wrap: break-word;"
				href={callbackURL}>{callbackURL}</a
			>
		</Paragraph>
	</Container>
</Container>
