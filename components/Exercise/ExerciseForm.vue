<script setup lang="ts">
import type { Exercise, RepsExercise, TimeExercise } from '@/types/exercise'

const { selectedExercise, preventSubmit = false } = defineProps<{
	selectedExercise: Exercise | null
	preventSubmit?: boolean
}>()

const emits = defineEmits<{
	submitExercise: [exercise: Exercise]
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
	<ClientOnly>
		<LazyBDrawer
			v-model="openExerciseForm"
		>
			<button
				v-if="exerciseType && !selectedExercise"
				class="mb-4"
				type="button"
				@click="goBackToTypeSelection"
			>
				<BIcon
					name="material-symbols-arrow-back-rounded"
					size="24"
				/>
			</button>
			<section v-if="!exerciseType">
				<h2 class="mb-6 text-lg font-medium">
					Select Exercise Type
				</h2>
				<div class="flex flex-col gap-y-4">
					<BButton
						class="flex items-start"
						variant="secondary"
						@click="selectExerciseType('reps')"
					>
						<BIcon name="material-symbols-rotate-right-rounded" class="-ml-2 mr-2" />
						Repetitions
					</BButton>
					<BButton
						class="flex items-start"
						variant="secondary"
						@click="selectExerciseType('time')"
					>
						<BIcon name="material-symbols-timer-outline-rounded" class="-ml-2 mr-2" />
						Duration
					</BButton>
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
	</ClientOnly>
</template>
