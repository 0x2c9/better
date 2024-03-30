<script setup lang="ts">
import type { TimeExercise } from '~/types/exercise'

const { columnMode = false } = defineProps<{
	item: TimeExercise
	columnMode?: boolean
}>()
</script>

<template>
	<div
		class="flex tabular-nums text-gray-medium"
		:class="{
			'flex-col space-y-1': columnMode,
			'items-center justify-between': !columnMode,
		}"
	>
		<div class="flex items-center space-x-2">
			<BIcon class="text-gray-medium" name="material-symbols-rotate-right-rounded" />
			<span>{{ item.exercise_sets }} Sets</span>
		</div>
		<div class="flex items-center space-x-2">
			<BIcon class="text-gray-medium" name="material-symbols-timer-outline-rounded" />
			<span>{{ secondsIntoMinutes(item.exercise_training_time) }}</span>
		</div>
		<div class="flex items-center space-x-2">
			<BIcon class="text-gray-medium" name="material-symbols-motion-photos-paused-outline-rounded" />
			<span>{{ secondsIntoMinutes(item.exercise_pause_time) }}</span>
		</div>
	</div>
</template>
