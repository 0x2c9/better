<script setup lang="ts">
import type { IExercise } from '@/types/exercise'

const { selectedExercise } = defineProps<{
	selectedExercise?: IExercise | null
}>()

const emits = defineEmits<{
	submit: [void]
}>()

const selectedExerciseTypeOption = ref(0)
const exerciseTypeOptions = [
	{
		label: 'Reps',
		content: 'reps',
	},
	{
		label: 'Duration',
		content: 'duration',
	},
]
const exerciseStore = useExerciseStore()

const { secondsIntoMinutes } = useUtils()

const name = ref('')
const exerciseType = ref('reps')
const exerciseDuration = ref(10)
const exerciseRepetions = ref(5)

watch(
	() => selectedExercise,
	(newExercise) => {
		if (newExercise) {
			selectedExerciseTypeOption.value = exerciseTypeOptions.findIndex((option) => option.content === newExercise.exercise_type)
			name.value = newExercise.name
			exerciseType.value = newExercise.exercise_type
			exerciseDuration.value = newExercise.exercise_duration
			exerciseRepetions.value = newExercise.exercise_repetions
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
	if (!name.value) {
		return
	}
	emits('submit')

	const formData: IExercise = {
		name: name.value,
		exercise_type: exerciseType.value as 'reps' | 'duration',
		exercise_duration: exerciseDuration.value,
		exercise_repetions: exerciseRepetions.value,
	}

	if (selectedExercise?.id) {
		formData.id = selectedExercise.id
	}

	exerciseStore.upsertExercise(formData)
}

watch(
	() => selectedExerciseTypeOption.value,
	(newIdx) => {
		exerciseType.value = exerciseTypeOptions[newIdx].content
	},
)
</script>

<template>
	<form
		class="space-y-4"
		@submit="onEnter"
	>
		<BSwitch
			v-model="selectedExerciseTypeOption"
			class="mb-4"
			:options="exerciseTypeOptions"
		/>

		<BInput
			v-model="name"
			label="Exercise Name"
			placeholder="Exercise Name"
			required
		/>

		<BStepper
			v-if="exerciseType === 'duration'"
			v-model="exerciseDuration"
			label="Duration"
			:min="10"
			:steps="1"
			:display-value="secondsIntoMinutes(exerciseDuration)"
		/>

		<BStepper
			v-if="exerciseType === 'reps'"
			v-model="exerciseRepetions"
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
