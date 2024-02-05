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

const route = useRoute()

const showOnboarding = ref(false)
if (route.query.onboarding === 'true') {
	nextTick(() => {
		showOnboarding.value = true
	})
}

const initialWeight = ref(80)
async function submitInitialWeight() {
	if (initialWeight.value) {
		await weightStore.upsertWeight({
			weight: initialWeight.value,
			date: dayjs().format('YYYY-MM-DD'),
		})
		navigateTo('/exercises')
		showOnboarding.value = false
	}
}

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

		<ClientOnly>
			<LazyBDrawer
				v-if="showOnboarding"
				v-model="showOnboarding"
			>
				<h1
					class=" text-center text-2xl font-bold text-primary"
				>
					Welcome to Better
				</h1>
				<ul class="mb-8 mt-4 flex flex-col gap-y-1 font-medium text-neutral-300">
					<li>Enter your current weight. (You can edit it later on too)</li>
					<li>Add a collection of exercises</li>
					<li>Create your first workout and get started!</li>
				</ul>
				<form
					class="mt-12 flex flex-col gap-y-8"
					@submit.prevent="submitInitialWeight"
				>
					<BStepper
						v-model="initialWeight"
						label="Current Weight"
						:display-value="initialWeight % 1 === 0 ? `${initialWeight}.0` : initialWeight"
					/>
					<BButton
						type="submit"
						variant="action"
					>
						Start my journey
					</BButton>
				</form>
			</LazyBDrawer>
		</ClientOnly>
		<ClientOnly>
			<LazyBDrawer v-model="showWeightForm">
				<WeightForm
					:selected-weight-entry="selectedWeightEntry"
					@submit="onWeightFormSubmit"
				/>
			</LazyBDrawer>
		</ClientOnly>
	</article>
</template>
