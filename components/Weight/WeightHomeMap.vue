<script setup lang="ts">
import type { WeightEntry } from '@/types/weight'

const weightStore = useWeightStore()

const selectedWeightEntry = ref<WeightEntry | null>(null)
const showWeightForm = ref(false)
const showWeightList = ref(false)

function openWeightList() {
	selectedWeightEntry.value = null
	showWeightList.value = true
}

function openWeightForm() {
	selectedWeightEntry.value = null
	showWeightForm.value = true
}

function onWeightFormSubmit() {
	showWeightForm.value = false
}

function onSelectEntry(weightEntry: WeightEntry) {
	selectedWeightEntry.value = weightEntry
	showWeightForm.value = true
}

async function onDeleteEntry(weightEntry: WeightEntry) {
	await weightStore.deleteWeight(weightEntry.id!)
}
</script>

<template>
	<MappedEntriesHeatMap
		title="Weight"
		icon="material-symbols-monitor-weight-outline"
		:mapped-entries="weightStore.mappedEntryDates"
		type="add"
		@click="openWeightList"
		@action="openWeightForm"
	/>

	<LazyBDrawer v-model="showWeightForm">
		<WeightForm
			:selected-weight-entry="selectedWeightEntry"
			@submit="onWeightFormSubmit"
		/>
	</LazyBDrawer>
	<LazyBDrawer v-model="showWeightList" fullscreen>
		<WeightList
			:items="weightStore.parsedWeightHistory"
			@select-weight="onSelectEntry"
			@delete-weight="onDeleteEntry"
		/>
	</LazyBDrawer>
</template>
