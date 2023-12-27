<script setup lang="ts">
interface IBSwitchOption {
	value: string
	label: string
}
interface IBSwitchProps {
	options: IBSwitchOption[]
}

const { options } = defineProps<IBSwitchProps>()

const modelValue = defineModel<IBSwitchOption>({ required: true })

function onOptionClick(option: IBSwitchOption) {
	modelValue.value = option
}
</script>

<template>
	<div class="w-full border border-neutral-500 rounded-2xl px-2 py-[6px] grid grid-cols-2 gap-x-3">
		<button
			v-for="option of options"
			:key="option.value"
			class="h-9 py-2 flex items-center justify-center rounded-xl select-none"
			:class="{
				'bg-neutral-800 border-2 border-neutral-700 text-white': modelValue.value === option.value,
			}"
			@click="onOptionClick(option)"
		>
			{{ option.label }}
		</button>
	</div>
</template>
