<script setup lang="ts">
import type { IExercise } from '@/types/exercise'

const { selectedExercise } = defineProps<{
	selectedExercise?: IExercise | null
}>()

const emits = defineEmits<{
	'submitForm': [void]
}>()

const selectedDurationTypeOption = ref(0)
const durationTypeOptions = [
	{
		label: 'Single',
		content: 'single',
	},
	{
		label: 'Sets',
		content: 'sets',
	},
]

const exerciseStore = useExerciseStore()

const { secondsIntoMinutes } = useUtils()

const exerciseName = ref('')
const exerciseType = ref<'reps' | 'time' | null>(null)
const exerciseTrainingTime = ref(45)
const exerciseRepetions = ref(10)
const exerciseSets = ref(2)
const exercisePauseTime = ref(10)

function selectExerciseType(type: 'reps' | 'time') {
	exerciseType.value = type
}

watch(
	() => selectedExercise,
	(newExercise) => {
		if (newExercise) {
			exerciseName.value = newExercise.exercise_name
			exerciseType.value = newExercise.exercise_type
			exerciseTrainingTime.value = newExercise.exercise_training_time
			exerciseRepetions.value = newExercise.exercise_repetions
			exerciseSets.value = newExercise.exercise_sets
			exercisePauseTime.value = newExercise.exercise_pause_time
			selectedDurationTypeOption.value = durationTypeOptions.findIndex(
				(option) => option.content === newExercise.exercise_duration_type,
			)
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
	if (!exerciseName.value) {
		return
	}
	emits('submitForm')

	const formData: IExercise = {
		exercise_name: exerciseName.value,
		exercise_type: exerciseType.value as 'reps' | 'time',
		exercise_training_time: exerciseTrainingTime.value,
		exercise_pause_time: exercisePauseTime.value,
		exercise_sets: exerciseSets.value,
		exercise_repetions: exerciseRepetions.value,
		exercise_duration_type: durationTypeOptions[selectedDurationTypeOption.value].content as 'single' | 'sets',
		exercise_set_duration: (exerciseTrainingTime.value + exercisePauseTime.value) * exerciseSets.value,
	}

	if (selectedExercise?.id) {
		formData.id = selectedExercise.id
	}

	exerciseStore.upsertExercise(formData)
}

function goBackToTypeSelection() {
	exerciseType.value = null
	exerciseName.value = ''
	exerciseTrainingTime.value = 10
	exerciseRepetions.value = 5
	exerciseSets.value = 2
	exercisePauseTime.value = 10
	selectedDurationTypeOption.value = 0
}
</script>

<template>
	<form
		@submit.prevent="onEnter"
	>
		<button
			v-if="exerciseType && !selectedExercise"
			class="mb-6 "
			type="button"
			@click="goBackToTypeSelection"
		>
			<BIcon
				name="material-symbols-arrow-back-rounded"
				size="24"
			/>
		</button>
		<section v-if="!exerciseType">
			<h2 class="text-lg font-medium mb-6">
				Select Exercise Type
			</h2>
			<div class="grid grid-cols-2 gap-6">
				<BButton
					class="flex flex-col items-center justify-center min-h-32 rounded-xl relative overflow-hidden"
					type="button"
					small
					@click="selectExerciseType('reps')"
				>
					<BIcon
						class="text-neutral-700/50 absolute -top-1 -left-3 z-0 transform rotate-12"
						size="120"
						name="material-symbols-rotate-right-rounded"
					/>
					<span class="font-bold text-xl text-neutral-100 z-10">Repetition</span>
				</BButton>
				<BButton
					class="flex flex-col items-center justify-center min-h-32 rounded-xl relative overflow-hidden"
					type="button"
					small
					@click="selectExerciseType('time')"
				>
					<BIcon
						class="text-neutral-700/50 absolute -top-1 -left-3 z-0 transform rotate-12"
						size="120"
						name="material-symbols-timer-outline-rounded"
					/>
					<span class="font-bold text-xl text-neutral-100 z-10">Duration</span>
				</BButton>
			</div>
		</section>
		<section
			v-if="exerciseType"
			class="space-y-6"
		>
			<BSwitch
				v-if="exerciseType === 'time' && !selectedExercise"
				v-model="selectedDurationTypeOption"
				:options="durationTypeOptions"
			/>

			<BInput
				v-model="exerciseName"
				label="Exercise Name"
				placeholder="Exercise Name"
				required
			/>

			<BStepper
				v-if="exerciseType === 'time' && selectedDurationTypeOption === 1"
				v-model="exerciseSets"
				label="Sets"
				:steps="1"
				:min="1"
				:display-value="exerciseSets"
			/>

			<BStepper
				v-if="exerciseType === 'time'"
				v-model="exerciseTrainingTime"
				label="Duration"
				:min="10"
				:steps="1"
				:display-value="secondsIntoMinutes(exerciseTrainingTime)"
			/>

			<BStepper
				v-if="exerciseType === 'time' && selectedDurationTypeOption === 1"
				v-model="exercisePauseTime"
				label="Rest"
				:min="0"
				:steps="1"
				:display-value="secondsIntoMinutes(exercisePauseTime)"
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
		</section>
	</form>
</template>
