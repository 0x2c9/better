<script setup lang="ts">
const { progress } = defineProps<{
	progress?: 'increase' | 'decrease' | 'same'
}>()
</script>

<template>
	<div
		class="mr-4 flex h-7 w-7 items-center justify-center rounded-full border-2 bg-black"
		:class="{
			'border-green ': progress === 'increase',
			'border-red ': progress === 'decrease',
			'border-blue ': progress === 'same' || progress === undefined,
		}"
	>
		<JIcon
			v-if="progress === 'increase'"
			name="trend-down"
			size="16"
			class="text-green"
		/>
		<JIcon
			v-if="progress === 'decrease'"
			name="trend-up"
			size="16"
			class="text-red"
		/>
		<JIcon
			v-if="progress === 'same' || progress === undefined"
			name="trend-flat"
			size="16"
			class="text-blue"
		/>
	</div>
</template>
