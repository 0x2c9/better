<script setup lang="ts">
import dayjs from 'dayjs'
import type { IWeightEntrySorted } from '@/types/weight'
import type { ITimer } from '~/types/timer'

const parsedWeightHistory = computed(() => {
	const result = [] as IWeightEntrySorted[]

	// generate 10 entries according to the interface with actual random values
	for (let i = 0; i < 10; i++) {
		const weight = Math.floor(Math.random() * 100) + 50
		const date = dayjs().subtract(i, 'day').toISOString()
		const progress = ['increase', 'decrease', 'same'][Math.floor(Math.random() * 3)] as 'increase' | 'decrease' | 'same'
		const dateDisplay = dayjs(date).format('DD.MM.YYYY')

		result.push({
			id: i.toString(),
			weight,
			progress,
			date,
			dateDisplay,
			weightDisplay: `${weight.toFixed(1)} kg`,
			user_date_id: `${date}-abiuqhwri9bnqdw`,
			user_id: 'abiuqhwri9bnqdw',
		})
	}

	return result
})

function onSelectEntry(entry: IWeightEntrySorted | ITimer) {
	console.log('onSelectEntry', entry)
}

function onDeleteEntry(entry: IWeightEntrySorted | ITimer) {
	console.log('onDeleteEntry', entry)
}

function onStartTimer(entry: ITimer) {
	console.log('onStartTimer', entry)
}

const timers = computed(() => {
	const result = [] as ITimer[]

	// generate 10 entries according to the interface with actual random values
	for (let i = 0; i < 10; i++) {
		const name = `Timer ${i}`
		const duration = Math.floor(Math.random() * 100) + 50
		const sets = Math.floor(Math.random() * 10) + 1
		const training_time = Math.floor(Math.random() * 100) + 50
		const pause_time = Math.floor(Math.random() * 100) + 50

		result.push({
			id: i.toString(),
			name,
			duration,
			sets,
			training_time,
			pause_time,
		})
	}

	return result
})
</script>

<template>
	<Variant title="Weight List">
		<WeightList
			:items="parsedWeightHistory"
			@select-weight="onSelectEntry"
			@delete-weight="onDeleteEntry"
		/>
	</Variant>
	<Variant title="Timer List">
		<TimerList
			:items="timers"
			@select-timer="onSelectEntry"
			@delete-timer="onDeleteEntry"
			@start-timer="onStartTimer"
		/>
	</Variant>

	<SvgSprite />
</template>
