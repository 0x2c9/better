<script setup lang="ts">
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

async function onSubmit() {
	if (authStore.isAuthenticated) {
		navigateTo('/home')
		return
	}
	await authStore.signIn({
		email: email.value,
		password: password.value,
	})
}
</script>

<template>
	<div class="mx-auto mt-12 flex w-full max-w-7xl flex-col">
		<form
			class="flex flex-col space-y-4"
			@submit.prevent="onSubmit"
		>
			<input
				v-model="email"
				type="email"
				placeholder="email"
			>
			<input
				v-model="password"
				type="password"
				placeholder="password"
			>

			<button type="submit">
				Sign In
			</button>
		</form>
	</div>
</template>

<style scoped>
input {
	@apply shadow-better bg-white text-black rounded-lg px-2 py-3;
}

button {
	@apply shadow-better bg-black text-white rounded-lg px-2 py-3;
}
</style>
