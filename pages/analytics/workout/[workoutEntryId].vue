<script setup lang="ts">
import type { Exercise, RepsExercise } from '~/types/exercise'
import type { Workout, WorkoutEntry } from '~/types/workout'

definePageMeta({
	layout: 'app',
	auth: true,
})

const workoutStore = useWorkoutStore()
const route = useRoute()
const completedWorkout = ref<WorkoutEntry>()

const completedExercises = ref<Exercise[][]>([])
const showConfirmDeleteEntry = ref(false)

const initialExercises = ref<Exercise[]>([])

onMounted(async () => {
	try {
		completedWorkout.value = await workoutStore.getWorkoutEntryById(route.params.workoutEntryId as string)
		completedExercises.value = completedWorkout.value.workout_exercises
		initialExercises.value = completedWorkout.value.workout_initial_exercises
	} catch (error) {
		console.log(error)
	}
})

const computedAnalytics = computed(() => {
	const result = []

	for (const exerciseSet of completedExercises.value) {
		const set = []

		for (const actualExercise of exerciseSet) {
			const initialExercise = initialExercises.value.find((actual) => actual.id === actualExercise.id) as Exercise

			if (initialExercise.exercise_type === 'reps' && actualExercise.exercise_type === 'reps') {
				const actualRepetitions = actualExercise.exercise_repetitions
				const expectedRepetitions = initialExercise.exercise_repetitions

				const isCompleted = actualExercise.done
				const isLess = actualRepetitions < expectedRepetitions
				const isMore = actualRepetitions > expectedRepetitions

				const percentage = actualExercise.done ? (actualRepetitions / expectedRepetitions) * 100 : 0

				set.push({
					...actualExercise,
					isCompleted,
					isLess,
					isMore,
					percentage,
					actualRepetitions,
					expectedRepetitions,
				})
			}

			if (initialExercise.exercise_type === 'time' && actualExercise.exercise_type === 'time') {
				const actualTime = actualExercise.exercise_training_time * actualExercise.exercise_sets
				const expectedTime = initialExercise.exercise_training_time * initialExercise.exercise_sets

				const isCompleted = actualExercise.done
				const isLess = actualTime < expectedTime
				const isMore = actualTime > expectedTime

				const percentage = actualExercise.done ? (actualTime / expectedTime) * 100 : 0

				set.push({
					...actualExercise,
					isCompleted,
					isLess,
					isMore,
					percentage,
					actualTime,
					expectedTime,
				})
			}
		}

		result.push(set)
	}

	return result
})

async function onDeleteWorkoutEntry() {
	if (completedWorkout.value) {
		await workoutStore.deleteWorkoutEntry(completedWorkout.value.id!)
		navigateTo('/home')
	}
}
</script>

<template>
	<article class="w-full">
		<section v-if="!completedWorkout">
			<p>Loading...</p>
		</section>
		<section v-else>
			<div class="flex items-center gap-x-4 pb-4">
				<NuxtLink to="/home">
					<BIcon
						name="material-symbols-arrow-back-rounded"
						size="24"
					/>
				</NuxtLink>
				<h2 class="text-xl font-bold">
					{{ completedWorkout?.workout_name }}
				</h2>

				<BButton
					class="ml-auto"
					variant="danger"
					small
					@click="showConfirmDeleteEntry = true"
				>
					Delete
				</BButton>
			</div>

			<section v-for="(exerciseSet, setIndex) in computedAnalytics" :key="setIndex">
				<h3 class="mb-2 text-lg font-bold">
					Set {{ setIndex + 1 }}
				</h3>
				<ul class="space-y-2">
					<li
						v-for="(exercise, exerciseIndex) in exerciseSet"
						:key="exerciseIndex"
						class="grid grid-cols-3 items-center"
					>
						<p class="ml-2">
							{{ exercise.exercise_name }}
						</p>

						<div class="relative h-2 flex-1 rounded-full bg-neutral-600">
							<div
								class="absolute inset-y-0 left-0 rounded-full"
								:class="{
									'bg-green': exercise.isMore,
									'bg-red': exercise.isLess,
									'bg-blue': exercise.isCompleted,
								}"
								:style="{
									width: `${exercise.percentage}%`,
								}"
							></div>
						</div>

						<div class="ml-auto">
							<p
								v-if="exercise.exercise_type === 'reps'"
								class="text-sm"
							>
								{{ exercise.actualRepetitions }} / {{ exercise.expectedRepetitions }}
							</p>
							<p
								v-else-if="exercise.exercise_type === 'time'"
								class="text-sm"
							>
								{{ exercise.actualTime }}s / {{ exercise.expectedTime }}s
							</p>
						</div>
					</li>
				</ul>
			</section>
		</section>

		<LazyBDrawer v-model="showConfirmDeleteEntry">
			<section v-if="completedWorkout" class="flex flex-col">
				<h1 class="text-xl font-semibold">
					Do you want to delete this workout entry?
				</h1>
				<p class="mt-2 text-lg">
					This action cannot be undone.
				</p>
				<BButton
					class="mt-8"
					variant="primary"
					@click="onDeleteWorkoutEntry"
				>
					Confirm and delete
				</BButton>
				<BButton
					class="mt-4"
					variant="secondary"
					@click="showConfirmDeleteEntry = false"
				>
					Stay
				</BButton>
			</section>
		</LazyBDrawer>
	</article>
</template>
