<script setup lang="ts">
import type { Exercise, TimeExercise } from '~/types/exercise'
import type { Workout, WorkoutEntry } from '~/types/workout'

definePageMeta({
	layout: 'empty',
	auth: true,
})

const workoutStore = useWorkoutStore()
const route = useRoute()

const selectedWorkout = ref<Workout>()
const workoutExercises = ref<Exercise[][]>([])

onMounted(async () => {
	selectedWorkout.value = await workoutStore.getWorkoutById(route.params.workoutId as string)
	for (let i = 0; i < selectedWorkout.value.workout_sets; i++) {
		const duplicatedExercises = JSON.parse(JSON.stringify(selectedWorkout.value.workout_exercises)) as Exercise[]
		workoutExercises.value[i] = duplicatedExercises.map((exercise) => {
			exercise.listId = `${exercise.listId}-${i}`

			return exercise
		})
	}
})

const openExerciseForm = ref(false)
const selectedExercise = ref<Exercise | null>(null)
const activeSet = ref(1)

function onSelectExercise(item: Exercise) {
	selectedExercise.value = item
	openExerciseForm.value = true
}

function onExerciseChange(updatedExercise: Exercise) {
	openExerciseForm.value = false
	const index = workoutExercises.value[activeSet.value - 1].findIndex((exercise) => {
		return exercise.listId === updatedExercise.listId
	})

	if (index !== -1) {
		workoutExercises.value[activeSet.value - 1][index] = updatedExercise
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

function onGoBack() {
	// TODO: show confirm modal
	navigateTo('/workouts')
}

function onSaveWorkout() {
	if (!selectedWorkout.value) {
		return
	}
	const payload: WorkoutEntry = {
		workout_name: selectedWorkout.value.workout_name,
		workout_exercises: workoutExercises.value,
		workout_sets: selectedWorkout.value.workout_sets,
	}
	workoutStore.saveWorkoutEntry(payload)
}

const computedWorkoutExercises = computed(() => {
	return workoutExercises.value[activeSet.value - 1]
})
</script>

<template>
	<article class="relative flex flex-col h-full">
		<div class="flex-1 overflow-y-auto px-4 py-6">
			<WorkoutExerciseList
				v-if="selectedWorkout"
				key-field="listId"
				:items="computedWorkoutExercises"
				:disable-delete="true"
				@select-exercise="onSelectExercise"
				@start-exercise="onStartExercise"
			/>
		</div>

		<ExerciseForm
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
		<footer class="px-4 border border-t-2 border-neutral-700/50">
			<nav
				class="py-2 z-50 b-box flex flex-col justify-center px-4 my-6 "
			>
				<BStepper
					v-model="activeSet"
					label="Current Set"
					:max="selectedWorkout?.workout_sets"
					:steps="1"
					:computed-display-value="`${activeSet}/${selectedWorkout?.workout_sets}`"
				/>
				<div class="mt-6 flex gap-6">
					<BButton
						variant="secondary"
						icon-name="material-symbols-arrow-back-rounded"
						@click="onGoBack"
					/>
					<BButton
						class="flex-1"
						@click="onSaveWorkout"
					>
						Save Workout
					</BButton>
				</div>
			</nav>
		</footer>
	</article>
</template>
