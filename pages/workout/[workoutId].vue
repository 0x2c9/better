<script setup lang="ts">
import dayjs from 'dayjs'
import type { Exercise, TimeExercise } from '~/types/exercise'
import type { Workout, WorkoutEntry } from '~/types/workout'

definePageMeta({
	layout: 'empty',
	auth: true,
})

const workoutStore = useWorkoutStore()
const route = useRoute()
const { secondsIntoMinutes } = useUtils()

const selectedWorkout = ref<Workout>()
const workoutExercises = ref<Exercise[][]>([])

onMounted(async () => {
	try {
		selectedWorkout.value = await workoutStore.getWorkoutById(route.params.workoutId as string)
		for (let i = 0; i < selectedWorkout.value.workout_sets; i++) {
			const duplicatedExercises = JSON.parse(JSON.stringify(selectedWorkout.value.workout_exercises)) as Exercise[]
			workoutExercises.value[i] = duplicatedExercises.map((exercise) => {
				exercise.listId = `${exercise.listId}-${i}`

				return exercise
			})
		}
	} catch (error) {
		console.log(error)
	}
})

const openExerciseForm = ref(false)
const selectedExercise = ref<Exercise | null>(null)
const activeSet = ref(1)

function onSelectExercise(item: Exercise) {
	selectedExercise.value = item
	openExerciseForm.value = true
}

function onExerciseChange(updatedExercise: Exercise) {
	openExerciseForm.value = false
	const index = workoutExercises.value[activeSet.value - 1].findIndex((exercise) => {
		return exercise.listId === updatedExercise.listId
	})

	if (index !== -1) {
		workoutExercises.value[activeSet.value - 1][index] = updatedExercise
	}
}

const timedExercise = ref<TimeExercise | null>(null)

function onStartExercise(item: TimeExercise) {
	timedExercise.value = item
}

function onStopTimer() {
	timedExercise.value = null
}

function onDoneTimer(exercise: Exercise) {
	timedExercise.value = null
	for (const workoutExercise of workoutExercises.value[activeSet.value - 1]) {
		if (workoutExercise.listId === exercise.listId) {
			workoutExercise.done = true
		}
	}
}

const workoutTimeInSeconds = ref(0)

const { pause, resume, isActive } = useIntervalFn(() => {
	workoutTimeInSeconds.value++
}, 1000, {
	immediate: false,
	immediateCallback: true,
})

function resetWorkoutTimer() {
	pause()
	workoutTimeInSeconds.value = 0
}

function toggleWorkoutTimer() {
	if (isActive.value) {
		pause()
	} else {
		resume()
	}
}

function beforeUnloadHandler(event: BeforeUnloadEvent) {
	event.preventDefault()
	event.returnValue = ''
}

if (import.meta.client) {
	window.addEventListener('beforeunload', beforeUnloadHandler)
}

onBeforeRouteLeave(() => {
	window.removeEventListener('beforeunload', beforeUnloadHandler)
})

const showConfirmLeaveModal = ref(false)
const showConfirmSaveModal = ref(false)

function onGoBack() {
	showConfirmLeaveModal.value = true
}

function leaveCurrentWorkout() {
	navigateTo('/workouts')
}
function stayOnWorkout() {
	showConfirmLeaveModal.value = false
	showConfirmSaveModal.value = false
}

const undoneWorkouts = ref<Exercise[]>([])

function onSaveWorkout() {
	undoneWorkouts.value = []
	showConfirmSaveModal.value = true

	for (const workoutSet of workoutExercises.value) {
		for (const workoutExercise of workoutSet) {
			if (!workoutExercise.done) {
				undoneWorkouts.value.push(workoutExercise)
			}
		}
	}
}

async function saveWorkoutAndLeave() {
	if (!selectedWorkout.value) {
		return
	}

	pause()

	const payload: WorkoutEntry = {
		workout_id: selectedWorkout.value.id!,
		workout_actual_exercises: selectedWorkout.value.workout_exercises,
		workout_name: selectedWorkout.value.workout_name,
		workout_exercises: workoutExercises.value,
		workout_sets: selectedWorkout.value.workout_sets,
		workout_duration: workoutTimeInSeconds.value,
		workout_date: dayjs().format('YYYY-MM-DD'),
	}
	await workoutStore.saveWorkoutEntry(payload)
	navigateTo('/workouts')
}

const computedWorkoutExercises = computed(() => {
	return workoutExercises.value[activeSet.value - 1]
})
</script>

<template>
	<article class="relative flex h-full flex-col">
		<audio
			preload="auto"
			aria-hidden="true"
		>
			<source
				src="/sounds/2x-beep.ogg"
				type="audio/ogg"
			>
		</audio>
		<audio
			preload="auto"
			aria-hidden="true"
		>
			<source
				src="/sounds/3x-beep.ogg"
				type="audio/ogg"
			>
		</audio>
		<audio
			preload="auto"
			aria-hidden="true"
		>
			<source
				src="/sounds/long-beep.ogg"
				type="audio/ogg"
			>
		</audio>
		<audio
			preload="auto"
			aria-hidden="true"
		>
			<source
				src="/sounds/short-beep.ogg"
				type="audio/ogg"
			>
		</audio>
		<div class="flex-1 overflow-y-auto px-4 py-6">
			<header class="mb-4 flex items-center justify-between">
				<BButton
					variant="outline"
					small
					@click="onGoBack"
				>
					<BIcon name="material-symbols-arrow-back-rounded" class="-ml-2 mr-2" />
					Leave Workout
				</BButton>
				<BButton
					variant="primary"
					small
					@click="onSaveWorkout"
				>
					Save Workout
				</BButton>
			</header>
			<WorkoutExerciseList
				v-if="selectedWorkout"
				key-field="listId"
				:items="computedWorkoutExercises"
				:disable-delete="true"
				@select-exercise="onSelectExercise"
				@start-exercise="onStartExercise"
			/>
		</div>

		<ExerciseForm
			v-model="openExerciseForm"
			:selected-exercise="selectedExercise"
			:prevent-submit="true"
			@submit-exercise="onExerciseChange"
		/>

		<Teleport to="body">
			<Transition name="fade">
				<LazyWorkoutIntervalTimer
					v-if="timedExercise"
					:exercise="timedExercise"
					@stop="onStopTimer"
					@done="onDoneTimer"
				/>
			</Transition>
		</Teleport>
		<footer class="border border-t-2 border-neutral-600/40 px-4">
			<nav class="b-box z-50 mb-4 mt-2 flex flex-col justify-center px-4 pb-4 pt-3">
				<div class="mb-2 flex justify-center">
					<Transition name="quick-fade" mode="out-in">
						<template v-if="workoutTimeInSeconds > 0">
							<span class="inline-flex min-h-8 items-center text-2xl">{{ secondsIntoMinutes(workoutTimeInSeconds) }}</span>
						</template>
						<template v-else>
							<span class="inline-flex min-h-8 items-center text-sm text-neutral-500">Track how long your workout takes. (optional)</span>
						</template>
					</Transition>
				</div>
				<div class="mb-6 flex flex-row gap-x-4">
					<BButton
						v-if="workoutTimeInSeconds > 0"
						class="flex-1"
						small
						variant="outline"
						@click="resetWorkoutTimer"
					>
						Reset Timer
					</BButton>
					<BButton
						class="flex-1"
						small
						variant="secondary"
						@click="toggleWorkoutTimer"
					>
						<template v-if="isActive">
							Pause Timer
						</template>
						<template v-else>
							Start Timer
						</template>
					</BButton>
				</div>
				<BStepper
					v-model="activeSet"
					label="Current Set"
					:max="selectedWorkout?.workout_sets"
					:min="1"
					:steps="1"
					:computed-display-value="`${activeSet}/${selectedWorkout?.workout_sets}`"
				/>
			</nav>
		</footer>

		<ClientOnly>
			<LazyBDrawer v-model="showConfirmLeaveModal">
				<section class="flex flex-col">
					<h1 class="text-xl font-semibold">
						Do you want to leave your current workout?
					</h1>
					<p class="mt-2 text-lg">
						You are about to lose your current progress in your workout.
					</p>
					<BButton
						class="mt-8"
						variant="primary"
						@click="leaveCurrentWorkout"
					>
						Confirm and leave
					</BButton>
					<BButton
						class="mt-4"
						variant="secondary"
						@click="stayOnWorkout"
					>
						Stay
					</BButton>
				</section>
			</LazyBDrawer>
			<LazyBDrawer v-model="showConfirmSaveModal">
				<section class="flex flex-col">
					<h1 class="text-xl font-semibold">
						<template v-if="undoneWorkouts.length === 0">
							You are done with your workout!
						</template>
						<template v-else>
							Not all exercises are finished.
						</template>
					</h1>
					<p class="mt-2 text-lg">
						<template v-if="undoneWorkouts.length === 0">
							You are about to save your finished workout. You'll be redirected to the workout list.
						</template>
						<template v-else>
							You have some exercises that are not finished yet. Do you want to save your current workout anyway?
						</template>
					</p>
					<BButton
						class="mt-8"
						variant="primary"
						@click="saveWorkoutAndLeave"
					>
						Confirm and save
					</BButton>
					<BButton
						class="mt-4"
						variant="secondary"
						@click="stayOnWorkout"
					>
						Stay
					</BButton>
				</section>
			</LazyBDrawer>
		</ClientOnly>
	</article>
</template>
