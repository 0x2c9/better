<script setup lang="ts">
import type { IWorkoutResolved } from '@/types/workout'

const workoutStore = useWorkoutStore()

const showWorkoutForm = ref(false)
const selectedWorkout = ref<IWorkoutResolved | null>(null)

function openWorkout() {
	showWorkoutForm.value = true
}

function onSelectWorkout(workout: IWorkoutResolved) {
	selectedWorkout.value = workout
	showWorkoutForm.value = true
}

function onDeleteWorkout(workout: IWorkoutResolved) {
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
</script>

<template>
	<div class="flex justify-end items-center mb-6">
		<BButton
			variant="secondary"
			small
			@click="openWorkout"
		>
			<BIcon
				name="material-symbols-add-rounded"
				class="-ml-2 mr-2"
			/>
			Create Workout
		</BButton>
	</div>
	<div>
		<WorkoutList
			:workouts="workoutStore.resolvedWorkouts"
			@select-workout="onSelectWorkout"
			@delete-workout="onDeleteWorkout"
		/>
	</div>

	<WorkoutForm
		v-model="showWorkoutForm"
		:selected-workout="selectedWorkout"
	/>
</template>
