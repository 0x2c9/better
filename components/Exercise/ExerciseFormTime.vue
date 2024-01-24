<script setup lang="ts">
import type { TimeExercise } from '@/types/exercise'

const { selectedExercise, preventSubmit = false } = defineProps<{
	selectedExercise?: TimeExercise
	preventSubmit?: boolean
}>()

const emits = defineEmits<{
	'submitForm': [void]
	'submitExercise': [exercise: TimeExercise]
}>()

const exerciseStore = useExerciseStore()

const { secondsIntoMinutes } = useUtils()

const exercise = ref<TimeExercise>({
	exercise_name: '',
	exercise_type: 'time',
	exercise_training_time: 30,
	exercise_pause_time: 5,
	exercise_sets: 1,
	exercise_duration: 35,
})

watch(
	() => exercise.value.exercise_sets,
	(newSets, oldSets) => {
		if (newSets === 1) {
			exercise.value.exercise_pause_time = 0
		}

		if (oldSets === 1 && newSets > 1) {
			exercise.value.exercise_pause_time = 5
		}
	},
	{
		immediate: true,
	},
)

watch(
	() => selectedExercise,
	(newExercise) => {
		if (newExercise) {
			exercise.value = newExercise
		}
	},
	{
		immediate: true,
	},
)

const activeElement = useActiveElement()

function onEnter() {
	activeElement.value?.blur()
}

async function onSubmit() {
	if (!exercise.value.exercise_name) {
		console.error('[TODO: show error message] - exercise name is required')
		return
	}
	exercise.value.exercise_duration = ((exercise.value.exercise_training_time + exercise.value.exercise_pause_time) * exercise.value.exercise_sets) - exercise.value.exercise_pause_time
	emits('submitForm')

	if (selectedExercise?.id) {
		exercise.value.id = selectedExercise.id
	}

	if (preventSubmit) {
		emits('submitExercise', exercise.value)
		return
	}

	exerciseStore.upsertExercise(exercise.value)
}
</script>

<template>
	<form
		class="space-y-6"
		@submit.prevent="onEnter"
	>
		<BInput
			v-model="exercise.exercise_name"
			label="Exercise Name"
			placeholder="Exercise Name"
			required
		/>

		<BStepper
			v-model="exercise.exercise_sets"
			label="Sets"
			:steps="1"
			:min="1"
			:display-value="exercise.exercise_sets"
		/>

		<BStepper
			v-model="exercise.exercise_training_time"
			label="Duration"
			:min="10"
			:steps="1"
			:display-value="secondsIntoMinutes(exercise.exercise_training_time)"
		/>

		<BStepper
			v-model="exercise.exercise_pause_time"
			:disabled="exercise.exercise_sets === 1"
			label="Rest"
			:min="0"
			:steps="1"
			:display-value="secondsIntoMinutes(exercise.exercise_pause_time)"
		/>

		<BButton
			type="button"
			variant="primary"
			class="!mt-10 w-full"
			@click="onSubmit"
		>
			Save
		</BButton>
	</form>
</template>
