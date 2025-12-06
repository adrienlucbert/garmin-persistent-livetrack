<script lang="ts">
	import { Button, Container, Heading, Paragraph, inline } from '@uraniadev/emailer';
	import { m } from '$lib/paraglide/messages.js';
	import type { Locale } from '$lib/paraglide/runtime';

	interface Props {
		locale?: Locale;
		appName: string;
		username: string;
		approveURL: string;
		denyURL: string;
		manageAccessURL: string;
	}
	const { locale, appName, username, approveURL, denyURL, manageAccessURL }: Props = $props();
</script>

<Container>
	<Heading class="text-center"
		>{m.mail_new_follow_request_title({ username, appName }, { locale })}</Heading
	>
	<Container class="rounded-md border-2 border-solid border-gray-200 p-4">
		<Paragraph>
			{m.mail_new_follow_request_p1({}, { locale })}
		</Paragraph>

		<Container class="my-4">
			<table style={inline('w-full border-separate border-spacing-x-2')}>
				<tbody>
					<tr>
						<td style={inline('text-right')}>
							<Button
								class="shadow-xs m-0 inline-block rounded-md border border-solid border-emerald-500 bg-[rgb(250,250,250)] px-3 text-sm text-emerald-500"
								href={approveURL}
							>
								{m.followers_approve({}, { locale })}
							</Button>
						</td>
						<td style={inline('text-left')}>
							<Button
								class="shadow-xs m-0 inline-block rounded-md border border-solid border-red-600 bg-[rgb(250,250,250)] px-3 text-sm text-red-600"
								href={denyURL}
							>
								{m.followers_deny({}, { locale })}
							</Button>
						</td>
					</tr>
				</tbody>
			</table>
		</Container>
	</Container>
	<Container class="mx-auto mt-8 max-w-lg">
		<Paragraph class="text-center text-sm">
			{m.mail_new_follow_request_p2({ tab: m.pages_manage_access({}, { locale }) }, { locale })}
			<a style="overflow-wrap: break-word;" href={manageAccessURL}>
				{manageAccessURL}
			</a>
		</Paragraph>
	</Container>
</Container>
