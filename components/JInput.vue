<script setup lang="ts">
const { placeholder, type = 'text', labelCenter = false, readonly = false } = defineProps<{
	label?: string
	labelCenter?: boolean
	placeholder?: string
	type?: string
	readonly?: boolean
}>()

const modelValue = defineModel()
const hasFocus = ref(false)
function onFocusIn() {
	hasFocus.value = true
}
function onFocusOut() {
	hasFocus.value = false
}
</script>

<template>
	<label>
		<span
			class="w-full inline-block text-[11px] uppercase tracking-widest font-bold  text-black mb-1"
			:class="{
				'text-center': labelCenter,
			}"
		>
			{{ label }}
		</span>
		<input
			v-model="modelValue"
			class="
				border-neutrsal-300
				bg-neutral-50
				border
				rounded-md
				px-4
				py-2
				w-full
				focus:outline-none
				focus:ring-4
				focus:ring-neutral-300
				focus:border-neutral-500
				h-12
				text-lg
				font-medium
				text-black
			"
			:type="type"
			:placeholder="placeholder"
			:readonly="readonly"
			@focusin="onFocusIn"
			@focusout="onFocusOut"
		>
	</label>
</template>
