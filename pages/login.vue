<script setup lang="ts">
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

async function onSubmit() {
	await authStore.signIn({
		email: email.value,
		password: password.value,
	})
}
</script>

<template>
	<article class="w-full pt-8">
		<form
			class="b-box flex flex-col gap-y-4 p-4"
			@submit.prevent="onSubmit"
		>
			<BInput
				id="email"
				v-model="email"
				type="email"
				label="E-mail"
				placeholder="Enter your email address"
				icon="material-symbols-alternate-email-rounded"
				required
			/>
			<BInput
				id="password"
				v-model="password"
				type="password"
				label="Password"
				minlength="6"
				placeholder="Enter your password"
				required
			/>

			<BButton
				class="mt-8"
				type="submit"
				variant="primary"
			>
				Sign In
			</BButton>
		</form>
		<p class="mt-4 text-center text-sm text-neutral-400">
			No account yet?
			<NuxtLink
				to="/signup"
				class="text-white"
			>
				Create an account now.
			</NuxtLink>
		</p>
	</article>
</template>
