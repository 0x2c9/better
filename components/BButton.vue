<script setup lang="ts">
interface IButtonProps {
	iconName?: keyof typeof ICONS
	variant?: 'primary' | 'secondary' | 'error'
	big?: boolean
}

const {
	variant = 'primary',
	iconName = null,
	big = false,
} = defineProps<IButtonProps>()
</script>

<template>
	<button
		class="border-2 border-neutral-700 text-white rounded-full active:bg-neutral-700 select-none"
		:class="{
			'bg-neutral-800 ': variant === 'primary',
			'bg-transparent ': variant === 'secondary',
			'w-11 h-11 flex items-center justify-center': !!iconName,
			'w-12 h-12': !!iconName && big,
			'h-12 text-lg px-4 font-semibold': !iconName,
		}"
	>
		<JIcon
			v-if="iconName"
			:name="iconName"
			size="32"
		/>
		<slot />
	</button>
</template>
