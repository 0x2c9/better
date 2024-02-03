<script setup lang="ts">
type IButtonProps = {
	iconName?: keyof typeof ICONS
	variant?: 'primary' | 'secondary' | 'action'
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
		class="flex select-none items-center justify-center rounded-full font-semibold"
		:class="{
			'border-2 border-neutral-700 bg-neutral-800 text-white active:enabled:bg-neutral-700': variant === 'primary',
			'border-2 border-neutral-700 bg-transparent text-white active:enabled:bg-neutral-700': variant === 'secondary',
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
			size="28"
		/>
		<slot />
	</button>
</template>
