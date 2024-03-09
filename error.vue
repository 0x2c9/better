<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
	error: NuxtError
}>()

function handleError() {
	clearError({ redirect: '/' })
}
</script>

<template>
	<div class="fixed inset-0 flex items-center justify-center px-4">
		<div class="better-shadow flex w-full flex-col gap-y-4 bg-white p-4">
			<h1 class="text-xl font-medium">
				Something went wrong :(
			</h1>
			<pre class="overflow-x-auto">{{ error }}</pre>
			<BButton @click="handleError">
				Clear errors
			</BButton>
		</div>
	</div>
</template>
