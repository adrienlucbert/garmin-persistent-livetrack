<script lang="ts" generics="TData extends any[]">
	import { scaleUtc } from 'd3-scale';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import {
		BarChart,
		type BarsProps,
		type ChartContextValue,
		Highlight,
		type SeriesData
	} from 'layerchart';
	import type { Component } from 'svelte';

	let {
		data,
		config,
		series,
		legend = false
	}: {
		data: TData;
		config: Chart.ChartConfig;
		series: SeriesData<TData, Component<BarsProps, {}, ''>>[];
		legend?: boolean;
	} = $props();

	let context = $state<ChartContextValue>();
</script>

<Chart.Container {config} class="max-h-80">
	<BarChart
		bind:context
		{data}
		x="date"
		{series}
		seriesLayout="stack"
		props={{
			bars: {
				stroke: 'none',
				rounded: 'none'
			},
			legend: {
				placement: 'bottom-left'
			},
			highlight: {
				area: { fill: 'none' }
			},
			xAxis: {
				format: (d: Date) => {
					return d.toLocaleDateString('en-US', {
						month: '2-digit',
						day: '2-digit'
					});
				},
				ticks: (scale) => scaleUtc(scale.domain(), scale.range()).ticks(),
				tickLabelProps: {
					rotate: 315,
					textAnchor: 'end'
				}
			},
			yAxis: {
				ticks: (scale) => scale.ticks?.().filter((t) => Number.isInteger(t)),
				format: (d) => d.toFixed()
			}
		}}
		{legend}
	>
		{#snippet belowMarks()}
			<Highlight area={{ class: 'fill-muted' }} motion="none" />
		{/snippet}
		{#snippet tooltip()}
			<Chart.Tooltip
				labelFormatter={(v: Date) => {
					return v.toLocaleDateString('en-US', {
						month: '2-digit',
						day: '2-digit'
					});
				}}
				indicator="line"
			/>
		{/snippet}
	</BarChart>
</Chart.Container>
