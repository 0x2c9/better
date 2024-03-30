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
const INTERVAL_TIME = import.meta.dev ? 333 : 1000

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
	}, INTERVAL_TIME)
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

const showTimerOverlay = ref(false)

let timeoutId: NodeJS.Timeout = setTimeout(() => { }, 0)

function toggleTimerOverlay() {
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

const buttonIsActive = ref(false)

function stopTimer(e: TransitionEvent) {
	const isTransformEvent = e.propertyName === 'transform'
	if (buttonIsActive.value && isTransformEvent) {
		timer?.pause()
		emits('stop')
	}
}
</script>

<template>
	<article class="absolute inset-0 z-50 flex flex-1 bg-dirty-white" @click="toggleTimerOverlay">
		<Transition name="fade">
			<div
				v-if="!timer?.isActive.value && currentPhase !== TimerPhase.Done && showTimerOverlay"
				class="pointer-events-none fixed inset-0 z-50 bg-white/50 backdrop-blur-[3px]"
			></div>
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
					<BButton
						variant="primary"
						class="
							relative
							overflow-hidden
							before:pointer-events-none
							before:absolute
							before:inset-0
							before:z-0
							before:origin-left
							before:scale-x-0
							before:transform
							before:bg-gray-medium
							before:transition-transform
							before:ease-linear
						"
						:class="buttonIsActive ? 'before:scale-x-100 before:duration-500' : 'before:scale-x-0 before:duration-200'"
						@mousedown="buttonIsActive = true"
						@mouseup="buttonIsActive = false"
						@touchstart.passive="buttonIsActive = true"
						@touchend.passive="buttonIsActive = false"
						@transitionend="stopTimer"
					>
						<span class="relative z-20">Hold to Stop</span>
					</BButton>

					<BButton
						class="ml-auto"
						:icon-name="timer?.isActive.value ? 'material-symbols-pause-rounded' : 'material-symbols-play-arrow-rounded'"
						@click="toggleTimer"
					/>
				</div>
			</div>
		</Transition>
		<div class="relative flex size-full flex-col">
			<div class="my-auto select-none">
				<span
					class="block text-center text-5xl font-semibold uppercase tabular-nums text-gray-medium"
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
					class="my-4 block text-center text-[30vw] font-semibold tabular-nums leading-none"
				>
					{{ secondsIntoMinutes(timeLeft) }}
				</span>

				<span class="block text-center text-5xl font-semibold uppercase text-gray-medium">
					{{ computedPhaseConfig.phase }}
				</span>
			</div>

			<Transition name="fade">
				<div v-if="currentPhase === TimerPhase.Done" class="absolute bottom-0 flex w-full flex-col space-y-4">
					<BButton variant="secondary" @click="repeatTimer">
						<BIcon name="material-symbols-replay-rounded" class="mr-2" />
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
