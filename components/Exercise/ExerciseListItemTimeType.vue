<script setup lang="ts">
import type { IExercise } from '~/types/exercise'

defineProps<{
	item: IExercise
}>()

const { secondsIntoMinutes } = useUtils()
</script>

<template>
	<div class="flex space-x-2 items-center text-neutral-400">
		<BIcon name="material-symbols-timer-outline-rounded" />
		<span>{{ secondsIntoMinutes(item.exercise_training_time) }}</span>
	</div>
</template>
