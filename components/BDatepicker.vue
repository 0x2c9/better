<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import 'dayjs/locale/de'

const { disableFutureDates = false, blank = true } = defineProps<{
	disableFutureDates?: boolean
	blank?: boolean
}>()

const emits = defineEmits(['setDate'])

dayjs.extend(weekday)

type IDay = {
	date: Dayjs
	dateOfMonth: number
	isDisabled: boolean
	type: 'past' | 'future' | 'current'
	computedClass?: object
}

const modelValue = defineModel<string>()

const monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const date = ref(dayjs(modelValue.value))
const initialDate = ref(dayjs(modelValue.value))

const month = computed(() => date.value.month())
const year = computed(() => date.value.year())

function setDate(day: IDay) {
	if (day.isDisabled)
		return

	initialDate.value = day.date
	modelValue.value = day.date.format('YYYY-MM-DD')
	emits('setDate')
}

function previousMonth() {
	date.value = date.value.subtract(1, 'month')
}

function nextMonth() {
	date.value = date.value.add(1, 'month')
}

function resetDate() {
	date.value = dayjs()
}

const days = computed(() => {
	const firstDayOfMonthIndex = date.value.startOf('month').weekday() - 1
	const lastDayOfPreviousMonth = date.value.subtract(1, 'month').daysInMonth()

	const out: IDay[] = []

	for (let i = 0; i < 42; i++) {
		if (i < firstDayOfMonthIndex) {
			const dateOfMonth = lastDayOfPreviousMonth - firstDayOfMonthIndex + i + 1
			const pastDate = date.value.subtract(1, 'month').date(dateOfMonth)
			out.push({
				date: pastDate,
				dateOfMonth, // index
				isDisabled: false,
				type: 'past',
			})

			continue
		}

		if (i >= firstDayOfMonthIndex + date.value.daysInMonth()) {
			const dateOfMonth = i - firstDayOfMonthIndex - date.value.daysInMonth() + 1
			const futureDate = date.value.add(1, 'month').date(dateOfMonth)

			const isFuture = futureDate.isAfter(dayjs(), 'day')
			out.push({
				date: futureDate,
				dateOfMonth,
				isDisabled: isFuture && disableFutureDates,
				type: 'future',
			})
			continue
		}

		const dateOfMonth = i - firstDayOfMonthIndex + 1
		const currentDate = date.value.date(dateOfMonth)
		const isFuture = currentDate.isAfter(dayjs(), 'day')
		out.push({
			date: currentDate,
			dateOfMonth,
			isDisabled: isFuture && disableFutureDates,
			type: 'current',
		})
	}

	for (const day of out) {
		day.computedClass = getDayClass(day)
	}

	return out
})

function getDayClass(dayObj: IDay) {
	const isSelected = dayObj.date.isSame(initialDate.value, 'day')
	const isToday = dayObj.date.isSame(dayjs(), 'day')
	return {
		'm-[1px] flex aspect-square select-none items-center justify-center rounded-full tabular-nums font-medium': true,
		'text-neutral-500': dayObj.type === 'past' || dayObj.type === 'future',
		'border border-neutral-400': isToday,
		'bg-white text-neutral-900': isSelected,
		'cursor-default text-neutral-500 line-through': dayObj.isDisabled,
		'cursor-pointer': !dayObj.isDisabled,
		'hover:bg-neutral-400 hover:text-neutral-950': !dayObj.isDisabled && !isSelected,
	}
}
</script>

<template>
	<div
		:class="{
			'rounded-xl bg-neutral-800 p-4': !blank,
		}"
	>
		<div class="mx-auto min-w-[300px] max-w-[420px]">
			<div class="mb-6 flex items-center justify-between pl-[10px] pr-2">
				<h1 class="tracking-wide">
					{{ monthLabels[month] }} - {{ year }}
				</h1>
				<div class="flex items-center space-x-5">
					<button
						type="button"
						@click="previousMonth"
					>
						<BIcon
							name="material-symbols-chevron-left-rounded"
							size="24"
						/>
					</button>
					<button
						type="button"
						@click="resetDate"
					>
						<BIcon
							name="gg-calendar-today"
							size="20"
						/>
					</button>
					<button
						type="button"
						@click="nextMonth"
					>
						<BIcon
							name="material-symbols-chevron-right-rounded"
							size="24"
						/>
					</button>
				</div>
			</div>
			<div class="border-prm grid grid-cols-7 border-b border-neutral-50/20 pb-2">
				<div
					v-for="dayLabel in dayLabels"
					:key="dayLabel"
					class="text-neutral text-center text-sm"
				>
					{{ dayLabel.slice(0, 2) }}
				</div>
			</div>
			<div class="grid grid-cols-7">
				<div
					v-for="day in days"
					:key="`${day.dateOfMonth} + -${day.type}`"
					:class="day.computedClass"
					@click="setDate(day)"
				>
					{{ day.dateOfMonth }}
				</div>
			</div>
		</div>
	</div>
</template>
