<script setup lang="ts">
const { options } = defineProps<{
	options: {
		content: any
		label: string
	}[]
}>()

const modelValue = defineModel<number>({ required: true })

function onOptionClick(index: number) {
	modelValue.value = index
}

const markerRef = ref<HTMLElement>()
const btnRefs = ref<HTMLButtonElement[]>()

function calculateMarkerDimensions(index: number = 0) {
	if (!btnRefs.value?.[index] || !markerRef.value) {
		return
	}

	modelValue.value = index
	const activeButton = btnRefs.value[index]

	markerRef.value.style.top = `${activeButton.offsetTop}px`
	markerRef.value.style.left = `${activeButton.offsetLeft}px`
	markerRef.value.style.width = `${activeButton.offsetWidth}px`
	markerRef.value.style.height = `${activeButton.offsetHeight}px`
}

onMounted(() => {
	calculateMarkerDimensions(modelValue.value)
})

watch(
	() => modelValue.value,
	(newIndex) => {
		calculateMarkerDimensions(newIndex)
	},
)

window.addEventListener('resize', () => calculateMarkerDimensions(modelValue.value))

onUnmounted(() => {
	window.removeEventListener('resize', () => calculateMarkerDimensions(modelValue.value))
})
</script>

<template>
	<div
		class="relative z-50 grid w-full gap-x-3 rounded-full border border-black px-1 py-[2px]"
		:style="{
			'grid-template-columns': `repeat(${options.length}, 1fr)`,
		}"
	>
		<div
			ref="markerRef"
			class="pointer-events-none
			absolute
			-z-10
			h-full
			rounded-full
			border-2
			bg-black
			text-white
			transition-all
			"
		></div>
		<button
			v-for="(option, index) of options"
			:key="option.content"
			ref="btnRefs"
			type="button"
			class="flex h-9 select-none items-center justify-center rounded-full py-2 font-semibold tabular-nums text-gray-medium"
			:class="{
				'text-white': options[modelValue].content === option.content,
			}"
			@click="onOptionClick(index)"
		>
			{{ option.label }}
		</button>
	</div>
</template>
