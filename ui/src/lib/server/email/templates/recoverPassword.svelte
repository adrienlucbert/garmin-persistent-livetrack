<script lang="ts">
	import { Button, Container, Heading, Paragraph } from '@uraniadev/emailer';

	interface Props {
		expiresIn: string;
		resendURL: string;
		callbackURL: string;
	}
	const { expiresIn, resendURL: recoverURL, callbackURL: resetURL }: Props = $props();
</script>

<Container>
	<Heading class="text-center">Reset your password</Heading>
	<Container class="rounded-md border-2 border-solid border-gray-200 p-4">
		<Paragraph>You requested to recover your password.</Paragraph>
		<Paragraph>If you think this is a mistake please notice the platform administrator.</Paragraph>

		<Button
			class="m-auto my-4 max-w-max rounded-lg bg-neutral-800 px-6 py-4 !text-white"
			href={resetURL}>Reset password</Button
		>

		<Paragraph
			>This link will expire in {expiresIn}.
			<a href={recoverURL}>Click here to get a new one</a>.
		</Paragraph>
	</Container>
	<Container class="mx-auto max-w-lg">
		<Paragraph class="mt-8 text-center text-sm">
			You're receiving this email because a password reset was requested for your account.
		</Paragraph>
		<Paragraph class="text-center text-sm">
			If you're having trouble clicking the "Reset password" button, copy and paste the URL below
			into your web browser: <a
				style="overflow-wrap: break-word; word-wrap: break-word;"
				href={resetURL}>{resetURL}</a
			>
		</Paragraph>
	</Container>
</Container>
