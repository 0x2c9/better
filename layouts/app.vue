<script setup lang="ts">
const authStore = useAuthStore()
const timerStore = useTimerStore()
const weightStore = useWeightStore()
const exerciseStore = useExerciseStore()
const workoutStore = useWorkoutStore()

onMounted(async () => {
	if (!authStore.isAuthenticated) {
		return
	}

	await timerStore.getTimers()
	await weightStore.fetchWeightHistory()
	await exerciseStore.getExercises()
	await workoutStore.getWorkouts()
})
</script>

<template>
	<div
		id="__layout"
		class="flex size-full flex-col overflow-hidden"
	>
		<main
			class="flex flex-1 flex-col overflow-y-scroll px-4 pb-20 pt-8"
		>
			<slot class="flex-1" />
		</main>
		<AppNavigation />
	</div>
</template>
