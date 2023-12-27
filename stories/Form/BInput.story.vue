<script setup lang="ts">
const emptyValue = ref('')
const mockValue = ref('Mock Value')
</script>

<template>
	<Variant title="Base Input">
		<BInput
			v-model="emptyValue"
			placeholder="Placeholder"
		/>
	</Variant>
	<Variant title="Base Input Filled">
		<BInput
			v-model="mockValue"
			placeholder="Placeholder"
		/>
	</Variant>
</template>
