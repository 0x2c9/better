<script setup lang="ts">
definePageMeta({
	layout: 'app',
})
const selectedPageModeIndex = ref(0)
const pageModeOptions = [
	{
		label: 'Workouts',
		content: 'workout',
	},
	{
		label: 'Exercises',
		content: 'exercise',
	},
]
</script>

<template>
	<article class="relative">
		<div class="mb-8">
			<BSwitch
				v-model="selectedPageModeIndex"
				:options="pageModeOptions"
			/>
		</div>

		<WorkoutPage
			v-if="pageModeOptions[selectedPageModeIndex].content === 'workout'"
		/>

		<ExercisePage
			v-if="pageModeOptions[selectedPageModeIndex].content === 'exercise'"
		/>
	</article>
</template>
