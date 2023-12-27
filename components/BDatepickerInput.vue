<script setup lang="ts">
const modelValue = defineModel<string>()
const showDatepicker = ref(false)

function openDatepicker() {
	showDatepicker.value = true
}

function onSetDate() {
	showDatepicker.value = false
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
	<BDrawer
		v-model="showDatepicker"
		:narrow="false"
	>
		<BDatepicker
			v-model="modelValue"
			:disable-future-dates="true"
			@set-date="onSetDate"
		/>
	</BDrawer>
</template>
