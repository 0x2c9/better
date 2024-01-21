import type { IWorkout, IWorkoutResolved } from '@/types/workout'

export const useWorkoutStore = defineStore(
	'Workout Store',
	() => {
		const DB_TABLE_NAME = 'workouts'
		const supaClient = useSupabase()
		const authStore = useAuthStore()
		const exerciseStore = useExerciseStore()

		const workouts = ref<IWorkout[]>([])

		const resolvedWorkouts = computed<IWorkoutResolved[]>(() => {
			const result = []
			for (const workout of workouts.value) {
				const resolvedWorkout: IWorkoutResolved = {
					id: workout.id,
					name: workout.name,
					resolvedExercises: [],
				}
				for (const exerciseId of workout.exercise_ids) {
					const exercise = exerciseStore.exercises.find((e) => e.id === exerciseId)
					if (exercise) {
						resolvedWorkout.resolvedExercises.push(exercise)
					}
				}
				result.push(resolvedWorkout)
			}

			return result
		})

		async function upsertWorkout(formData: IWorkout) {
			try {
				const exercise = {
					...formData,
					user_id: authStore.userId!,
				}

				const { data, error } = await supaClient.from(DB_TABLE_NAME).upsert(exercise).select().single()

				if (error) {
					throw new Error(error.message)
				}

				const timerIndex = workouts.value.findIndex((exercise) => exercise.id === data?.id)

				if (timerIndex === -1) {
					workouts.value.unshift(data as IWorkout)
				} else {
					workouts.value[timerIndex] = data as IWorkout
				}
			} catch (error) {
				console.log(error)
			}
		}

		async function getWorkouts() {
			const { data, error } = await supaClient.from(DB_TABLE_NAME).select()

			if (error) {
				throw new Error(error.message)
			}

			workouts.value = data as IWorkout[]
		}

		async function deleteWorkout(timerId: string) {
			workouts.value = workouts.value.filter((timer) => timer.id !== timerId)

			const { error } = await supaClient.from(DB_TABLE_NAME).delete().match({ id: timerId })

			if (error) {
				throw new Error(error.message)
			}
		}

		return {
			workouts,
			resolvedWorkouts,
			upsertWorkout,
			getWorkouts,
			deleteWorkout,
		}
	},
)
