<script setup lang="ts">
interface IBSwitchOption {
	content: any
	label: string
}
interface IBSwitchProps {
	options: IBSwitchOption[]
}

const { options } = defineProps<IBSwitchProps>()

const emits = defineEmits<{
	change: [index: number]
}>()

const selectedIndex = ref(0)

function onOptionClick(index: number) {
	selectedIndex.value = index
	emits('change', index)
}

const markerRef = ref<HTMLElement>()
const btnRefs = ref<HTMLButtonElement[]>()

function calculateMarkerDimensions(index: number = 0) {
	if (!btnRefs.value?.[index] || !markerRef.value) {
		return
	}

	selectedIndex.value = index
	const activeButton = btnRefs.value[index]

	markerRef.value.style.top = `${activeButton.offsetTop}px`
	markerRef.value.style.left = `${activeButton.offsetLeft}px`
	markerRef.value.style.width = `${activeButton.offsetWidth}px`
	markerRef.value.style.height = `${activeButton.offsetHeight}px`
}

onMounted(() => {
	calculateMarkerDimensions()
})

watch(
	() => selectedIndex.value,
	(newIndex) => {
		calculateMarkerDimensions(newIndex)
	},
)

const throttledCalculateMarkerDimensions = useThrottleFn(() => {
	calculateMarkerDimensions(selectedIndex.value)
}, 500)

window.addEventListener('resize', throttledCalculateMarkerDimensions)

onUnmounted(() => {
	window.removeEventListener('resize', throttledCalculateMarkerDimensions)
})
</script>

<template>
	<div
		class="w-full border border-neutral-500 rounded-2xl px-2 py-[6px] grid gap-x-3 relative z-50"
		:style="{
			'grid-template-columns': `repeat(${options.length}, 1fr)`,
		}"
	>
		<div
			ref="markerRef"
			class="absolute
			bg-neutral-800
			border-2
			border-neutral-700
			text-white
			h-full
			rounded-xl
			pointer-events-none
			-z-10
			transition-all
			"
		/>
		<button
			v-for="(option, index) of options"
			:key="option.content"
			ref="btnRefs"
			type="button"
			class="h-9 py-2 flex items-center justify-center rounded-xl select-none text-neutral-500 tabular-nums font-semibold"
			:class="{
				'text-white': options[selectedIndex].content === option.content,
			}"
			@click="onOptionClick(index)"
		>
			{{ option.label }}
		</button>
	</div>
</template>
