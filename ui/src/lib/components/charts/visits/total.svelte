<script lang="ts">
	import * as Chart from '$lib/components/ui/chart/index.js';
	import { resampleToTimeInterval } from '$lib/time';
	import { transformTotalVisits } from '$lib/visits';
	import { utcDay } from 'd3-time';
	import BaseChart from './base.svelte';
	import { mergeSum } from '$lib/utils';
	import { m } from '$lib/paraglide/messages.js';
	import type { VisitsWithName } from '$lib/server/visits/visits';

	let { visits }: { visits: VisitsWithName[] } = $props();

	let totalVisits = $derived(
		resampleToTimeInterval(
			transformTotalVisits(visits),
			'date',
			utcDay.every(1),
			{ count: 0 },
			mergeSum
		)
	);

	const chartConfig = {
		count: { label: m.visits_label(), color: 'var(--chart-1)' }
	} satisfies Chart.ChartConfig;
</script>

<BaseChart
	config={chartConfig}
	data={totalVisits}
	series={[
		{
			key: 'count',
			label: m.visits_label(),
			color: 'var(--chart-1)'
		}
	]}
	legend
/>
