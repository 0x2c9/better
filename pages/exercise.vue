<script setup lang="ts">
import type { IExercise } from '~/types/exercise'

definePageMeta({
	layout: 'app',
})

const exerciseStore = useExerciseStore()

const openExerciseForm = ref(false)

function openExercise() {
	openExerciseForm.value = true
}

const selectedExercise = ref<IExercise | null>(null)

function onSubmit() {
	openExerciseForm.value = false
}
function onSelectExercise(exercise: IExercise) {
	selectedExercise.value = exercise
	openExerciseForm.value = true
}

function onDeleteExercise(exercise: IExercise) {
	exerciseStore.deleteExercise(exercise.id!)
}
</script>

<template>
	<article class="relative">
		<div class="flex justify-end items-center mb-6">
			<BButton
				variant="secondary"
				small
				@click="openExercise"
			>
				<BIcon
					name="material-symbols-add-rounded"
					class="-ml-2 mr-2"
				/>
				Create Exercise
			</BButton>
		</div>

		<ExerciseList
			:items="exerciseStore.exercises"
			@select-exercise="onSelectExercise"
			@delete-exercise="onDeleteExercise"
		/>

		<LazyBDrawer
			v-model="openExerciseForm"
		>
			<ExerciseForm
				:selected-exercise="selectedExercise"
				@submit="onSubmit"
			/>
		</LazyBDrawer>
	</article>
</template>
