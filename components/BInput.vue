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
	if (readonly) {
		return
	}
	hasFocus.value = true
}
function onFocusOut() {
	if (readonly) {
		return
	}
	hasFocus.value = false
}
</script>

<template>
	<label>
		<span
			class="w-full inline-block text-[11px] uppercase tracking-widest font-bold  text-neutral-400 mb-1"
			:class="{
				'text-center': labelCenter,
			}"
		>
			{{ label }}
		</span>
		<input
			v-model="modelValue"
			class="
				border-neutral-600
				bg-transparent
				border
				rounded-md
				px-4
				py-2
				w-full
				h-12
				text-lg
				font-medium
				text-white
				placeholder:text-neutral-600
			"
			:class="{
				'border-neutral-400': !hasFocus,
				'ring-blue ring-2 outline-none focus:border-transparent': hasFocus,
			}"
			:type="type"
			:placeholder="placeholder"
			:readonly="readonly"
			@focusin="onFocusIn"
			@focusout="onFocusOut"
		>
	</label>
</template>
