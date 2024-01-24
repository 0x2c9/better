<script setup lang="ts">
import type { IExercise } from '~/types/exercise'
import type { IWorkoutResolved } from '~/types/workout'

definePageMeta({
	layout: 'app',
	auth: true,
})

const workoutStore = useWorkoutStore()
const route = useRoute()

const selectedWorkout = ref<IWorkoutResolved | null>(null)
watch(
	() => workoutStore.resolvedWorkouts,
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
const selectedExercise = ref<IExercise | null>(null)
function onSelectExercise(item: IExercise) {
	selectedExercise.value = item
	openExerciseForm.value = true
	console.log(item)
}

function onExerciseChange(updatedExercise: IExercise) {
	openExerciseForm.value = false
	console.log(updatedExercise)
	const index = selectedWorkout.value!.resolvedExercises.findIndex((exercise) => exercise.id === updatedExercise.id)
	if (index !== -1) {
		selectedWorkout.value!.resolvedExercises[index] = updatedExercise
	}
}

const timedExercise = ref<IExercise | null>(null)

function onStartExercise(item: IExercise) {
	console.log(item)
	timedExercise.value = item
}

function onStopTimer() {
	timedExercise.value = null
	console.log('stop?')
}

function onDoneTimer(exercise: IExercise) {
	timedExercise.value = null
	for (const workoutExercise of selectedWorkout.value!.resolvedExercises) {
		if (workoutExercise.id === exercise.id) {
			workoutExercise.done = true
		}
	}
}

function onSaveWorkout() {
	workoutStore.saveWorkoutEntry(selectedWorkout.value)
}
</script>

<template>
	<article class="relative">
		<WorkoutExerciseList
			v-if="selectedWorkout"
			:items="selectedWorkout.resolvedExercises"
			:disable-delete="true"
			@select-exercise="onSelectExercise"
			@start-exercise="onStartExercise"
		/>
		<BButton @click="onSaveWorkout">
			Save Workout
		</BButton>
		<LazyBDrawer
			v-model="openExerciseForm"
		>
			<ExerciseForm
				:selected-exercise="selectedExercise"
				:prevent-submit="true"
				@submit-exercise="onExerciseChange"
			/>
		</LazyBDrawer>

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
