<script setup lang="ts">
import type { Exercise } from '~/types/exercise'
import type { WorkoutEntry } from '~/types/workout'

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

const computedSetAnalytics = computed(() => {
	const result = []

	for (const exerciseSet of completedExercises.value) {
		const set = []

		for (const actualExercise of exerciseSet) {
			const initialExercise = initialExercises.value.find((actual) => actual.id === actualExercise.id) as Exercise
			const exerciseName = actualExercise.exercise_name
			if (initialExercise.exercise_type === 'reps' && actualExercise.exercise_type === 'reps') {
				const actualValue = actualExercise.done ? actualExercise.exercise_repetitions : 0
				const initialValue = initialExercise.exercise_repetitions

				const isCompleted = actualExercise.done

				const actualPercentage = actualExercise.done ? (actualValue / initialValue) * 100 : 0
				const percentage = actualPercentage > 100 ? 100 : actualPercentage

				set.push({
					exerciseName,
					isCompleted,
					percentage,
					actualPercentage,
					actualValue,
					initialValue,
				})
			}

			if (initialExercise.exercise_type === 'time' && actualExercise.exercise_type === 'time') {
				const actualValue = actualExercise.done ? actualExercise.exercise_training_time * actualExercise.exercise_sets : 0
				const initialValue = initialExercise.exercise_training_time * initialExercise.exercise_sets

				const isCompleted = actualExercise.done

				const actualPercentage = actualExercise.done ? (actualValue / initialValue) * 100 : 0
				const percentage = actualPercentage > 100 ? 100 : actualPercentage

				set.push({
					exerciseName,
					isCompleted,
					percentage,
					actualPercentage,
					actualValue,
					initialValue,
				})
			}
		}

		result.push(set)
	}

	return result
})

const computedWorkoutAnalytics = computed(() => {
	const resultObj: Record<string, { actualValue: number, initialValue: number, type: 'reps' | 'time' }> = {}
	for (const exerciseSet of completedExercises.value) {
		for (const exercise of exerciseSet) {
			const initialExercise = initialExercises.value.find((actual) => actual.id === exercise.id) as Exercise

			if (exercise.done) {
				if (exercise.exercise_type === 'reps' && initialExercise.exercise_type === 'reps') {
					if (resultObj[exercise.exercise_name]) {
						resultObj[exercise.exercise_name].actualValue += exercise.exercise_repetitions
						resultObj[exercise.exercise_name].initialValue += initialExercise.exercise_repetitions
					} else {
						resultObj[exercise.exercise_name] = {
							actualValue: exercise.exercise_repetitions,
							initialValue: initialExercise.exercise_repetitions,
							type: 'reps',
						}
					}
				} else if (exercise.exercise_type === 'time' && initialExercise.exercise_type === 'time') {
					if (resultObj[exercise.exercise_name]) {
						resultObj[exercise.exercise_name].actualValue += exercise.exercise_training_time * exercise.exercise_sets
						resultObj[exercise.exercise_name].initialValue += initialExercise.exercise_training_time * initialExercise.exercise_sets
					} else {
						resultObj[exercise.exercise_name] = {
							actualValue: exercise.exercise_training_time * exercise.exercise_sets,
							initialValue: initialExercise.exercise_training_time * initialExercise.exercise_sets,
							type: 'time',
						}
					}
				}
			}
		}
	}

	const result = Object.entries(resultObj).map(([exerciseName, { actualValue, initialValue }]) => {
		const actualPercentage = (actualValue / initialValue) * 100
		const percentage = actualPercentage > 100 ? 100 : actualPercentage
		return {
			exerciseName,
			actualValue,
			initialValue,
			actualPercentage,
			percentage,
		}
	})

	return result
})

async function onDeleteWorkoutEntry() {
	if (completedWorkout.value) {
		showConfirmDeleteEntry.value = false
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
				<h2 class="text-xl font-semibold">
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
			<section v-if="computedWorkoutAnalytics.length" class="mb-4 rounded-lg bg-white p-4 shadow-better">
				<h3 class="mb-2 text-lg font-semibold">
					Workout analytics
				</h3>
				<ul class="space-y-4">
					<li
						v-for="(exercise, exerciseIndex) in computedWorkoutAnalytics"
						:key="exerciseIndex"
						class="flex flex-col"
					>
						<div class="flex items-center justify-between font-semibold">
							<p>
								{{ exercise.exerciseName }}
							</p>
							<p>
								{{ exercise.actualValue }} / {{ exercise.initialValue }}
							</p>
						</div>

						<div class="relative h-2 w-full rounded-full bg-black">
							<div
								class="absolute inset-y-0 left-0 rounded-full"
								:class="{
									'bg-green': exercise.actualPercentage > 100,
									'bg-blue': exercise.actualPercentage === 100,
									'bg-red': exercise.actualPercentage < 100,
								}"
								:style="{
									width: `${exercise.percentage}%`,
								}"
							></div>
						</div>
					</li>
				</ul>
			</section>
			<section
				v-for="(exerciseSet, setIndex) in computedSetAnalytics"
				:key="setIndex"
				class="mb-4 rounded-lg bg-white p-4 shadow-better"
			>
				<h3 class="mb-2 text-lg font-semibold">
					Set {{ setIndex + 1 }}
				</h3>
				<ul class="space-y-4">
					<li
						v-for="(exercise, exerciseIndex) in exerciseSet"
						:key="exerciseIndex"
						class="flex flex-col"
					>
						<div class="flex items-center justify-between font-semibold">
							<p>
								{{ exercise.exerciseName }}
							</p>
							<p>
								{{ exercise.actualValue }} / {{ exercise.initialValue }}
							</p>
						</div>

						<div class="relative h-2 w-full rounded-full bg-black">
							<div
								class="absolute inset-y-0 left-0 rounded-full"
								:class="{
									'bg-green': exercise.actualPercentage > 100,
									'bg-blue': exercise.actualPercentage === 100,
									'bg-red': exercise.actualPercentage < 100,
								}"
								:style="{
									width: `${exercise.percentage}%`,
								}"
							></div>
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
