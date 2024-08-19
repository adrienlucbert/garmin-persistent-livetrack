<script>
  import "../app.css"
  import { page } from "$app/stores"

  import { Section, HeroHeader } from 'flowbite-svelte-blocks';
  import { Button } from 'flowbite-svelte';
  import { ArrowRightOutline } from 'flowbite-svelte-icons';
</script>

<div class="grid w-full place-items-center mt-24">
	<div class="flex items-center justify-center max-width-[80rem] gap-4 p-4">
		<Section name="heroDefault">
			<HeroHeader>
				<svelte:fragment slot="h1">This is embarassing...</svelte:fragment>
				<svelte:fragment slot="paragraph">There was an error: {$page?.error?.message}</svelte:fragment>
			</HeroHeader>

			<div class="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
				<Button size="lg" href="/">
					Return Home <ArrowRightOutline size="md" class="ml-2 -mr-1" />
				</Button>
			</div>
		</Section>
	</div>
</div>
