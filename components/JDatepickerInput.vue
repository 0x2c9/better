<script setup lang="ts">
const modelValue = defineModel<string>()
const showDatepicker = ref(false)

function openDatepicker() {
	showDatepicker.value = true
}

const displayValue = computed(() => {
	return useDateFormat(modelValue.value, 'DD.MM.YYYY').value
})
</script>

<template>
	<BInput
		v-model="displayValue"
		type="text"
		label="Date"
		readonly
		@click="openDatepicker"
	/>
	<LazyJDropdown
		v-model="showDatepicker"
		:narrow="false"
	>
		<JDatepicker
			v-model="modelValue"
			:disable-future-dates="true"
			@set-date="showDatepicker = false"
		/>
	</LazyJDropdown>
</template>
