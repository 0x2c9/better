<script setup lang="ts">
import type { TimeExercise } from '~/types/exercise'

defineProps<{
	item: TimeExercise
}>()

const { secondsIntoMinutes } = useUtils()
</script>

<template>
	<div class="flex items-center space-x-2 text-gray-medium">
		<BIcon class="text-gray-medium" name="material-symbols-timer-outline-rounded" />
		<span>{{ secondsIntoMinutes(item.exercise_training_time) }}</span>
	</div>
</template>
