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

const actualExercises = ref<Exercise[]>([])

onMounted(async () => {
	try {
		completedWorkout.value = await workoutStore.getWorkoutEntryById(route.params.workoutEntryId as string)
		completedExercises.value = completedWorkout.value.workout_exercises
		actualExercises.value = completedWorkout.value.workout_actual_exercises
	} catch (error) {
		console.log(error)
	}
})

const computedAnalytics = computed(() => {
	const result = []

	for (const exerciseSet of completedExercises.value) {
		const set = []

		for (const exercise of exerciseSet) {
			const actualExercise = actualExercises.value.find((actual) => actual.id === exercise.id) as Exercise

			if (actualExercise.exercise_type === 'reps' && exercise.exercise_type === 'reps') {
				const actualRepetitions = exercise.exercise_repetitions
				const expectedRepetitions = actualExercise.exercise_repetitions

				const isCompleted = actualRepetitions === expectedRepetitions
				const isLess = actualRepetitions < expectedRepetitions
				const isMore = actualRepetitions > expectedRepetitions

				const percentage = (actualRepetitions / expectedRepetitions) * 100

				set.push({
					...exercise,
					isCompleted,
					isLess,
					isMore,
					percentage,
					actualRepetitions,
					expectedRepetitions,
				})
			}

			if (actualExercise.exercise_type === 'time' && exercise.exercise_type === 'time') {
				const actualTime = exercise.exercise_training_time * exercise.exercise_sets
				const expectedTime = actualExercise.exercise_training_time * actualExercise.exercise_sets

				const isCompleted = actualTime === expectedTime
				const isLess = actualTime < expectedTime
				const isMore = actualTime > expectedTime

				const percentage = (actualTime / expectedTime) * 100

				set.push({
					...exercise,
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
</script>

<template>
	<article class="w-full">
		<section v-if="!completedWorkout">
			<p>Loading...</p>
		</section>
		<section v-else>
			<div class="flex items-center gap-x-2 pb-4">
				<NuxtLink

					to="/home"
				>
					<BIcon
						name="material-symbols-arrow-back-rounded"
						size="24"
					/>
				</NuxtLink>
				<h2 class="text-xl font-bold">
					{{ completedWorkout?.workout_name }}
				</h2>
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
	</article>
</template>
