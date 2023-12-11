<script setup lang="ts">
interface IButtonProps {
	iconName?: keyof typeof ICONS

	variant?: 'primary' | 'secondary' | 'error'
	size?: 'small' | 'normal'
	to?: string
}

const {
	variant = 'primary',
	size = 'normal',
	iconName = null,
	to = null,
} = defineProps<IButtonProps>()

const computedClass = computed(() => {
	if (iconName) {
		const sizes = {
			small: 'h-10 w-10',
			normal: 'h-12 w-12',
		}

		const variants = {
			primary: 'text-white bg-black',
			secondary: 'text-neutral-500',
			error: 'text-red bg-red/30 border-red border',
		}

		return [
			'inline-flex items-center justify-center select-none rounded-full transition-all duration-50',
			'active:scale-90 active:ring-4 ring-neutral-300 ring-neutral-200',
			variants[variant],
			sizes[size],
		]
	}

	const variants = {
		primary: 'bg-black text-white',
		secondary: 'bg-white text-black better-layer',
		error: 'bg-red text-white',
	}

	const sizes = {
		small: 'px-4 h-[28px] text-sm font-semibold rounded-full',
		normal: 'px-8 h-[48px] text-lg font-semibold rounded-full',
	}

	return [
		'inline-flex items-center justify-center select-none',
		variants[variant],
		sizes[size],
	]
})

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
		:class="computedClass"
	>
		<JIcon
			v-if="iconName"
			:name="iconName"
			size="28"
		/>
		<slot />
	</component>
</template>
