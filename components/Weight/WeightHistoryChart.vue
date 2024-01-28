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

const timespanOptions = [
	{
		label: '7 days',
		content: 7,
	},
	{
		label: '30 days',
		content: 30,
	},
	{
		label: '90 days',
		content: 90,
	},
]

const selectedTimespan = ref(0)
const timespanChanging = ref(false)
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
	if (!weightStore.latestEntry) {
		return 'white'
	}

	if (weightStore.latestEntry.progress === 'increase') {
		return '#059669'
	}
	if (weightStore.latestEntry.progress === 'decrease') {
		return '#DC2626'
	}

	return '#0EA5E9'
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
	const timespan = timespanOptions[selectedTimespan.value].content

	const entries = weightStore.parsedWeightHistory.slice(0, timespan)
	const maxDataPoints = 25

	const step = Math.ceil(entries.length / maxDataPoints)
	const sampledEntries = entries.filter((_, index) => index % step === 0)

	return sampledEntries.map((entry) => ({
		x: dayjs(entry.date).format('MMM DD'),
		y: [entry.weight],
		entry,
		selected: false,
	})).reverse()
}

watch(
	() => selectedTimespan.value,
	() => {
		if (!chart.value) {
			return
		}
		timespanChanging.value = true
		chart.value.data.datasets[0] = getChartDataset()
		chart.value.update()
		selectedEntry.value = weightStore.latestEntry
		setTimeout(() => {
			timespanChanging.value = false
		}, 500)
	},
)

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
				ctx.strokeStyle = 'rgba(255,255,255, 0.4)'
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
							if (timespanChanging.value) {
								return
							}
							const raw = ctx.tooltip.dataPoints[0].raw as DataPoint
							selectedEntry.value = raw.entry
						},
					},
				},
				scales: {
					x: {
						grid: {
							display: false,
							color: 'white',
						},
						ticks: {
							color: 'white',
							font: {
								size: 12,
							},
							minRotation: 45,
						},
					},
					y: {
						grid: {
							display: true,
							color: 'rgba(255, 255, 255, 0.1)',
						},
						ticks: {
							color: 'white',
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
	<div class="relative -mx-4 -mt-12 mb-6 overflow-hidden pb-8 pt-12">
		<div class="absolute inset-x-0 bottom-0 z-50 h-44 bg-gradient-to-t from-neutral-950" />
		<div
			v-if="weightStore.latestEntry"
			class="pointer-events-none absolute inset-0 bg-gradient-to-tl"
			:class="{
				'from-green/40 via-green/5': weightStore.latestEntry.progress === 'increase',
				'from-red/40 via-red/5 ': weightStore.latestEntry.progress === 'decrease',
				'from-blue/40 via-blue/5 ': weightStore.latestEntry.progress === 'same',
			}"
		/>
		<div class="px-4">
			<BSwitch
				v-model="selectedTimespan"
				class="mb-4"
				:options="timespanOptions"
			/>
		</div>
		<div class="mx-auto mb-5 flex flex-col items-center">
			<Transition
				name="fade"
				mode="out-in"
			>
				<span
					:key="tweened.date"
					class="text-neutral-400"
				>
					{{ tweened.date }}
				</span>
			</Transition>
			<div class="flex flex-col items-center">
				<span class="mb-2 text-4xl font-semibold tabular-nums text-white">{{ tweened.weight.toFixed(1) }} kg</span>
				<span
					class="rounded-full border px-2 py-0.5 text-xs font-semibold"
					:class="{
						'border border-green bg-green/20 text-green': tweened.weightDiffProgress === 'increase',
						'border border-red bg-red/20 text-red ': tweened.weightDiffProgress === 'decrease',
						'border border-blue bg-blue/20 text-blue ': tweened.weightDiffProgress === 'same',
					}"
				>
					overall
					{{ tweened.weightDiffToFirstPercent.toFixed(1) }}%
					{{ tweened.weightDiffToFirst > 0 ? '↑' : '↓' }}
				</span>
			</div>
		</div>
		<div class="relative z-50 px-3">
			<canvas ref="chartRef" />
		</div>
	</div>
</template>
