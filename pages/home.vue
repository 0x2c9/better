<script setup lang="ts">
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'

dayjs.locale('de')
dayjs.extend(weekOfYear)

definePageMeta({
	layout: 'app',
	auth: true,
})

const weightStore = useWeightStore()
const workoutStore = useWorkoutStore()
const globalState = useGlobalState()

const currentWeek = dayjs().week()
const selectedWeek = ref<number>(currentWeek)

const selectedWeekTimespanInfo = computed(() => {
	const startOfWeek = dayjs().week(selectedWeek.value).startOf('week')
	const endOfWeek = dayjs().week(selectedWeek.value).endOf('week')

	let spanWeekStr = ''

	if (selectedWeek.value === currentWeek) {
		spanWeekStr = 'This Week'
	} else if (selectedWeek.value === currentWeek - 1) {
		spanWeekStr = 'Last Week'
	} else if (selectedWeek.value === currentWeek + 1) {
		spanWeekStr = 'Next Week'
	} else if (selectedWeek.value < currentWeek) {
		spanWeekStr = `${currentWeek - selectedWeek.value}w Ago`
	} else {
		spanWeekStr = `${selectedWeek.value - currentWeek}w From Now`
	}

	const spanDateStr = `${startOfWeek.format('MMM')} ${startOfWeek.format('D')} - ${endOfWeek.format('D')}`

	return {
		spanWeekStr,
		spanDateStr,
	}
})

const weekDays = computed(() => {
	const startOfWeek = dayjs().week(selectedWeek.value).startOf('week')
	const dayInitials = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
	const days = []

	for (let i = 0; i <= 6; i++) {
		const day = {
			date: startOfWeek.add(i, 'day').format('YYYY-MM-DD'),
			dayInitial: dayInitials[i],
		}

		days.push(day)
	}

	return days
})

function handleWeekChange(direction: 'prev' | 'next' | 'current') {
	if (direction === 'prev') {
		selectedWeek.value -= 1
	} else if (selectedWeek.value < currentWeek + 2) {
		selectedWeek.value += 1
	}

	if (direction === 'current') {
		selectedWeek.value = currentWeek
	}
}

function addActivityEntry(date: string) {
	console.log('addActivityEntry', date)
}
</script>

<template>
	<article class="relative flex flex-1 flex-col">
		<section class="flex flex-1 flex-col">
			<ul class="grid h-full grid-rows-7">
				<li
					v-for="day of weekDays"
					:key="day.dayInitial"
				>
					<header class="flex items-center">
						<div class="min-w-4 text-center text-lg font-bold">
							{{ day.dayInitial }}
						</div>
						<div class="mx-4 h-[2px] w-full flex-1 rounded-full bg-neutral-600">
						</div>
						<button @click="addActivityEntry(day.date)">
							<BIcon
								name="material-symbols-add-rounded"
								size="28"
								class="text-neutral-400"
							/>
						</button>
					</header>
					<section class="flex gap-4">
						<span
							v-if="weightStore.mappedEntryDates[day.date] && globalState.loaded"
							class=" inline-block rounded-full border border-neutral-700 bg-neutral-700/50 px-2 py-0.5 text-neutral-400"
						>
							{{ weightStore.mappedEntryDates[day.date].weight_display }}
						</span>
						<template v-if="workoutStore.mappedEntryWorkouts[day.date] && globalState.loaded">
							<span
								v-for="workoutEntry in workoutStore.mappedEntryWorkouts[day.date]"
								:key="workoutEntry.created_at"
								class=" inline-block rounded-full border border-neutral-700 bg-neutral-700/50 px-2 py-0.5 text-neutral-400"
							>
								{{ workoutEntry.workout_name }}
							</span>
						</template>
					</section>
				</li>
			</ul>
		</section>
		<footer class="fixed inset-x-4 bottom-[84px]">
			<nav class="flex w-full items-center justify-between px-4">
				<BButton
					icon-name="material-symbols-chevron-left-rounded"
					variant="secondary"
					small
					icon-size="28"
					@click="handleWeekChange('prev')"
				/>
				<div class="flex flex-col items-center" @click="handleWeekChange('current')">
					<span>{{ selectedWeekTimespanInfo.spanWeekStr }}</span>
					<span class="tabular-nums text-neutral-400">{{ selectedWeekTimespanInfo.spanDateStr }}</span>
				</div>

				<BButton
					icon-name="material-symbols-chevron-right-rounded"
					variant="secondary"
					small
					icon-size="28"
					@click="handleWeekChange('next')"
				/>
			</nav>
		</footer>
	</article>
</template>
