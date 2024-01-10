<script setup lang="ts">
import dayjs from 'dayjs'
import type { IWeightEntrySorted } from '~/types/weight'

const { selectedWeightEntry } = defineProps<{
	selectedWeightEntry: IWeightEntrySorted | null
}>()

const emits = defineEmits<{
	submit: [void]
}>()

const weightStore = useWeightStore()

const formWeight = ref(80)
const date = ref(dayjs().format('YYYY-MM-DD'))

watch(
	() => selectedWeightEntry,
	(selectedEntry) => {
		if (selectedEntry) {
			formWeight.value = selectedEntry.weight
			date.value = selectedEntry.date
		}
	},
	{
		immediate: true,
	},
)

async function onSubmit() {
	emits('submit')

	const payload = {
		weight: formWeight.value,
		date: date.value,
	}

	await weightStore.upsertWeight(payload, selectedWeightEntry)
}

onMounted(() => {
	if (weightStore.parsedWeightHistory.length && !selectedWeightEntry) {
		const latestEntry = weightStore.parsedWeightHistory[0]

		formWeight.value = latestEntry.weight
	}
})
</script>

<template>
	<form
		class="flex flex-col items-center space-y-4"
		@submit.prevent="onSubmit"
	>
		<BStepper
			v-if="formWeight"
			v-model="formWeight"
			label="Weight"
			:display-value="formWeight % 1 === 0 ? `${formWeight}.0` : formWeight"
		/>
		<div class="bg-gradient !mt-4" />
		<BDatepickerInput
			v-model="date"
		/>
		<BButton
			type="submit"
			class="!mt-12 w-full"
		>
			{{ selectedWeightEntry ? 'Update your weight' : 'Add new entry' }}
		</BButton>
	</form>
</template>
