<script setup lang="ts">
import type { Exercise, TimeExercise } from '~/types/exercise'
import type { Workout } from '~/types/workout'

definePageMeta({
	layout: 'app',
	auth: true,
})

const workoutStore = useWorkoutStore()
const route = useRoute()

const selectedWorkout = ref<Workout | null>(null)
watch(
	() => workoutStore.workouts,
	(newWorkouts) => {
		if (!newWorkouts?.length) {
			return
		}
		const foundWorkout = newWorkouts.find((workout) => workout.id === route.params.id)!
		// TODO: figure out why spreading the object doesnt copy
		selectedWorkout.value = JSON.parse(JSON.stringify(foundWorkout))
	},
	{
		immediate: true,
	},
)

const openExerciseForm = ref(false)
const selectedExercise = ref<Exercise | null>(null)

function onSelectExercise(item: Exercise) {
	selectedExercise.value = item
	openExerciseForm.value = true
}

function onExerciseChange(updatedExercise: Exercise) {
	openExerciseForm.value = false
	const index = selectedWorkout.value!.workout_exercises.findIndex((exercise) => exercise.listId === updatedExercise.listId)

	if (index !== -1) {
		selectedWorkout.value!.workout_exercises[index] = updatedExercise
	}
}

const timedExercise = ref<TimeExercise | null>(null)

function onStartExercise(item: TimeExercise) {
	timedExercise.value = item
}

function onStopTimer() {
	timedExercise.value = null
}

function onDoneTimer(exercise: Exercise) {
	timedExercise.value = null
	for (const workoutExercise of selectedWorkout.value!.workout_exercises) {
		if (workoutExercise.id === exercise.id) {
			workoutExercise.done = true
		}
	}
}

function onSaveWorkout() {
	workoutStore.saveWorkoutEntry(selectedWorkout.value!)
}
</script>

<template>
	<article class="relative">
		<WorkoutExerciseList
			v-if="selectedWorkout"
			key-field="listId"
			:items="selectedWorkout.workout_exercises"
			:disable-delete="true"
			@select-exercise="onSelectExercise"
			@start-exercise="onStartExercise"
		/>
		<BButton @click="onSaveWorkout">
			Save Workout
		</BButton>

		<ExerciseForm
			v-if="openExerciseForm"
			v-model="openExerciseForm"
			:selected-exercise="selectedExercise"
			:prevent-submit="true"
			@submit-exercise="onExerciseChange"
		/>

		<Teleport to="body">
			<TimerIntervalClock
				v-if="timedExercise"
				:exercise="timedExercise"
				@stop="onStopTimer"
				@done="onDoneTimer"
			/>
		</Teleport>
	</article>
</template>
