<script setup lang="ts">
import type { Exercise } from '~/types/exercise'

const { item } = defineProps<{
	item: Exercise
}>()

const { secondsIntoMinutes } = useUtils()
</script>

<template>
	<div class="flex-1">
		<div class="flex items-center justify-between">
			<h2 class="text-lg font-semibold">
				{{ item.exercise_name }}
			</h2>
			<ExerciseListItemRepType
				v-if="item.exercise_type === 'reps'"
				:item="item"
			/>
			<ExerciseListItemTimeType
				v-if="item.exercise_type === 'time' && item.exercise_sets === 1"
				:item="item"
			/>
			<span
				v-if="item.exercise_type === 'time' && item.exercise_sets > 1"
				class="text-black"
			>
				{{ secondsIntoMinutes(item.exercise_duration) }}
			</span>
		</div>

		<ExerciseListItemSetType
			v-if="item.exercise_type === 'time' && item.exercise_sets > 1"
			class="mt-4"
			:item="item"
		/>
	</div>
</template>
