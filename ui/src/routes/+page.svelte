<script>
	import { Button } from '$lib/components/ui/button';
	import QrCodeIcon from '@lucide/svelte/icons/qr-code';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import Share2Icon from '@lucide/svelte/icons/share-2';
	import { FullPage, NarrowSection } from '$lib/components/ui/layout';
	import { pages } from '$lib/pages.svelte';
	import { m } from '$lib/paraglide/messages.js';
</script>

<NarrowSection>
	<FullPage class="grid place-items-center">
		<div class="text-center">
			<h1 class="px-2 py-8 text-4xl font-bold md:text-6xl" style="line-height: 1.2;">
				<span class="title-highlight">
					<span class="text-primary">{m.home_page_one()}</span>
					{m.home_page_tracking_link()}
				</span>
				{m.home_page_share_notify_ride()}
				<span class="title-highlight"> {m.home_page_worry_free()} </span>
				🚴
			</h1>
			<div class="mt-6 text-sm md:mt-10 md:text-lg">
				{@html m.home_page_subtitle()}
			</div>
			<div class="mt-6 flex justify-center gap-4 md:mt-4">
				<Button href={pages().gettingStarted.url}>{pages().gettingStarted.title}</Button>
				<Button variant="outline" href="#how-it-works">{m.app_footer_how_it_works()}</Button>
			</div>
		</div>
	</FullPage>
	<div id="how-it-works" class="my-14 scroll-m-20">
		<h1>{m.app_footer_how_it_works()}</h1>
		<ul>
			<li>
				<h3>
					<QrCodeIcon class="mr-4 inline size-6 align-middle" />
					{m.hiw_create_your_link_title()}
				</h3>
				<p>
					{m.hiw_create_your_link_text()}
				</p>
			</li>
			<li>
				<h3>
					<svg
						class="mr-4 inline size-6 align-middle"
						viewBox="0 0 48 48"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						><path
							class="a"
							d="M45,15.38a22.15,22.15,0,0,0-8.4-10A22.29,22.29,0,0,0,9.8,7.78,21.74,21.74,0,0,0,3,20.88h7.4A14.72,14.72,0,0,1,20.7,9.78c7.1-1.9,12.6.7,16.1,5.6Z"
						/><path
							class="a"
							d="M45,32.58a22,22,0,0,1-39.4,2.2A19.48,19.48,0,0,1,3,27h7.4a14.66,14.66,0,0,0,26.3,5.5Z"
						/></svg
					>
					{m.hiw_set_in_garmin_app_title()}
				</h3>
				<p>
					{@html m.hiw_set_in_garmin_app_text()}
				</p>
			</li>
			<li>
				<h3>
					<MapPinIcon class="mr-4 inline size-6 align-middle" />
					{m.hiw_we_handle_the_link_title()}
				</h3>
				<p>{m.hiw_we_handle_the_link_text()}</p>
			</li>
			<li>
				<h3>
					<Share2Icon class="mr-4 inline size-6 align-middle" />
					{m.hiw_share_once_done_forever_title()}
				</h3>
				<p>
					{m.hiw_share_once_done_forever_text()}
				</p>
			</li>
		</ul>
		<div class="mt-12 flex justify-center gap-4">
			<Button size="lg" href={pages().gettingStarted.url}>{m.hiw_lets_get_started()}</Button>
		</div>
	</div>
</NarrowSection>
