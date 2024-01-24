<script setup lang="ts">
import type { RepsExercise } from '~/types/exercise'

defineProps<{
	item: RepsExercise
}>()
</script>

<template>
	<div class="flex space-x-2 items-center text-neutral-400">
		<BIcon name="material-symbols-rotate-right-rounded" />
		<span>{{ item.exercise_repetitions }} Repetions</span>
	</div>
</template>
