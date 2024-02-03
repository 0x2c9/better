<script setup lang="ts">
import type { Exercise } from '~/types/exercise'

definePageMeta({
	layout: 'app',
	auth: true,
})

const exerciseStore = useExerciseStore()

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
