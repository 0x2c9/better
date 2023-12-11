<script setup lang="ts">
const authStore = useAuthStore()

const computedLinkProps = computed(() => {
	return {
		to: authStore.isAuthenticated ? '/home' : '/',
		ariaLabel: authStore.isAuthenticated ? 'Go to home page' : 'Go to landing page',
	}
})
</script>

<template>
	<NuxtLink
		:to="computedLinkProps.to"
		:aria-label="computedLinkProps.ariaLabel"
	>
		<div class="flex items-center gap-4">
			<div class="logo relative flex h-10 w-10 items-center justify-center">
				<div class="ball h-5 w-5 rounded-full bg-gradient-to-b from-black via-black to-transparent" />
				<div class="absolute inset-x-0 bottom-0 h-5 bg-white/0 backdrop-blur-sm" />
			</div>
		</div>
	</NuxtLink>
</template>

<style scoped>
</style>
