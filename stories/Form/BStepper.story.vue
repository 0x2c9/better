<script setup lang="ts">
const mockValue = ref(0.5)

const computedDisplayValue = computed(() => {
	return `${mockValue.value * 100}%`
})
</script>

<template>
	<Variant title="BStepper Base">
		<div class="max-w-sm w-full mx-auto">
			<BStepper
				v-model="mockValue"
				:steps="0.1"
				:min="0"
				:max="1"
				label="Custom Label"
			/>
		</div>
	</Variant>
	<Variant title="BStepper with Display Value">
		<div class="max-w-sm w-full mx-auto">
			<BStepper
				v-model="mockValue"
				:steps="0.1"
				:min="0"
				:max="1"
				label="Custom Label"
				:display-value="computedDisplayValue"
			/>
		</div>
	</Variant>

	<SvgSprite />
</template>
