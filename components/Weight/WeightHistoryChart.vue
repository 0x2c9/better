<script setup lang="ts">
import dayjs from 'dayjs'
import type { ChartDataset, Plugin } from 'chart.js'
import { CategoryScale, Chart, LineController, LineElement, LinearScale, PointElement, Tooltip } from 'chart.js'
import gsap from 'gsap'

import type { WeightEntry } from '~/types/weight'

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip)

type DataPoint = {
	x: string
	y: number[]
	entry: WeightEntry
	selected: boolean
}

type TChart = Chart<'line', DataPoint[]>

const weightStore = useWeightStore()

const chartRef = ref<HTMLCanvasElement>()
const chart = shallowRef<TChart>()
const selectedEntry = ref<WeightEntry | null>(weightStore.latestEntry)
const tweened = reactive({
	weight: 0,
	date: '',
	weightDiffToFirst: 0,
	weightDiffToFirstPercent: 0,
	weightDiffProgress: 'same',
})

weightStore.$onAction((action) => {
	action.after(() => {
		if (!chart.value) {
			return
		}
		if (action.name === 'deleteWeight' || action.name === 'upsertWeight') {
			chart.value.data.datasets[0] = getChartDataset()
			chart.value.update()
			selectedEntry.value = weightStore.latestEntry
		}
	})
})

watch(selectedEntry, (entry) => {
	if (!entry) {
		return
	}
	if (weightStore.firstEntry) {
		tweened.weightDiffToFirst = entry.weight - weightStore.firstEntry?.weight
		tweened.weightDiffToFirstPercent = (tweened.weightDiffToFirst / weightStore.firstEntry?.weight) * 100

		if (tweened.weightDiffToFirst > 0) {
			tweened.weightDiffProgress = 'decrease'
		} else if (tweened.weightDiffToFirst < 0) {
			tweened.weightDiffProgress = 'increase'
		} else {
			tweened.weightDiffProgress = 'same'
		}
	}

	gsap.to(tweened, { duration: 0.5, weight: Number(entry?.weight) || 0 })

	tweened.date = entry.date === weightStore.latestEntry?.date || entry.weight === weightStore.latestEntry?.weight ? 'Current Weight' : entry.date_display!

	if (chart.value?.data.datasets[0]) {
		chart.value.data.datasets[0].data.forEach((data) => {
			data.selected = data.entry.date === entry.date
		})
		chart.value.update()
	}
}, {
	immediate: true,
})

function getProgressColor() {
	if (weightStore.overallProgress === 'increase') {
		return '#e00'
	}
	if (weightStore.overallProgress === 'decrease') {
		return '#20cda6'
	}

	return '#0070f3'
}

function getChartDataset(): ChartDataset<'line', DataPoint[]> {
	const dataset = {
		pointBackgroundColor: getProgressColor(),
		borderColor: getProgressColor(),
		borderWidth: 2,
		pointRadius: 1,
		data: getChartDataPoints(),
	}

	return dataset
}

function getChartDataPoints() {
	const entries = weightStore.parsedWeightHistory

	return entries.map((entry) => ({
		x: dayjs(entry.date).format('MMM DD'),
		y: [entry.weight],
		entry,
		selected: false,
	})).reverse()
}

onMounted(() => {
	if (!chartRef.value) {
		return
	}
	const intersectingVerticalLine: Plugin<'line'> = {
		id: 'intersectDataVerticalLine',
		beforeDraw: (chart) => {
			const activeElements = chart.getActiveElements()
			if (activeElements.length) {
				const activePoint = activeElements[0]
				const chartArea = chart.chartArea
				const ctx = chart.ctx
				ctx.save()
				ctx.beginPath()
				ctx.moveTo(activePoint.element.x, chartArea.top)
				ctx.lineTo(activePoint.element.x, chartArea.bottom)
				ctx.lineWidth = 1
				ctx.strokeStyle = 'rgba(0,0,0, 0.4)'
				ctx.stroke()
				ctx.restore()
			}
		},
	}

	chart.value = new Chart<'line', DataPoint[]>(
		chartRef.value,
		{
			type: 'line',
			options: {
				interaction: {
					mode: 'index',
					intersect: false,
				},
				plugins: {
					legend: {
						display: false,
					},

					tooltip: {
						enabled: false,
						position: 'nearest',
						external: (ctx) => {
							const raw = ctx.tooltip.dataPoints[0].raw as DataPoint
							selectedEntry.value = raw.entry
						},
					},
				},
				scales: {
					x: {
						grid: {
							display: false,
							color: 'black',
						},
						ticks: {
							color: 'black',
							font: {
								size: 12,
							},
							minRotation: 45,
						},
					},
					y: {
						grid: {
							display: true,
							color: 'rgba(0, 0, 0, 0.1)',
						},
						ticks: {
							color: 'black',
							font: {
								size: 12,
							},
						},
					},
				},
			},
			data: {
				datasets: [getChartDataset()],
			},
			plugins: [intersectingVerticalLine],
		},
	)
})
</script>

<template>
	<div class="relative mb-4 overflow-hidden rounded-lg bg-white py-4 shadow-better">
		<div class="px-4">
		</div>
		<div class="mx-auto mb-5 flex flex-col items-center">
			<Transition
				name="fade"
				mode="out-in"
			>
				<span
					:key="tweened.date"
					class="font-semibold text-gray-medium"
				>
					{{ tweened.date }}
				</span>
			</Transition>
			<div class="flex flex-col items-center">
				<span class="mb-2 text-4xl font-semibold tabular-nums text-black">{{ tweened.weight.toFixed(1) }} kg</span>
				<span
					class="rounded-full border px-2 py-0.5 text-xs font-semibold"
					:class="{
						'border border-green bg-green/20 text-green': tweened.weightDiffProgress === 'increase',
						'border border-red bg-red/20 text-red': tweened.weightDiffProgress === 'decrease',
						'border border-blue bg-blue/20 text-blue': tweened.weightDiffProgress === 'same',
					}"
				>
					overall
					{{ tweened.weightDiffToFirstPercent.toFixed(1) }}%
					{{ tweened.weightDiffToFirst > 0 ? '↑' : '↓' }}
				</span>
			</div>
		</div>
		<div class="relative z-50 px-3">
			<canvas ref="chartRef"></canvas>
		</div>
	</div>
</template>
