<script setup lang="ts">
const authStore = useAuthStore()
const timerStore = useTimerStore()
const weightStore = useWeightStore()

onMounted(async () => {
	if (!authStore.isAuthenticated) {
		return
	}

	await timerStore.getTimers()
	await weightStore.fetchWeightHistory()
})
</script>

<template>
	<div
		id="__layout"
		class="flex h-full w-full flex-col overflow-hidden"
	>
		<SvgSprite />
		<main class="flex flex-col flex-1 overflow-y-scroll px-4 pt-8 pb-20">
			<slot class="flex-1" />
		</main>
		<AppNavigation />
	</div>
</template>
