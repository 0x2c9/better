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
	immediate: true,
	immediateCallback: true,
})

function resetWorkoutTimer() {
	workoutTimeInSeconds.value = 0
}

const showConfirmLeaveModal = ref(false)
const showConfirmSaveModal = ref(false)
const allowUnload = ref(false)

function onGoBack() {
	showConfirmLeaveModal.value = true
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

function onConfirmAndLeave() {
	showConfirmLeaveModal.value = false
	allowUnload.value = true
	navigateTo('/workouts')
}

async function saveWorkoutAndLeave() {
	if (!selectedWorkout.value) {
		return
	}
	showConfirmSaveModal.value = false
	allowUnload.value = true
	pause()

	const payload: WorkoutEntry = {
		workout_initial_exercises: selectedWorkout.value.workout_exercises,
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

onBeforeRouteLeave(() => {
	if (!allowUnload.value) {
		// eslint-disable-next-line no-alert
		const answer = window.confirm('Do you really want to leave? Your progress will be lost.')
		if (!answer) {
			return false
		}
	}
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
			<header class="mb-4 flex  items-center justify-between">
				<div class="mb-2 flex flex-1 items-center justify-between">
					<BButton
						variant="outline"
						small
						@click="onGoBack"
					>
						Leave
					</BButton>
					<span class="inline-flex min-h-8 items-center text-2xl font-semibold tabular-nums">{{ secondsIntoMinutes(workoutTimeInSeconds) }}</span>
					<BButton
						variant="primary"
						small
						@click="onSaveWorkout"
					>
						Save
					</BButton>
				</div>
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
		<footer class="border border-t-2 border-gray-light bg-white px-4 py-5">
			<BStepper
				v-model="activeSet"
				label="Current Set"
				:max="selectedWorkout?.workout_sets"
				:min="1"
				:steps="1"
				:computed-display-value="`${activeSet}/${selectedWorkout?.workout_sets}`"
			/>
		</footer>

		<LazyBDrawer v-model="showConfirmLeaveModal">
			<section class="flex flex-col">
				<div class="mx-auto mb-4 mt-2 flex size-8 items-center justify-center rounded-full bg-black text-white">
					<BIcon
						size="28"
						name="material-symbols-exclamation-rounded"
					/>
				</div>

				<h1 class="mb-1 text-2xl font-semibold">
					Leaving workout
				</h1>
				<p class="text-lg">
					You are about to lose your current progress in your workout.
				</p>
				<BButton
					class="mt-8"
					variant="primary"
					@click="onConfirmAndLeave"
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
				<div class="mx-auto mb-4 mt-2 flex size-8 items-center justify-center rounded-full bg-black text-white">
					<BIcon
						size="28"
						:name="undoneWorkouts.length === 0 ? 'material-symbols-fitbit-check-small-rounded' : 'material-symbols-exclamation-rounded'"
					/>
				</div>
				<h1 class="mb-1 text-2xl font-semibold">
					<template v-if="undoneWorkouts.length === 0">
						You are done with your workout!
					</template>
					<template v-else>
						You are not done with your workout yet.
					</template>
				</h1>
				<p class="text-lg">
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
	</article>
</template>
