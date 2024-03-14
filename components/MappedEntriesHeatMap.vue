<script setup lang="ts" generic="T">
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import isoWeek from 'dayjs/plugin/isoWeek'
import 'dayjs/locale/de'

defineProps<{
	mappedEntries: Record<string, T>
	title: string
	icon: keyof typeof ICONS
	type: 'add' | 'view'
}>()

const emits = defineEmits<{
	action: [void]
}>()

dayjs.locale('de') // use locale
dayjs.extend(weekOfYear)
dayjs.extend(isoWeek)

const WEEKS_TO_DISPLAY = 20

function getDateFromWeekAndDay(week: number, day: number) {
	// Get the first day of the current week
	const adaptedWeek = WEEKS_TO_DISPLAY - week
	let date = dayjs().startOf('week').hour(12)

	// Subtract the number of weeks
	date = date.subtract(adaptedWeek, 'week')

	// Set the day of the week
	date = date.isoWeekday(day)

	return date.format('YYYY-MM-DD')
}

function getWeekDays(w: number) {
	if (w === WEEKS_TO_DISPLAY) {
		return dayjs().isoWeekday()
	}

	return 7
}
</script>

<template>
	<div class="rounded-lg bg-white p-4 shadow-better">
		<header class="mb-4 flex items-center">
			<div class="mr-2 flex size-9 items-center justify-center rounded-full bg-gray-light p-1">
				<BIcon :name="icon" size="20" />
			</div>
			<div class="flex flex-1 flex-col">
				<h2 class="font-semibold">
					{{ title }}
				</h2>
			</div>
			<button class="flex size-9 items-center justify-center rounded-full bg-black p-1 text-white" @click.stop="emits('action')">
				<BIcon :name="type === 'add' ? 'material-symbols-add-rounded' : 'material-symbols-chevron-right-rounded'" size="24" />
			</button>
		</header>
		<section
			class="flex justify-between "
		>
			<div
				v-for="w in WEEKS_TO_DISPLAY"
				:key="`${w}-week`"
				class="flex flex-col gap-y-1"
			>
				<div
					v-for="d in getWeekDays(w)"
					:key="`${w}-week-${d}-day`"
					class="size-3 rounded-sm"
					:class="mappedEntries[getDateFromWeekAndDay(w, d)] ? 'bg-blue' : 'bg-gray-light'"
				></div>
			</div>
		</section>
	</div>
</template>
