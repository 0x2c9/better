<script setup lang="ts">
import type { IWeightEntrySorted } from '~/types/weight'

const { selectedWeightEntry } = defineProps<{
	selectedWeightEntry: IWeightEntrySorted | null
}>()

const emits = defineEmits<{
	submit: [void]
}>()

const weightStore = useWeightStore()

const formWeight = ref(80)
const date = ref(new Date().toISOString().substring(0, 10))

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
		<JDatepickerInput
			v-model="date"
		/>
		<BButton
			type="submit"
			class="!mt-12 w-full"
		>
			Update Your Weight
		</BButton>
	</form>
</template>
