<script setup lang="ts">
// today date in YYYY-MM-DD format
const currentDate = new Date().toISOString().substring(0, 10)

const mockValue = ref(currentDate)
</script>

<template>
	<Variant title="Datepicker">
		<BDatepicker
			v-model="mockValue"
			:blank="false"
		/>
	</Variant>
	<Variant title="Datepicker disabled Dates">
		<BDatepicker
			v-model="mockValue"
			disable-future-dates
		/>
	</Variant>
	<Variant>
		<BDatepickerInput v-model="mockValue" />
	</Variant>
	<SvgSprite />
</template>
