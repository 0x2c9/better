<script setup lang="ts">
import dayjs from 'dayjs'
import type { WeightEntry } from '~/types/weight'

const { selectedWeightEntry } = defineProps<{
	selectedWeightEntry: WeightEntry | null
}>()

const emits = defineEmits<{
	submit: [void]
}>()

const weightStore = useWeightStore()

const weightEntry = ref<WeightEntry>({
	weight: 80,
	date: dayjs().format('YYYY-MM-DD'),
})

watch(
	() => selectedWeightEntry,
	(selectedEntry) => {
		if (selectedEntry) {
			weightEntry.value = { ...selectedEntry }
		}
	},
	{
		immediate: true,
	},
)

const showConfirmOverwrite = ref(false)
async function onSubmit(_$event: Event, overwrite = false) {
	if (weightStore.entryDatesSet.has(weightEntry.value.date) && !overwrite) {
		showConfirmOverwrite.value = true
		return
	}
	showConfirmOverwrite.value = false
	emits('submit')

	await weightStore.upsertWeight(weightEntry.value)
}

onMounted(() => {
	if (weightStore.parsedWeightHistory.length && !selectedWeightEntry) {
		const latestEntry = weightStore.parsedWeightHistory[0]

		weightEntry.value.weight = latestEntry.weight
	}
})
</script>

<template>
	<form
		class="flex flex-col space-y-4"
		@submit.prevent="onSubmit"
	>
		<BStepper
			v-model="weightEntry.weight"
			label="Weight"
			:display-value="weightEntry.weight % 1 === 0 ? `${weightEntry.weight}.0` : weightEntry.weight"
		/>

		<BDatepickerInput
			v-model="weightEntry.date"
			:highlighted-dates="weightStore.entryDatesSet"
			:disabled="!!selectedWeightEntry?.date"
		/>
		<BButton
			type="submit"
			class="!mt-12 w-full"
		>
			{{ selectedWeightEntry ? 'Update your weight' : 'Add new entry' }}
		</BButton>

		<LazyBDrawer v-model="showConfirmOverwrite">
			<div class="mx-auto mb-4 mt-2 flex size-8 items-center justify-center rounded-full bg-black text-white">
				<BIcon
					size="28"
					name="material-symbols-exclamation-rounded"
				/>
			</div>
			<h1 class="mb-1 text-2xl font-semibold">
				Update existing entry?
			</h1>
			<p class="text-lg">
				You are about to change your weight entry on <span class="font-semibold">{{ dayjs(weightEntry.date).format('ddd, DD.MM.YYYY') }}</span>.
			</p>
			<p class="text-lg">
				From <span class="font-semibold">{{ selectedWeightEntry?.weight_display }}</span> to <span class="font-semibold">{{ weightEntry.weight }}kg</span>
			</p>

			<div class="mt-8 flex flex-col gap-y-4">
				<BButton
					type="button"
					class="w-full"
					@click="onSubmit($event, true)"
				>
					Yes, overwrite
				</BButton>
				<BButton
					variant="secondary"
					type="button"
					class="w-full"
					@click="showConfirmOverwrite = false"
				>
					No, cancel
				</BButton>
			</div>
		</LazyBDrawer>
	</form>
</template>
