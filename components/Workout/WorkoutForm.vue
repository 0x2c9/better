<script setup lang="ts">
import type { Exercise } from '@/types/exercise'

import type { Workout } from '@/types/workout'

const { selectedWorkout } = defineProps<{
	selectedWorkout?: Workout | null
}>()

const openWorkoutForm = defineModel<boolean>({ required: true })

const exerciseStore = useExerciseStore()
const workoutStore = useWorkoutStore()

const showExerciseList = ref(false)

function openExerciseList() {
	showExerciseList.value = true
}

const workout = ref<Workout>({
	workout_name: '',
	workout_exercises: [],
	workout_sets: 1,
})

watch(
	() => openWorkoutForm.value,
	(isOpen) => {
		if (selectedWorkout && isOpen) {
			workout.value = JSON.parse(JSON.stringify(selectedWorkout)) as Workout
		} else if (!isOpen) {
			workout.value = {
				workout_name: '',
				workout_exercises: [],
				workout_sets: 1,
			}
		}
	},
	{
		immediate: true,
	},
)

function saveWorkout() {
	if (!workout.value.workout_name) {
		console.error('Workout name is required')
		return
	}

	if (selectedWorkout?.id) {
		workout.value.id = selectedWorkout.id
	}

	workoutStore.upsertWorkout(workout.value)
	openWorkoutForm.value = false
}

const exerciseCount = ref(0)
function addExerciseToWorkout(exercise: Exercise) {
	const clonedExercise = JSON.parse(JSON.stringify(exercise)) as Exercise
	clonedExercise.listId = `${exercise.id}-${exerciseCount.value}`
	workout.value.workout_exercises.push(clonedExercise)
	showExerciseList.value = false
	exerciseCount.value++
}

function deleteExerciseFromNewWorkout(exercise: Exercise) {
	const idx = workout.value.workout_exercises.findIndex((item) => item.listId === (exercise as Exercise).listId)
	workout.value.workout_exercises.splice(idx, 1)
}

const editedExercise = ref<Exercise | null>(null)
const showEditExerciseForm = ref(false)
function selectExerciseToUpdate(exercise: Exercise) {
	const idx = workout.value.workout_exercises.findIndex((item) => item.listId === (exercise as Exercise).listId)
	editedExercise.value = workout.value.workout_exercises[idx]
	showEditExerciseForm.value = true
}

function updateSelectedExercise(exercise: Exercise) {
	const idx = workout.value.workout_exercises.findIndex((item) => item.listId === (exercise as Exercise).listId)
	workout.value.workout_exercises[idx] = exercise
	showEditExerciseForm.value = false
}
</script>

<template>
	<LazyBDrawer
		v-model="openWorkoutForm"
		fullscreen
	>
		<template #header>
			<div class="flex items-center gap-x-4">
				<BInput
					v-model="workout.workout_name"
					class="w-full"
					placeholder="Workout Name"
				/>
				<BButton
					variant="primary"
					icon-name="material-symbols-add-rounded"
					@click="openExerciseList"
				/>
			</div>
		</template>
		<ExerciseList
			key-field="listId"
			:items="workout.workout_exercises"
			@select-exercise="selectExerciseToUpdate"
			@delete-exercise="deleteExerciseFromNewWorkout"
		/>

		<template #footer>
			<div class="flex flex-col items-center gap-6">
				<div class="flex w-full flex-row items-center gap-x-4">
					<BButton
						variant="secondary"
						small
						@click="openWorkoutForm = false"
					>
						Cancel
					</BButton>
					<BButton
						variant="primary"
						small
						class="flex-1"
						@click="saveWorkout"
					>
						Save Workout
					</BButton>
				</div>
			</div>
		</template>

		<ExerciseForm
			v-model="showEditExerciseForm"
			:selected-exercise="editedExercise"
			:prevent-submit="true"
			@submit-exercise="updateSelectedExercise"
		/>

		<LazyBDrawer
			v-model="showExerciseList"
			fullscreen
		>
			<ExerciseList
				:items="exerciseStore.exercises"
				:disable-delete="true"
				@select-exercise="addExerciseToWorkout"
			/>
		</LazyBDrawer>
	</LazyBDrawer>
</template>
