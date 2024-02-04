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
	if (weightStore.entryDates[weightEntry.value.date] && !overwrite) {
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
		class="flex flex-col items-center space-y-4"
		@submit.prevent="onSubmit"
	>
		<BStepper
			v-model="weightEntry.weight"
			label="Weight"
			:display-value="weightEntry.weight % 1 === 0 ? `${weightEntry.weight}.0` : weightEntry.weight"
		/>

		<BDatepickerInput
			v-model="weightEntry.date"
			:highlighted-dates="weightStore.entryDates"
			:disabled="!!selectedWeightEntry?.date"
		/>
		<BButton
			type="submit"
			class="!mt-12 w-full"
		>
			{{ selectedWeightEntry ? 'Update your weight' : 'Add new entry' }}
		</BButton>
		<ClientOnly>
			<LazyBDrawer v-model="showConfirmOverwrite">
				<p class="mb-6 text-lg font-medium text-neutral-400">
					Are you sure you want to overwrite your existing entry from <span class="text-white">{{ dayjs(weightEntry.date).format('ddd, DD.MM.YYYY') }}</span>?
				</p>

				<div class="flex flex-col gap-y-4">
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
		</ClientOnly>
	</form>
</template>
