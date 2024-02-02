<script setup lang="ts">
import type { Pausable } from '@vueuse/core'
import { Howl } from 'howler'
import type { TimeExercise } from '~/types/exercise'

const { exercise } = defineProps<{
	exercise: TimeExercise
}>()

const emits = defineEmits<{
	stop: [void]
	done: [TimeExercise]
}>()

const sets = exercise.exercise_sets
const training = exercise.exercise_training_time
const pause = exercise.exercise_pause_time

const shortbeep = new Howl({ src: ['/sounds/short-beep.ogg'] })
const longBeep = new Howl({ src: ['/sounds/long-beep.ogg'] })
const doubleBeep = new Howl({ src: ['/sounds/2x-beep.ogg'] })
const tripleBeep = new Howl({ src: ['/sounds/3x-beep.ogg'] })

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
			emits('done', exercise)
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
	timer?.pause()
	emits('stop')
}

window.addEventListener('touchstart', onTouchStart, { passive: true })

onBeforeUnmount(() => {
	window.removeEventListener('touchstart', onTouchStart)
})
</script>

<template>
	<article class="absolute inset-0 z-50 flex flex-1 bg-neutral-950">
		<Transition name="fade">
			<div
				v-if="!timer?.isActive.value && currentPhase !== TimerPhase.Done && showTimerOverlay"
				class="pointer-events-none fixed inset-0 z-50 bg-neutral-950/50 backdrop-blur-[3px]"
			/>
		</Transition>
		<Transition name="fade">
			<div
				v-if="currentPhase !== TimerPhase.Done"
				class="absolute inset-0 z-[51] flex flex-col px-4 pb-16 transition-opacity duration-500"
				:class="{
					'opacity-100': showTimerOverlay,
					'pointer-events-none opacity-0': !showTimerOverlay,
				}"
			>
				<div class="mt-auto flex w-full items-center">
					<TimerIntervalStopButton @stop="onStop" />

					<BButton
						class="ml-auto"
						big
						:icon-name="timer?.isActive.value ? 'material-symbols-pause-rounded' : 'material-symbols-play-arrow-rounded'"
						@click="toggleTimer"
					/>
				</div>
			</div>
		</Transition>
		<div class="relative flex size-full flex-col">
			<div class="my-auto select-none">
				<span
					class="block text-center text-5xl font-bold uppercase tabular-nums"
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
					class="my-4 block text-center text-[30vw] font-bold tabular-nums leading-none"
				>
					{{ secondsIntoMinutes(timeLeft) }}
				</span>

				<span class="block text-center text-5xl font-bold uppercase text-neutral-400">
					{{ computedPhaseConfig.phase }}
				</span>
			</div>

			<Transition name="fade">
				<div
					v-if="currentPhase === TimerPhase.Done"
					class="absolute bottom-0 flex w-full flex-col space-y-4"
				>
					<BButton
						variant="secondary"
						@click="repeatTimer"
					>
						<BIcon
							name="material-symbols-replay-rounded"
							class="mr-2"
						/>
						Repeat
					</BButton>
					<BButton to="/timer">
						Return
					</BButton>
				</div>
			</Transition>
		</div>
	</article>
</template>
