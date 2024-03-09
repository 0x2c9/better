<script setup lang="ts">
import AppVersionInfo from '~/components/App/AppVersionInfo.vue'

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
				variant="primary"
				@click="logout"
			>
				Logout
			</BButton>
		</footer>

		<section class="fixed inset-x-4 top-4 text-center text-sm text-gray-medium">
			<AppVersionInfo />
		</section>
	</article>
</template>
