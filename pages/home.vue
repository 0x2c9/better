<script setup lang="ts">
import dayjs from 'dayjs'
import 'dayjs/locale/de'
import weekOfYear from 'dayjs/plugin/weekOfYear'

dayjs.extend(weekOfYear)
dayjs.locale('de') // use locale

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
		const dayjsDay = startOfWeek.add(i, 'day')
		const day = {
			date: dayjsDay.format('YYYY-MM-DD'),
			dateFormatted: startOfWeek.add(i, 'day').format('ddd DD.MM.YYYY'),
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
						<div class="min-w-28 font-semibold text-black">
							{{ day.dateFormatted }}
						</div>
						<div class="mx-4 h-[2px] w-full flex-1 rounded-full bg-black">
						</div>
						<BButton
							icon-name="material-symbols-add-rounded"
							icon-size="20"
							small
							variant="secondary"
							@click="addActivityEntry(day.date)"
						/>
					</header>
					<section class="mt-2 flex gap-4">
						<BPill v-if="weightStore.mappedEntryDates[day.date] && globalState.loaded">
							{{ weightStore.mappedEntryDates[day.date].weight_display }}
						</BPill>
						<template v-if="workoutStore.mappedEntryWorkouts[day.date] && globalState.loaded">
							<NuxtLink
								v-for="workoutEntry in workoutStore.mappedEntryWorkouts[day.date]"
								:key="workoutEntry.created_at"
								:to="`/analytics/workout/${workoutEntry.id}`"
							>
								<BPill>
									{{ workoutEntry.workout_name }}
								</BPill>
							</NuxtLink>
						</template>
					</section>
				</li>
			</ul>
		</section>
		<footer class="fixed inset-x-4 bottom-[84px]">
			<nav class="flex w-full items-center justify-between px-4">
				<BButton
					icon-name="material-symbols-chevron-left-rounded"
					variant="outline"
					icon-size="28"
					@click="handleWeekChange('prev')"
				/>
				<div class="flex flex-col items-center" @click="handleWeekChange('current')">
					<span>{{ selectedWeekTimespanInfo.spanWeekStr }}</span>
					<span class="tabular-nums text-gray-medium">{{ selectedWeekTimespanInfo.spanDateStr }}</span>
				</div>

				<BButton
					icon-name="material-symbols-chevron-right-rounded"
					variant="outline"
					icon-size="28"
					@click="handleWeekChange('next')"
				/>
			</nav>
		</footer>
	</article>
</template>
