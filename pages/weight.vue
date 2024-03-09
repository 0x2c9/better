<script setup lang="ts">
import dayjs from 'dayjs'
import type { WeightEntry } from '@/types/weight'

definePageMeta({
	layout: 'app',
	auth: true,
})

const weightStore = useWeightStore()

const selectedWeightEntry = ref<WeightEntry | null>(null)
const showWeightForm = ref(false)

function onOpenWeightForm() {
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
	<article class="relative">
		<BPageActionButton @click="onOpenWeightForm">
			<BIcon
				name="material-symbols-add-rounded"
				class="-ml-2 mr-2"
			/>
			Add weight entry
		</BPageActionButton>

		<LazyWeightHistoryChart v-if="weightStore.weightHistory.length" />

		<WeightList
			:items="weightStore.parsedWeightHistory"
			@select-weight="onSelectEntry"
			@delete-weight="onDeleteEntry"
		/>

		<LazyBDrawer v-model="showWeightForm">
			<WeightForm
				:selected-weight-entry="selectedWeightEntry"
				@submit="onWeightFormSubmit"
			/>
		</LazyBDrawer>
	</article>
</template>
