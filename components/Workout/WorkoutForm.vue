<script setup lang="ts">
import type { IExercise } from '@/types/exercise'

import type { IWorkout, IWorkoutExercise, IWorkoutResolved } from '@/types/workout'

const { selectedWorkout } = defineProps<{
	selectedWorkout?: IWorkoutResolved | null
}>()

const openWorkoutForm = defineModel<boolean>({ required: true })

const exerciseStore = useExerciseStore()
const workoutStore = useWorkoutStore()
const workoutName = ref('')
const workoutExercises = ref<IWorkoutExercise[]>([])
const showExerciseList = ref(false)

watch(
	() => openWorkoutForm.value,
	(isOpen) => {
		if (selectedWorkout && isOpen) {
			workoutName.value = selectedWorkout.name
			workoutExercises.value = selectedWorkout.resolvedExercises.map((item, idx) => {
				const clonedExercise = JSON.parse(JSON.stringify(item)) as IWorkoutExercise
				clonedExercise.listId = `${item.id}-${idx}`
				return clonedExercise
			})
		} else if (!isOpen) {
			workoutName.value = ''
			workoutExercises.value = []
		}
	},
	{
		immediate: true,
	},
)

function createWorkout() {
	if (!workoutName.value) {
		console.error('Workout name is required')
		return
	}
	const exerciseIds = workoutExercises.value.map((item) => item.id!)
	const workoutPayload: IWorkout = {
		name: workoutName.value,
		exercise_ids: exerciseIds,
	}

	if (selectedWorkout?.id) {
		workoutPayload.id = selectedWorkout.id
	}

	workoutStore.upsertWorkout(workoutPayload)
	openWorkoutForm.value = false
}

const index = ref(0)
function onSelectExercise(exercise: IExercise) {
	const clonedExercise = JSON.parse(JSON.stringify(exercise)) as IWorkoutExercise
	clonedExercise.listId = `${exercise.id}-${index.value}`
	workoutExercises.value.push(clonedExercise)
	showExerciseList.value = false
	index.value++
}

function onDeleteExercise(exercise: IExercise) {
	const idx = workoutExercises.value.findIndex((item) => item.listId === (exercise as IWorkoutExercise).listId)
	workoutExercises.value.splice(idx, 1)
}

function openExerciseList() {
	showExerciseList.value = true
}
</script>

<template>
	<LazyBDrawer
		v-model="openWorkoutForm"
		title="Create Workout"
		fullscreen
	>
		<ExerciseList
			key-field="listId"
			:items="workoutExercises"
			@delete-exercise="onDeleteExercise"
		/>

		<template #footer>
			<div class="flex flex-col items-center gap-6">
				<div class="flex items-end gap-4">
					<BInput
						v-model="workoutName"
						label="Workout Name"
						placeholder="Workout Name"
					/>
					<BButton
						variant="secondary"
						icon-name="material-symbols-add-rounded"
						@click="openExerciseList"
					/>
				</div>
				<BButton
					class="w-full"
					variant="primary"
					@click="createWorkout"
				>
					Save Workout
				</BButton>
			</div>
		</template>

		<BDrawer
			v-model="showExerciseList"
			title="Select Exercise for Workout"
			fullscreen
		>
			<ExerciseList
				:items="exerciseStore.exercises"
				:disable-delete="true"
				@select-exercise="onSelectExercise"
			/>
		</BDrawer>
	</LazyBDrawer>
</template>
