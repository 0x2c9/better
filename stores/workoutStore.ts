import type { Workout, WorkoutEntry } from '@/types/workout'

export const useWorkoutStore = defineStore(
	'Workout Store',
	() => {
		const DB_TABLE_NAME_WORKOUTS = 'workouts'
		const DB_TABLE_NAME_WORKOUTS_ENTRIES = 'workout_entries'
		const supaClient = useSupabase()
		const authStore = useAuthStore()

		const workouts = ref<Workout[]>([])

		async function upsertWorkout(formData: Workout) {
			try {
				const exercise = {
					...formData,
					user_id: authStore.userId!,
				}

				const { data, error } = await supaClient.from(DB_TABLE_NAME_WORKOUTS).upsert(exercise).select().single()

				if (error) {
					throw new Error(error.message)
				}

				const timerIndex = workouts.value.findIndex((exercise) => exercise.id === data?.id)

				if (timerIndex === -1) {
					workouts.value.unshift(data as Workout)
				} else {
					workouts.value[timerIndex] = data as Workout
				}
			} catch (error) {
				console.log(error)
			}
		}

		async function getWorkouts() {
			const { data, error } = await supaClient.from(DB_TABLE_NAME_WORKOUTS).select().order('created_at', { ascending: false })

			if (error) {
				throw new Error(error.message)
			}

			workouts.value = data as Workout[]
		}

		async function getWorkoutById(workoutId: string): Promise<Workout> {
			if (workouts.value.length > 0) {
				const workout = workouts.value.find((workout) => workout.id === workoutId)

				if (workout) {
					return workout
				}
			}
			const { data, error } = await supaClient.from(DB_TABLE_NAME_WORKOUTS).select().match({ id: workoutId }).single()

			if (error) {
				throw new Error(error.message)
			}

			return data
		}

		async function deleteWorkout(timerId: string) {
			workouts.value = workouts.value.filter((timer) => timer.id !== timerId)

			const { error } = await supaClient.from(DB_TABLE_NAME_WORKOUTS).delete().match({ id: timerId })

			if (error) {
				throw new Error(error.message)
			}
		}

		async function saveWorkoutEntry(workoutEntry: WorkoutEntry) {
			workoutEntry.user_id = authStore.userId!

			const { error } = await supaClient.from(DB_TABLE_NAME_WORKOUTS_ENTRIES).insert(workoutEntry)

			if (error) {
				throw new Error(error.message)
			}
		}

		return {
			workouts,
			upsertWorkout,
			getWorkouts,
			getWorkoutById,
			deleteWorkout,
			saveWorkoutEntry,
		}
	},
)
