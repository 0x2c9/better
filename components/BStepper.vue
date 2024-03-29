<script setup lang="ts">
const {
	steps = 0.1,
	min = 0,
	max = null,
	label = null,
	displayValue = null,
	disabled = false,
} = defineProps<{
	steps?: number
	min?: number
	max?: number
	label?: string
	displayValue?: string | number
	disabled?: boolean
}>()

const modelValue = defineModel<number>({ required: true })

const currentInterval = ref<NodeJS.Timeout>()
const currentTimeout = ref<NodeJS.Timeout>()
const increaseStepTimeout = ref<NodeJS.Timeout>()
const useIncreasedStep = ref(false)

const initialTouchStart = ref({ x: 0, y: 0 })

function clearStepper() {
	clearInterval(currentInterval.value)
	clearTimeout(currentTimeout.value)
	clearTimeout(increaseStepTimeout.value)
	useIncreasedStep.value = false
}

const stepFactor = computed(() => {
	return useIncreasedStep.value ? 2 : 1
})

function increaseValue() {
	if (max && modelValue.value! >= max)
		return

	const newValue = (modelValue.value as number) + (steps * stepFactor.value)

	modelValue.value = Number.parseFloat(newValue.toFixed(2))
}

function decreaseValue() {
	if (modelValue.value! <= min)
		return

	const newValue = (modelValue.value as number) - (steps * stepFactor.value)

	modelValue.value = Number.parseFloat(newValue.toFixed(2))
}

function onTouchStart(event: TouchEvent, type: string) {
	initialTouchStart.value = {
		x: event.touches[0].clientX,
		y: event.touches[0].clientY,
	}

	increaseStepTimeout.value = setTimeout(() => {
		useIncreasedStep.value = true
	}, 2000)

	currentTimeout.value = setTimeout(() => {
		currentInterval.value = setInterval(() => {
			type === 'plus' ? increaseValue() : decreaseValue()
		}, 75)
	}, 300)
}

function onTouchMove(event: TouchEvent) {
	const { clientX, clientY } = event.touches[0]

	const xDiff = Math.abs(initialTouchStart.value.x - clientX)
	const yDiff = Math.abs(initialTouchStart.value.y - clientY)

	if (xDiff > 100 || yDiff > 100) {
		clearStepper()
	}
}

const computedDisplayValue = computed(() => {
	if (displayValue) {
		return displayValue
	}

	return modelValue.value
})
</script>

<template>
	<div
		class="w-full select-none"
		:class="{
			'opacity-20': disabled,
		}"
	>
		<label class="mb-1 inline-block w-full text-center text-[11px] font-semibold uppercase tracking-widest text-gray-medium">
			{{ label }}
		</label>

		<div class="flex items-center justify-between text-4xl">
			<BButton
				type="button"
				variant="secondary"
				:disabled="disabled || modelValue <= min"
				icon-name="material-symbols-remove-rounded"
				@touchstart.stop.passive="onTouchStart($event, 'minus')"
				@touchend="clearStepper"
				@touchmove.stop.passive="onTouchMove"
				@click="decreaseValue"
			/>
			<div class="flex flex-1 select-none flex-col text-center tabular-nums">
				<span class="text-4xl font-semibold">
					{{ computedDisplayValue }}
				</span>
				<slot></slot>
			</div>
			<BButton
				type="button"
				variant="secondary"
				:disabled="disabled || !!(max && modelValue >= max)"
				icon-name="material-symbols-add-rounded"
				@touchstart.stop.passive="onTouchStart($event, 'plus')"
				@touchend="clearStepper"
				@touchmove.stop.passive="onTouchMove"
				@click="increaseValue"
			/>
		</div>
	</div>
</template>
