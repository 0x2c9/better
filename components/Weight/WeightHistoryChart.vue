<script setup lang="ts">
import dayjs from 'dayjs'
import Chart from 'chart.js/auto'

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

const chartRef = ref<HTMLCanvasElement>()
const chart = shallowRef()

function getChartDataset() {
	const timespan = timespanOptions[selectedTimespan.value].content

	const entries = weightStore.parsedWeightHistory.slice(0, timespan)
	const maxDataPoints = 25

	const step = Math.ceil(entries.length / maxDataPoints)
	const sampledEntries = entries.filter((_, index) => index % step === 0)

	return sampledEntries.map((entry) => ({
		x: dayjs(entry.date).format('MMM DD'),
		y: [entry.weight],
	})).reverse()
}

function onTimespanChange(option: number) {
	console.log('onTimespanChange', option)
	selectedTimespan.value = option

	const newData = getChartDataset()
	console.log(newData)
	chart.value.data.datasets[0].data = newData
	chart.value.update()
}

onMounted(() => {
	if (!chartRef.value) {
		return
	}

	chart.value = new Chart(
		chartRef.value,
		{
			type: 'line',
			options: {
				plugins: {
					legend: {
						display: false,
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
					pointBackgroundColor: 'white',
					borderColor: 'white',
					borderWidth: 2,
					pointRadius: 3,
					data: getChartDataset(),
				}],
			},
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
			<span class="text-neutral-400">Current Weight</span>
			<span class="text-white text-4xl font-semibold">{{ weightStore.latestEntry?.weight_display }}</span>
		</div>
		<div class="z-50 relative px-3">
			<canvas ref="chartRef" />
		</div>
	</div>
</template>
