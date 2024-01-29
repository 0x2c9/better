<script setup lang="ts">
type IButtonProps = {
	iconName?: keyof typeof ICONS
	variant?: 'primary' | 'secondary' | 'error'
	small?: boolean
	disabled?: boolean
}

const {
	variant = 'primary',
	iconName = null,
	small = false,
	disabled = false,
} = defineProps<IButtonProps>()

const isIconButton = computed(() => !!iconName)
</script>

<template>
	<button
		class="flex select-none items-center justify-center rounded-full border-2 border-neutral-700 font-semibold text-white active:enabled:bg-neutral-700"
		:class="{
			'bg-neutral-800': variant === 'primary',
			'bg-transparent': variant === 'secondary',
			'shrink-0': isIconButton,
			'size-12': isIconButton && !small,
			'size-11': isIconButton && small,
			'h-12 px-6 text-lg': !isIconButton && !small,
			'h-10 px-5': !isIconButton && small,
		}"
		:disabled="disabled"
	>
		<BIcon
			v-if="iconName"
			:name="iconName"
			size="28"
		/>
		<slot />
	</button>
</template>
