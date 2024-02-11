<script setup lang="ts">
definePageMeta({
	layout: 'app',
	auth: true,
})
const authStore = useAuthStore()

function logout() {
	authStore.signOut()
}
</script>

<template>
	<article class="relative flex flex-1 flex-col">
		<footer class="mt-auto">
			<BButton
				class="w-full"
				variant="action"
				@click="logout"
			>
				Logout
			</BButton>
		</footer>
	</article>
</template>
