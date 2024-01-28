<script setup lang="ts">
type BStepperProps = {
	steps?: number
	min?: number
	max?: number
	label?: string
	displayValue?: string | number
	disabled?: boolean
}

const {
	steps = 0.1,
	min = 0,
	max = null,
	label = null,
	displayValue = null,
	disabled = false,
} = defineProps<BStepperProps>()

const modelValue = defineModel<number>({ required: true })

const fasterIntervalTimeout = ref<NodeJS.Timeout>()
const currentInterval = ref<NodeJS.Timeout>()
const currentTimeout = ref<NodeJS.Timeout>()

const initialTouchStart = ref({ x: 0, y: 0 })

function increaseValue() {
	if (max && modelValue.value! >= max)
		return

	const newValue = (modelValue.value as number) + steps

	modelValue.value = Number.parseFloat(newValue.toFixed(2))
}

function decreaseValue() {
	if (modelValue.value! <= min)
		return

	const newValue = (modelValue.value as number) - steps

	modelValue.value = Number.parseFloat(newValue.toFixed(2))
}

function onTouchStart(event: TouchEvent, type: string) {
	initialTouchStart.value = {
		x: event.touches[0].clientX,
		y: event.touches[0].clientY,
	}

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
		clearInterval(currentInterval.value)
		clearTimeout(currentTimeout.value)
		clearTimeout(fasterIntervalTimeout.value)
	}
}

function onTouchEnd() {
	clearInterval(currentInterval.value)
	clearTimeout(currentTimeout.value)
	clearTimeout(fasterIntervalTimeout.value)
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
			'opacity-50': disabled,
		}"
	>
		<h1 class="text text-center text-xs font-medium uppercase tracking-widest  text-neutral-400">
			{{ label }}
		</h1>

		<div class="flex items-center justify-between text-4xl">
			<BButton
				type="button"
				variant="primary"
				size="small"
				:disabled="disabled || modelValue <= min"
				icon-name="material-symbols-remove-rounded"
				@touchstart.stop.passive="onTouchStart($event, 'minus')"
				@touchend="onTouchEnd"
				@touchmove.stop.passive="onTouchMove"
				@click="decreaseValue"
			/>
			<div class="flex flex-1 select-none flex-col text-center tabular-nums">
				<span class="text-4xl font-semibold">
					{{ computedDisplayValue }}
				</span>
				<slot />
			</div>
			<BButton
				type="button"
				variant="primary"
				size="small"
				:disabled="disabled || !!(max && modelValue >= max)"
				icon-name="material-symbols-add-rounded"
				@touchstart.stop.passive="onTouchStart($event, 'plus')"
				@touchend="onTouchEnd"
				@touchmove.stop.passive="onTouchMove"
				@click="increaseValue"
			/>
		</div>
	</div>
</template>
