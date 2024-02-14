<script setup lang="ts">
const {
	variant = 'primary',
	small = false,
	disabled = false,
	to = null,
	iconName = null,
	iconSize = '28',
} = defineProps<{
	variant?: 'primary' | 'secondary' | 'action' | 'danger'
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
			'border-2 border-neutral-700 bg-neutral-800 text-white active:enabled:bg-neutral-700': variant === 'primary',
			'border-2 border-neutral-700 bg-transparent text-white active:enabled:bg-neutral-700': variant === 'secondary',
			'border-red-700 border-2 bg-red/25 text-red active:enabled:bg-red/50': variant === 'danger',
			'bg-primary text-neutral-950': variant === 'action',
			'shrink-0': isIconButton,
			'size-12': isIconButton && !small,
			'size-11': isIconButton && small,
			'h-12 px-6 text-lg': !isIconButton && !small,
			'h-9 px-5': !isIconButton && small,
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
