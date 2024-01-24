<script setup lang="ts">
const { label, iconName } = defineProps<{
	label: string
	iconName: keyof typeof ICONS
}>()
</script>

<template>
	<BButton
		class="flex flex-col items-center justify-center min-h-32 rounded-xl relative overflow-hidden"
		type="button"
		small
	>
		<BIcon
			class="text-neutral-700/50 absolute -top-1 -left-3 z-0 transform rotate-12"
			size="120"
			:name="iconName"
		/>
		<span class="font-bold text-xl text-neutral-100 z-10">{{ label }}</span>
	</BButton>
</template>
