<script setup lang="ts">
interface IJStepperProps {
	steps?: number
	min?: number
	max?: number
	label?: string
	displayValue?: string | number
}

const { steps = 0.1, min = 0, max = null, label = null, displayValue = null } = defineProps<IJStepperProps>()

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
		event.preventDefault()
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
</script>

<template>
	<div class="w-full select-none">
		<h1 class="text text-center text-xs uppercase tracking-widest font-medium  text-neutral-400">
			{{ label }}
		</h1>

		<div class="flex items-center justify-between text-4xl">
			<BButton
				class="-ml-1"
				type="button"
				variant="primary"
				size="small"
				icon-name="material-symbols-remove-rounded"
				@touchstart.stop.passive="onTouchStart($event, 'minus')"
				@touchend="onTouchEnd"
				@touchmove.stop.passive="onTouchMove"
				@click="decreaseValue"
			/>
			<div class="flex flex-1 select-none flex-col text-center tabular-nums">
				<span class="text-4xl font-semibold">
					{{ displayValue }}
				</span>
				<slot />
			</div>
			<BButton
				class="-mr-1"
				type="button"
				variant="primary"
				size="small"
				icon-name="material-symbols-add-rounded"
				@touchstart.stop.passive="onTouchStart($event, 'plus')"
				@touchend="onTouchEnd"
				@touchmove.stop.passive="onTouchMove"
				@click="increaseValue"
			/>
		</div>
	</div>
</template>
