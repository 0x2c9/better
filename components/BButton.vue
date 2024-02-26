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
		class="flex select-none items-center justify-center rounded-full font-bold"
		:class="{
			'bg-primary text-neutral-950 active:enabled:bg-primary/80': variant === 'primary',
			'bg-neutral-600 text-white active:enabled:bg-neutral-700': variant === 'secondary',
			'border-2 border-neutral-600 text-white active:enabled:bg-neutral-600/40': variant === 'outline',
			'border-red-700 border-2 bg-red/25 text-red active:enabled:bg-red/50': variant === 'danger',
			'shrink-0': isIconButton,
			'size-10': isIconButton && !small,
			'size-7': isIconButton && small,
			'h-11 px-6 text-lg': !isIconButton && !small,
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
