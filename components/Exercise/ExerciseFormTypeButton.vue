<script setup lang="ts">
const { label, iconName } = defineProps<{
	label: string
	iconName: keyof typeof ICONS
}>()
</script>

<template>
	<BButton
		class="relative flex min-h-32 flex-col items-center justify-center overflow-hidden rounded-xl"
		type="button"
		small
	>
		<BIcon
			class="absolute -left-3 -top-1 z-0 rotate-12 transform text-neutral-700/50"
			size="120"
			:name="iconName"
		/>
		<span class="z-10 text-xl font-bold text-neutral-100">{{ label }}</span>
	</BButton>
</template>
