<script setup lang="ts">
const { size = '20' } = defineProps<IBaseIcon>()

interface IBaseIcon {
	name: keyof typeof ICONS
	size?: string
}
</script>

<template>
	<Icon
		:name="ICONS[name]"
		:size="size"
	/>
</template>
