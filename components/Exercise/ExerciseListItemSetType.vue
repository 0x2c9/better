<script setup lang="ts">
import type { IExercise } from '~/types/exercise'

defineProps<{
	item: IExercise
}>()

const { secondsIntoMinutes } = useUtils()
</script>

<template>
	<div class="flex items-center justify-between tabular-nums text-neutral-400">
		<div class="flex space-x-2 items-center">
			<BIcon name="material-symbols-rotate-right-rounded" />
			<span>{{ item.exercise_sets }} Sets</span>
		</div>
		<div class="flex space-x-2 items-center">
			<BIcon name="material-symbols-timer-outline-rounded" />
			<span>{{ secondsIntoMinutes(item.exercise_training_time) }}</span>
		</div>
		<div class="flex space-x-2 items-center">
			<BIcon name="material-symbols-motion-photos-paused-outline-rounded" />
			<span>{{ secondsIntoMinutes(item.exercise_pause_time) }}</span>
		</div>
	</div>
</template>
