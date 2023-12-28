<script setup lang="ts">
const showDrawer = ref(false)
</script>

<template>
	<Variant title="Drawer">
		<BButton @click="showDrawer = true">
			Open Drawer
		</BButton>

		<BDrawer
			v-model="showDrawer"
		>
			Drawer Content
		</BDrawer>
	</Variant>
</template>
