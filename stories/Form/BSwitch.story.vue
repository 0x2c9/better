<script setup lang="ts">
const mockOptions = [
	{
		content: 'option1',
		label: 'Option 1',
	},
	{
		content: 'option2',
		label: 'Option 2',
	},
	{
		content: 'option3',
		label: 'Option 3',
	},
]
const selectedValue = ref(mockOptions[0])
</script>

<template>
	<Variant title="BSwitch">
		<BSwitch
			v-model="selectedValue"
			:options="mockOptions"
		/>

		<pre>{{ selectedValue }}</pre>
	</Variant>
</template>
