<script setup lang="ts">
const { placeholder, type = 'text', labelCenter = false, readonly = false, disabled = false } = defineProps<{
	label?: string
	labelCenter?: boolean
	placeholder?: string
	type?: string
	readonly?: boolean
	disabled?: boolean
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
			v-model="modelValue"
			class="
				h-12
				w-full
				rounded-md
				border
				border-neutral-600
				bg-transparent
				px-4
				py-2
				text-lg
				font-medium
				text-white
				placeholder:text-neutral-600
			"
			:class="{
				'border-neutral-400': !hasFocus,
				'outline-none ring-2 ring-blue focus:border-transparent': hasFocus,
			}"
			:type="type"
			:placeholder="placeholder"
			:readonly="readonly"
			:disabled="disabled"
			@focusin="onFocusIn"
			@focusout="onFocusOut"
		>
	</label>
</template>
