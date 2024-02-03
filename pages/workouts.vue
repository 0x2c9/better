<script setup lang="ts">
import type { Workout } from '@/types/workout'

definePageMeta({
	layout: 'app',
	auth: true,
})

const workoutStore = useWorkoutStore()

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
</script>

<template>
	<article class="relative">
		<BPageActionButton @click="openWorkout">
			<BIcon
				name="material-symbols-add-rounded"
				class="-ml-2 mr-2"
			/>
			Create Workout
		</BPageActionButton>

		<div>
			<WorkoutList
				:workouts="workoutStore.workouts"
				@select-workout="onSelectWorkout"
				@delete-workout="onDeleteWorkout"
			/>
		</div>

		<WorkoutForm
			v-model="showWorkoutForm"
			:selected-workout="selectedWorkout"
		/>
	</article>
</template>
