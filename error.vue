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
	<div class="fixed inset-0 flex items-center justify-center">
		<div class="b-box flex flex-col gap-y-4 p-4">
			<h1 class="text-xl font-medium">
				Something went wrong :(
			</h1>
			<h2 class="text-lg font-medium">
				Error: {{ error.statusCode }}
			</h2>
			<BButton @click="handleError">
				Clear errors
			</BButton>
		</div>
	</div>
</template>
