<script setup lang="ts">
const {
	variant = 'primary',
	small = false,
	disabled = false,
	to = null,
	iconName = null,
	iconSize = '28',
} = defineProps<{
	variant?: 'primary' | 'secondary' | 'outline' | 'danger'
	small?: boolean
	disabled?: boolean
	to?: string
	iconName?: keyof typeof ICONS
	iconSize?: string
}>()

const isIconButton = computed(() => !!iconName)

const component = computed(() => {
	if (to) {
		return resolveComponent('NuxtLink')
	}

	return 'button'
})
</script>

<template>
	<component
		:is="component"
		:to="to"
		class="flex select-none items-center justify-center rounded-full font-semibold transition-colors duration-75"
		:class="{
			'bg-black text-white active:enabled:bg-black/90': variant === 'primary',
			'active:enabled:bg-light-gray/90 bg-gray-light text-black': variant === 'secondary',
			'border-2 border-black text-black active:enabled:bg-black/10': variant === 'outline',
			'border-2 border-red bg-red/25 text-red active:enabled:bg-red/50': variant === 'danger',
			'shrink-0': isIconButton,
			'size-11': isIconButton && !small,
			'size-7': isIconButton && small,
			'h-12 px-6 text-lg': !isIconButton && !small,
			'h-8 px-5': !isIconButton && small,
		}"
		:disabled="disabled"
	>
		<BIcon
			v-if="iconName"
			:name="iconName"
			:size="iconSize"
		/>
		<slot></slot>
	</component>
</template>
