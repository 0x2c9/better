<script setup lang="ts">
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')

async function onSubmit() {
	await authStore.signUp({
		email: email.value,
		password: password.value,
	})
}
</script>

<template>
	<article class="w-full pt-8">
		<form
			class="flex flex-col gap-y-4 rounded-lg bg-white p-4 shadow-better"
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
			<BInput
				id="repeat-password"
				v-model="passwordConfirmation"
				type="password"
				label="Password"
				minlength="6"
				placeholder="Repeat your password"
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
		<p class="mt-4 text-center text-sm text-gray-medium">
			Already have an account?
			<NuxtLink
				to="/login"
				class="text-black"
			>
				Login with your account
			</NuxtLink>
		</p>
	</article>
</template>
