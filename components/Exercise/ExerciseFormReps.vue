<script setup lang="ts">
import type { RepsExercise } from '@/types/exercise'

const { selectedExercise, preventSubmit = false } = defineProps<{
	selectedExercise?: RepsExercise
	preventSubmit?: boolean
}>()

const emits = defineEmits<{
	'submitForm': [void]
	'submitExercise': [exercise: RepsExercise]
}>()

const exerciseStore = useExerciseStore()

const exercise = ref<RepsExercise>({
	exercise_name: '',
	exercise_type: 'reps',
	exercise_repetitions: 10,
})

watch(
	() => selectedExercise,
	(newExercise) => {
		if (newExercise) {
			exercise.value = { ...newExercise }
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
			v-model="exercise.exercise_repetitions"
			label="Repetitions"
			:min="1"
			:steps="1"
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
