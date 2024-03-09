<script setup lang="ts">
import type { RepsExercise } from '~/types/exercise'

defineProps<{
	item: RepsExercise
}>()
</script>

<template>
	<div class="flex items-center space-x-2 text-gray-medium">
		<BIcon class="text-gray-medium" name="material-symbols-rotate-right-rounded" />
		<span>{{ item.exercise_repetitions }} Repetions</span>
	</div>
</template>
