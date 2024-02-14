<script setup lang="ts">
const authStore = useAuthStore()
const weightStore = useWeightStore()
const exerciseStore = useExerciseStore()
const workoutStore = useWorkoutStore()
const globalState = useGlobalState()

onMounted(async () => {
	if (!authStore.isAuthenticated) {
		return
	}
	globalState.loaded = false

	await Promise.all([
		weightStore.fetchWeightHistory(),
		exerciseStore.getExercises(),
		workoutStore.getWorkouts(),
		workoutStore.getWorkoutEntries(),
	])

	globalState.loaded = true
})
</script>

<template>
	<div
		id="__layout"
		class="flex size-full flex-col overflow-hidden"
	>
		<main
			class="flex flex-1 flex-col overflow-y-scroll px-4 pb-[132px] pt-8"
		>
			<slot class="flex-1"></slot>
		</main>
		<AppNavigation />
		<ClientOnly>
			<LazyAppUpdatePrompt />
			<LazyAppOnboarding />
		</ClientOnly>
	</div>
</template>
