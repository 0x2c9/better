<script setup lang="ts">
import dayjs from 'dayjs'
import Chart from 'chart.js/auto'
import gsap from 'gsap'

import type { IWeightEntrySorted } from '~/types/weight'

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
const chart = shallowRef()
const selectedEntry = ref<IWeightEntrySorted | null>(weightStore.latestEntry)
const tweened = reactive({
	weight: 0,
	date: '',
})

watch(selectedEntry, (entry) => {
	if (!entry) {
		return
	}
	gsap.to(tweened, { duration: 0.5, weight: Number(entry?.weight) || 0 })
	tweened.date = entry.date === weightStore.latestEntry?.date || entry.weight === weightStore.latestEntry?.weight
		? 'Current Weight'
		: entry.date_display

	if (chart.value?.data.datasets[0]) {
		chart.value.data.datasets[0].data.forEach((data) => {
			data.selected = data.entry.date === entry.date
		})
		chart.value.update()
	}
}, {
	immediate: true,
})

function getChartDataset() {
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

function onTimespanChange(option: number) {
	timespanChanging.value = true
	selectedTimespan.value = option
	const newData = getChartDataset()
	chart.value.data.datasets[0].data = newData
	chart.value.update()
	selectedEntry.value = newData[newData.length - 1].entry
	setTimeout(() => {
		timespanChanging.value = false
	}, 500)
}
onMounted(() => {
	if (!chartRef.value) {
		return
	}
	const intersectingVerticalLine = {
		id: 'intersectDataVerticalLine',
		beforeDraw: (chart) => {
			if (chart.getActiveElements().length) {
				const activePoint = chart.getActiveElements()[0]
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

	chart.value = new Chart(
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
							console.log(ctx)
							if (timespanChanging.value) {
								return
							}

							selectedEntry.value = ctx.tooltip.dataPoints[0].raw.entry
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
				datasets: [{
					pointBackgroundColor: (ctx) => {
					  return ctx.raw.selected ? 'red' : 'white'
					},
					borderColor: 'white',
					borderWidth: 2,
					pointRadius: 3,
					data: getChartDataset(),
				}],
			},
			plugins: [intersectingVerticalLine],
		},
	)
})
</script>

<template>
	<div class="pt-12 pb-8 mb-6 relative overflow-hidden -mx-4 -mt-8">
		<div class="absolute h-44 bottom-0 inset-x-0 bg-gradient-to-t from-neutral-950 z-50" />
		<div
			v-if="weightStore.latestEntry"
			class="absolute inset-0 pointer-events-none bg-gradient-to-tl"
			:class="{
				'from-green/40 via-green/5': weightStore.latestEntry.progress === 'increase',
				'from-red/40 via-red/5 ': weightStore.latestEntry.progress === 'decrease',
				'from-blue/40 via-blue/5 ': weightStore.latestEntry.progress === 'same',
			}"
		/>
		<div class="px-4">
			<BSwitch
				class="mb-4"
				:options="timespanOptions"
				@change="onTimespanChange"
			/>
		</div>
		<div class="flex flex-col mx-auto items-center mb-5">
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

			<span class="text-white text-4xl font-semibold tabular-nums">{{ tweened.weight.toFixed(1) }}</span>
		</div>
		<div class="z-50 relative px-3">
			<canvas ref="chartRef" />
		</div>
	</div>
</template>
