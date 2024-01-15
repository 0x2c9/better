<script setup lang="ts">
import type { IExercise } from '@/types/exercise'

const { selectedExercise } = defineProps<{
	selectedExercise?: IExercise | null
}>()

const emits = defineEmits<{
	'submitForm': [void]
}>()

const exerciseStore = useExerciseStore()

const { secondsIntoMinutes } = useUtils()

const exerciseName = ref('')
const exerciseType = ref<'reps' | 'duration' | null>(null)
const exerciseDuration = ref(10)
const exerciseRepetions = ref(5)

function selectExerciseType(type: 'reps' | 'duration') {
	exerciseType.value = type
}

watch(
	() => selectedExercise,
	(newExercise) => {
		if (newExercise) {
			exerciseName.value = newExercise.exercise_name
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
	if (!exerciseName.value) {
		return
	}
	emits('submitForm')

	const formData: IExercise = {
		exercise_name: exerciseName.value,
		exercise_type: exerciseType.value as 'reps' | 'duration',
		exercise_duration: exerciseDuration.value,
		exercise_repetions: exerciseRepetions.value,
	}

	if (selectedExercise?.id) {
		formData.id = selectedExercise.id
	}

	exerciseStore.upsertExercise(formData)
}

function goBackToTypeSelection() {
	exerciseType.value = null
	exerciseName.value = ''
	exerciseDuration.value = 10
	exerciseRepetions.value = 5
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
					class="flex flex-col items-center justify-center min-h-32 rounded-xl"
					type="button"
					small
					@click="selectExerciseType('reps')"
				>
					<BIcon
						class="text-neutral-400 mb-2"
						size="28"
						name="material-symbols-rotate-right-rounded"
					/>
					<span class="uppercase tracking-wider font-bold text-neutral-100">Repetition</span>
				</BButton>
				<BButton
					class="flex flex-col items-center justify-center min-h-32 rounded-xl"
					type="button"
					small
					@click="selectExerciseType('duration')"
				>
					<BIcon
						class="text-neutral-400 mb-2"
						size="28"
						name="material-symbols-timer-outline-rounded"
					/>
					<span class="uppercase tracking-wider font-bold text-neutral-100">Duration</span>
				</BButton>
			</div>
		</section>
		<section
			v-if="exerciseType"
			class="space-y-6"
		>
			<BInput
				v-model="exerciseName"
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
		</section>
	</form>
</template>
