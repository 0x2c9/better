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
	<article class="relative">
		<BButton
			variant="action"
			@click="logout"
		>
			Logout
		</BButton>
	</article>
</template>
