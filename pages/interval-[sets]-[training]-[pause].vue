<script setup lang="ts">
import type { Pausable } from '@vueuse/core'
import { Howl } from 'howler'

const shortbeep = new Howl({ src: ['/sounds/short-beep.ogg'] })
const longBeep = new Howl({ src: ['/sounds/long-beep.ogg'] })
const doubleBeep = new Howl({ src: ['/sounds/2x-beep.ogg'] })
const tripleBeep = new Howl({ src: ['/sounds/3x-beep.ogg'] })

definePageMeta({
	layout: 'app',
})

const route = useRoute()

const sets = Number.parseInt(route.params.sets as string)
const training = Number.parseInt(route.params.training as string)
const pause = Number.parseInt(route.params.pause as string)

const TimerPhase = {
	Countdown: 'Countdown',
	Training: 'Training',
	Pause: 'Pause',
	Done: 'Done',
}

const { secondsIntoMinutes } = useUtils()

const PREPARE_TIME = 5

const timeLeft = ref(PREPARE_TIME)

const currentPhase = ref(TimerPhase.Countdown)

const computedPhaseConfig = computed(() => {
	switch (currentPhase.value) {
		case TimerPhase.Countdown:
			return {
				time: PREPARE_TIME,
				phase: TimerPhase.Countdown,
			}
		case TimerPhase.Training:
			return {
				time: training,
				phase: TimerPhase.Training,
			}
		case TimerPhase.Pause:
			return {
				time: pause,
				phase: TimerPhase.Pause,
			}
		case TimerPhase.Done:
			return {
				time: 0,
				phase: TimerPhase.Done,
			}
		default:
			return {
				time: 0,
				phase: TimerPhase.Countdown,
			}
	}
})

const currentSet = ref(0)
const intervals = ref<number[]>([])

function initTimer() {
	currentPhase.value = TimerPhase.Countdown
	timeLeft.value = PREPARE_TIME
	currentSet.value = 0

	for (let i = 0; i < sets; i++) {
		intervals.value.push(training)
		if (i < sets - 1) {
			intervals.value.push(pause)
		}
	}
	longBeep.play()
	return useIntervalFn(() => {
		if (timeLeft.value > 1) {
			timeLeft.value -= 1
			if (timeLeft.value <= 3) {
				shortbeep.play()
			}
			return
		}
		if (currentPhase.value === TimerPhase.Countdown) {
			currentPhase.value = TimerPhase.Training
		} else {
			currentPhase.value = currentPhase.value === TimerPhase.Training ? TimerPhase.Pause : TimerPhase.Training
		}

		if (currentPhase.value === TimerPhase.Training) {
			doubleBeep.play()
			currentSet.value += 1
		} else if (currentPhase.value === TimerPhase.Pause && intervals.value.length > 0) {
			longBeep.play()
		}

		if (intervals.value.length > 0) {
			timeLeft.value = intervals.value.shift() ?? 0
		} else {
			tripleBeep.play()
			currentPhase.value = TimerPhase.Done
		}
	}, 1000)
}

let timer: Pausable | null = null

onMounted(() => {
	timer = initTimer()
})

function repeatTimer() {
	timer = initTimer()
}

watch(
	() => currentPhase.value,
	(newPhase) => {
		if (newPhase === TimerPhase.Done) {
			timer?.pause()
		}
	},
)

// Controll overlay which holds the timer controls
const showTimerOverlay = ref(false)

let timeoutId: NodeJS.Timeout = setTimeout(() => {}, 0)

function onTouchStart() {
	clearTimeout(timeoutId)
	if (currentPhase.value === TimerPhase.Done) {
		return
	}
	showTimerOverlay.value = true

	if (!timer?.isActive.value) {
		return
	}
	timeoutId = setTimeout(() => {
		showTimerOverlay.value = false
	}, 3000)
}

function toggleTimer() {
	if (timer?.isActive.value) {
		clearTimeout(timeoutId)
		timer?.pause()
	} else {
		timer?.resume()
		timeoutId = setTimeout(() => {
			showTimerOverlay.value = false
		}, 3000)
	}
}

async function onStop() {
	await navigateTo('/timer')
}

if (process.client) {
	window.addEventListener('touchstart', onTouchStart, { passive: true })
}

onBeforeUnmount(() => {
	window.removeEventListener('touchstart', onTouchStart)
})
</script>

<template>
	<article class="flex flex-1 relative">
		<Transition name="fade">
			<div
				v-if="!timer?.isActive.value && currentPhase !== TimerPhase.Done && showTimerOverlay"
				class="fixed z-50 inset-0 bg-white/20 pointer-events-none backdrop-blur-[2px]"
			/>
		</Transition>
		<Transition name="fade">
			<div
				v-if="currentPhase !== TimerPhase.Done"
				class="absolute z-[51] inset-0 transition-opacity duration-500 flex flex-col"
				:class="{
					'opacity-100': showTimerOverlay,
					'opacity-0 pointer-events-none': !showTimerOverlay,
				}"
			>
				<div class="mt-auto flex items-center w-full">
					<TimerIntervalStopButton @stop="onStop" />

					<JButton
						class="ml-auto"
						:icon-name="timer?.isActive.value ? 'timer-pause' : 'timer-start'"
						@click="toggleTimer"
					/>
				</div>
			</div>
		</Transition>
		<div class="w-full h-full flex flex-col relative">
			<div class="my-auto select-none">
				<span
					class="text-5xl tabular-nums font-bold block uppercase text-center "
					:class="{
						'opacity-100': currentPhase === TimerPhase.Training || currentPhase === TimerPhase.Pause,
						'opacity-0': currentPhase !== TimerPhase.Training && currentPhase !== TimerPhase.Pause,
					}"
				>
					{{ currentSet }} / {{ sets }}
				</span>
				<span
					v-if="currentPhase !== TimerPhase.Done"
					:key="currentPhase"
					class="tabular-nums text-[30vw] leading-none font-bold block text-center my-4"
				>
					{{ secondsIntoMinutes(timeLeft) }}
				</span>

				<span class="text-5xl font-bold block uppercase text-center text-neutral-400">
					{{ computedPhaseConfig.phase }}
				</span>
			</div>

			<Transition name="fade">
				<div
					v-if="currentPhase === TimerPhase.Done"
					class="space-y-4 flex flex-col absolute bottom-0 w-full"
				>
					<JButton
						variant="secondary"
						@click="repeatTimer"
					>
						<JIcon
							name="timer-replay"
							class="mr-2"
						/>
						Repeat
					</JButton>
					<JButton to="/timer">
						Return
					</JButton>
				</div>
			</Transition>
		</div>
	</article>
</template>
