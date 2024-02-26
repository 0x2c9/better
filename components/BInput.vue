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
			'opacity-20': disabled,
		}"
	>
		<span
			class="mb-1 inline-block w-full text-[11px] font-bold uppercase  tracking-widest text-neutral-400"
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
				rounded-lg
				border
				border-neutral-500
				bg-transparent
				px-4
				py-2
				text-lg
				font-medium
				text-neutral-200
				caret-white
				placeholder:text-neutral-600
			"
			:class="{
				'border-neutral-400': !hasFocus,
				'outline-none ring-1 ring-white focus:border-transparent': hasFocus,
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
