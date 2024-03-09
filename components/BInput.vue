<script setup lang="ts">
const { placeholder, type = 'text', labelCenter = false, readonly = false, disabled = false } = defineProps<{
	label?: string
	labelCenter?: boolean
	placeholder?: string
	type?: string
	readonly?: boolean
	disabled?: boolean
	required?: boolean
	error?: string
	id?: string
	minlength?: string
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
	<label
		:for="id"
		class="inline-block"
		:class="{
			'opacity-50': disabled,
		}"
	>
		<span
			class="mb-1 inline-block w-full text-[11px] font-bold uppercase  tracking-widest text-gray-medium"
			:class="{
				'text-center': labelCenter,
			}"
		>
			{{ label }}
		</span>
		<input
			:id="id"
			v-model="modelValue"
			class="
				h-12
				w-full
				rounded-md
				border
				border-gray-dark
				bg-transparent
				px-4
				py-2
				text-lg
				font-medium
				text-black
				caret-black
				placeholder:text-gray-medium/50
			"
			:class="{
				'border-gray-dark': !hasFocus,
				'outline-none ring-2 ring-blue ring-offset-1': hasFocus,
			}"
			:type="type"
			:placeholder="placeholder"
			:readonly="readonly"
			:disabled="disabled"
			:required="required"
			:minlength="minlength"
			@focusin="onFocusIn"
			@focusout="onFocusOut"
		>
		<span v-if="error">{{ error }}</span>
	</label>
</template>
