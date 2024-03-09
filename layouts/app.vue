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

const isSettingsPage = useRoute().path === '/settings'
</script>

<template>
	<div
		id="__layout"
		class="flex size-full flex-col overflow-hidden"
	>
		<main
			class="flex flex-1 flex-col overflow-y-scroll px-4 pt-8"
			:class="{
				'pb-[132px]': !isSettingsPage,
				'pb-[84px]': isSettingsPage,
			}"
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
