<script setup lang="ts">
interface IButtonProps {
	iconName?: keyof typeof ICONS
	variant?: 'primary' | 'secondary' | 'error'
	small?: boolean
}

const {
	variant = 'primary',
	iconName = null,
	small = false,
} = defineProps<IButtonProps>()

const isIconButton = computed(() => !!iconName)
</script>

<template>
	<button
		class="border-2 border-neutral-700 text-white rounded-full active:bg-neutral-700 font-semibold select-none"
		:class="{
			'bg-neutral-800 ': variant === 'primary',
			'bg-transparent ': variant === 'secondary',
			'flex items-center justify-center': isIconButton,
			'w-12 h-12': isIconButton && !small,
			'w-11 h-11': isIconButton && small,
			'h-12 text-lg px-6 ': !isIconButton && !small,
			'h-10 px-5': !isIconButton && small,
		}"
	>
		<BIcon
			v-if="iconName"
			:name="iconName"
			size="32"
		/>
		<slot />
	</button>
</template>
