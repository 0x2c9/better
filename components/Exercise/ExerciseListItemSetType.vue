<script setup lang="ts">
import type { TimeExercise } from '~/types/exercise'

const { columnMode = false } = defineProps<{
	item: TimeExercise
	columnMode?: boolean
}>()

const { secondsIntoMinutes } = useUtils()
</script>

<template>
	<div
		class="flex tabular-nums text-neutral-400"
		:class="{
			'flex-col space-y-1': columnMode,
			'items-center justify-between': !columnMode,
		}"
	>
		<div class="flex items-center space-x-2">
			<BIcon name="material-symbols-rotate-right-rounded" />
			<span>{{ item.exercise_sets }} Sets</span>
		</div>
		<div class="flex items-center space-x-2">
			<BIcon name="material-symbols-timer-outline-rounded" />
			<span>{{ secondsIntoMinutes(item.exercise_training_time) }}</span>
		</div>
		<div class="flex items-center space-x-2">
			<BIcon name="material-symbols-motion-photos-paused-outline-rounded" />
			<span>{{ secondsIntoMinutes(item.exercise_pause_time) }}</span>
		</div>
	</div>
</template>
