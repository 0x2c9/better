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
		<BIcon
			v-if="progress === 'increase'"
			name="trend-down"
			size="16"
			class="text-green"
		/>
		<BIcon
			v-if="progress === 'decrease'"
			name="trend-up"
			size="16"
			class="text-red"
		/>
		<BIcon
			v-if="progress === 'same' || progress === undefined"
			name="trend-flat"
			size="16"
			class="text-blue"
		/>
	</div>
</template>
