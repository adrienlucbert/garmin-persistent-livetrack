<script lang="ts">
	import * as Chart from '$lib/components/ui/chart/index.js';
	import type { Visits } from '$lib/server/db/schema';
	import { resampleToTimeInterval } from '$lib/time';
	import { listUniqueUsers, transformPerUserVisits } from '$lib/visits';
	import { utcDay } from 'd3-time';
	import BaseChart from './base.svelte';
	import { mergeSum } from '$lib/utils';
	import { m } from '$lib/paraglide/messages.js';

	let { visits }: { visits: Visits[] } = $props();

	let users = $derived(listUniqueUsers(visits));
	let perUserVisits = $derived(
		resampleToTimeInterval(
			transformPerUserVisits(visits),
			'date',
			utcDay.every(1),
			Object.fromEntries(users.map((u) => [u, 0])),
			mergeSum
		)
	);

	const colors = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)'];
	const chartConfig = $derived(
		Object.fromEntries(
			users.map((user, i) => [user, { label: user, color: colors[i % colors.length] }])
		)
	) satisfies Chart.ChartConfig;
</script>

<BaseChart
	config={chartConfig}
	data={perUserVisits}
	series={users.map((user) => ({
		key: user || m.visitor(),
		label: chartConfig[user || m.visitor()].label,
		color: chartConfig[user || m.visitor()].color
	}))}
	legend
/>
