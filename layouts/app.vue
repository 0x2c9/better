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
		class="flex h-full w-full flex-col overflow-hidden "
	>
		<header class="fixed z-50 bg-white border-b border-b-neutral-200 inset-x-0 top-0 flex h-[64px] items-center justify-center px-4 pt-2">
			<nav class="z-10 flex w-full max-w-7xl items-center justify-between">
				<Logo />
			</nav>
		</header>
		<main class="flex flex-col flex-1 overflow-y-scroll px-4 pt-20 pb-[64px]">
			<slot class="flex-1" />
		</main>
	</div>
</template>
