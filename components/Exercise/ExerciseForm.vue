<script setup lang="ts">
import type { Exercise, RepsExercise, TimeExercise } from '@/types/exercise'

const { selectedExercise, preventSubmit = false } = defineProps<{
	selectedExercise: Exercise | null
	preventSubmit?: boolean
}>()

const emits = defineEmits<{
	'submitExercise': [exercise: Exercise]
}>()

const openExerciseForm = defineModel<boolean>({ required: true, default: false })

const exerciseType = ref<'reps' | 'time' | null>(null)

function selectExerciseType(type: 'reps' | 'time') {
	exerciseType.value = type
}

watch(
	openExerciseForm,
	(newValue) => {
		if (!newValue && !selectedExercise) {
			exerciseType.value = null
		}
	},
)

watch(
	() => selectedExercise,
	(newExercise) => {
		if (newExercise) {
			exerciseType.value = newExercise.exercise_type
		}
	},
	{
		immediate: true,
	},
)

function goBackToTypeSelection() {
	exerciseType.value = null
}

function closeExerciseForm() {
	openExerciseForm.value = false
}

function onSubmitExercise(exercise: Exercise) {
	emits('submitExercise', exercise)
}
</script>

<template>
	<LazyBDrawer
		v-model="openExerciseForm"
		:enable-mutation-observer="true"
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
				<ExerciseFormTypeButton
					label="Repetitions"
					icon-name="material-symbols-rotate-right-rounded"
					@click="selectExerciseType('reps')"
				/>
				<ExerciseFormTypeButton
					label="Duration"
					icon-name="material-symbols-timer-outline-rounded"
					@click="selectExerciseType('time')"
				/>
			</div>
		</section>
		<section>
			<ExerciseFormReps
				v-if="exerciseType === 'reps'"
				:selected-exercise="(selectedExercise as RepsExercise)"
				:prevent-submit="preventSubmit"
				@submit-exercise="onSubmitExercise"
				@submit-form="closeExerciseForm"
			/>

			<ExerciseFormTime
				v-if="exerciseType === 'time'"
				:selected-exercise="(selectedExercise as TimeExercise)"
				:prevent-submit="preventSubmit"
				@submit-exercise="onSubmitExercise"
				@submit-form="closeExerciseForm"
			/>
		</section>
	</LazyBDrawer>
</template>
