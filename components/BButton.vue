<script setup lang="ts">
interface IButtonProps {
	iconName?: keyof typeof ICONS
	variant?: 'primary' | 'error'
}

const {
	iconName = null,
} = defineProps<IButtonProps>()
</script>

<template>
	<button
		class="bg-neutral-800 border-2 border-neutral-700 text-white rounded-full active:bg-neutral-700 "
		:class="{
			'w-11 h-11 flex items-center justify-center': !!iconName,
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
