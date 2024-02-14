<script setup lang="ts">
const { highlightedDates = new Set(), disabled = false } = defineProps<{
	highlightedDates: Set<string>
	disabled: boolean
}>()

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
		:disabled="disabled"
		@click="openDatepicker"
	/>
	<ClientOnly>
		<LazyBDrawer
			v-model="showDatepicker"
			:narrow="false"
		>
			<BDatepicker
				v-model="modelValue"
				:highlighted-dates="highlightedDates"
				:disable-future-dates="true"
				@set-date="onSetDate"
			/>
		</LazyBDrawer>
	</ClientOnly>
</template>
