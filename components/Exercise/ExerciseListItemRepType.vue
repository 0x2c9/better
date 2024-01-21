<script setup lang="ts">
import type { IExercise } from '~/types/exercise'

defineProps<{
	item: IExercise
}>()
</script>

<template>
	<div class="flex space-x-2 items-center text-neutral-400">
		<BIcon name="material-symbols-rotate-right-rounded" />
		<span>{{ item.exercise_repetions }} Repetions</span>
	</div>
</template>
