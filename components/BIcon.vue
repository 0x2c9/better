<script setup lang="ts">
const { size = '20', name = '' } = defineProps<{
	name: keyof typeof ICONS
	size?: string
}>()

const computedIconName = computed(() => {
	if (!name) {
		return ''
	}
	return `#${name}`
})

const computedIconSize = computed(() => {
	return `${size}px`
})
</script>

<template>
	<svg
		v-if="computedIconName"
		viewBox="0 0 100 100"
		class="icon"
	>
		<use :xlink:href="computedIconName" />
	</svg>
</template>

<style scoped>
svg {
	width: v-bind(computedIconSize);
	height: v-bind(computedIconSize);
}
</style>
