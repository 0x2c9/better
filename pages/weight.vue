<script setup lang="ts">
import dayjs from 'dayjs'
import type { IWeightEntrySorted } from '@/types/weight'

definePageMeta({
	layout: 'app',
})

const weightStore = useWeightStore()

const selectedWeightEntry = ref<IWeightEntrySorted | null>(null)
const showWeightForm = ref(false)

function onOpenWeightForm() {
	const weightEntry = weightStore.parsedWeightHistory.find((entry) => dayjs(entry.date).isSame(dayjs(), 'day'))

	if (!weightEntry) {
		selectedWeightEntry.value = null
	} else {
		selectedWeightEntry.value = weightEntry
	}

	showWeightForm.value = true
}

function onWeightFormSubmit() {
	showWeightForm.value = false
}

function onSelectEntry(weightEntry: IWeightEntrySorted) {
	selectedWeightEntry.value = weightEntry
	showWeightForm.value = true
}

async function onDeleteEntry(weightEntry: IWeightEntrySorted) {
	await weightStore.deleteWeight(weightEntry.id)
}
</script>

<template>
	<article class="relative">
		<LazyWeightHistoryChart v-if="weightStore.weightHistory.length" />
		<div class="flex justify-end items-center mb-6">
			<BButton
				variant="secondary"
				small
				@click="onOpenWeightForm"
			>
				<BIcon
					name="material-symbols-add-rounded"
					class="-ml-2 mr-2"
				/>
				Update your weight
			</BButton>
		</div>
		<WeightList
			:items="weightStore.parsedWeightHistory"
			@select-weight="onSelectEntry"
			@delete-weight="onDeleteEntry"
		/>
		<LazyBDrawer
			v-model="showWeightForm"
		>
			<WeightForm
				:selected-weight-entry="selectedWeightEntry"
				@submit="onWeightFormSubmit"
			/>
		</LazyBDrawer>
	</article>
</template>

<style scoped>
.bg-gradient {
  background: linear-gradient(90deg, hsla(0deg 0% 24% / 0) 0%, hsla(0deg 0% 24% / 1) 30%, hsla(0deg 0% 24% / 1) 70%, hsla(0deg 0% 24% / 0) 100%);
  width: 100%;
  height: 1px;
  border-radius: 9999px;
}
</style>
