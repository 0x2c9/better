<script setup lang="ts">
import type { Workout } from '@/types/workout'

import type { Exercise } from '~/types/exercise'

definePageMeta({
	layout: 'app',
	auth: true,
})

const workoutStore = useWorkoutStore()
const globalState = useGlobalState()

const showWorkoutForm = ref(false)
const selectedWorkout = ref<Workout | null>(null)

function openWorkout() {
	showWorkoutForm.value = true
}

function onSelectWorkout(workout: Workout) {
	selectedWorkout.value = workout
	showWorkoutForm.value = true
}

function onDeleteWorkout(workout: Workout) {
	workoutStore.deleteWorkout(workout.id!)
}

watch(
	() => showWorkoutForm.value,
	(isOpen) => {
		if (!isOpen) {
			selectedWorkout.value = null
		}
	},
	{
		immediate: true,
	},
)
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
	<article class="relative w-full">
		<div class="mb-4 flex items-center justify-between">
			<h2 class=" text-2xl font-semibold">
				Workouts
			</h2>
			<BButton
				icon-name="material-symbols-add-rounded"
				variant="outline"
				@click="openWorkout"
			/>
		</div>
		<BGenericList
			:items="workoutStore.workouts"
			@select="onSelectWorkout"
			@delete="onDeleteWorkout"
		>
			<template #content="{ item }">
				<WorkoutListItem :item="item" />
			</template>
		</BGenericList>

		<WorkoutForm
			v-model="showWorkoutForm"
			:selected-workout="selectedWorkout"
		/>

		<div class="mb-4 mt-8 flex items-center justify-between">
			<h2 class=" text-2xl font-semibold">
				Exercises
			</h2>
			<BButton
				icon-name="material-symbols-add-rounded"
				variant="outline"
				@click="openExercise"
			/>
		</div>
		<ExerciseList
			v-model="exerciseStore.exercises"
			@select-exercise="onSelectExercise"
			@delete-exercise="onDeleteExercise"
		/>

		<ExerciseForm
			v-model="openExerciseForm"
			:selected-exercise="selectedExercise"
		/>
	</article>
</template>
