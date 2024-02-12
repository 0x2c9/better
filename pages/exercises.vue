<script setup lang="ts">
import type { Exercise } from '~/types/exercise'

definePageMeta({
	layout: 'app',
	auth: true,
})

const exerciseStore = useExerciseStore()
const globalState = useGlobalState()

const selectedExercise = ref<Exercise | null>(null)
const openExerciseForm = ref(false)

function openExercise() {
	selectedExercise.value = null
	openExerciseForm.value = true
}

function onSelectExercise(exercise: Exercise) {
	selectedExercise.value = exercise
	openExerciseForm.value = true
}

function onDeleteExercise(exercise: Exercise) {
	exerciseStore.deleteExercise(exercise.id!)
}
</script>

<template>
	<article class="relative">
		<BPageActionButton @click="openExercise">
			<BIcon
				name="material-symbols-add-rounded"
				class="-ml-2 mr-2"
			/>
			Create Exercise
		</BPageActionButton>

		<div
			v-if="!exerciseStore.exercises?.length && globalState.loaded"
			class="fixed inset-x-4 top-1/2 -translate-y-1/2 transform text-center text-lg text-neutral-600"
		>
			<p>There are no exercises yet.</p>
			<p>Add your first exercises to get started.</p>
		</div>

		<ExerciseList
			:items="exerciseStore.exercises"
			@select-exercise="onSelectExercise"
			@delete-exercise="onDeleteExercise"
		/>

		<ExerciseForm
			v-model="openExerciseForm"
			:selected-exercise="selectedExercise"
		/>
	</article>
</template>
