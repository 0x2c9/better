<script setup lang="ts">
import type { IExercise } from '~/types/exercise'

defineProps<{
	item: IExercise
}>()

const { secondsIntoMinutes } = useUtils()
</script>

<template>
	<div class="flex-1">
		<div class="flex items-center justify-between">
			<h2 class="text-lg font-medium">
				{{ item.exercise_name }}
			</h2>
			<ExerciseListItemRepType
				v-if="item.exercise_type === 'reps'"
				:item="item"
			/>
			<ExerciseListItemTimeType
				v-if="item.exercise_type === 'time' && item.exercise_duration_type === 'single'"
				:item="item"
			/>
			<span
				v-if="item.exercise_duration_type === 'sets'"
				class="text-neutral-200"
			>
				{{ secondsIntoMinutes(item.exercise_set_duration) }}
			</span>
		</div>

		<ExerciseListItemSetType
			v-if="item.exercise_duration_type === 'sets'"
			class="mt-4"
			:item="item"
		/>
	</div>
</template>
