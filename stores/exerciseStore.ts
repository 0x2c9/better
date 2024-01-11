import type { IExercise } from '@/types/exercise'

export const useExerciseStore = defineStore(
	'Exercise Store',
	() => {
		const DB_TABLE_NAME = 'exercises'
		const supaClient = useSupabase()
		const authStore = useAuthStore()

		const exercises = ref<IExercise[]>([])

		async function upsertExercise(formData: IExercise) {
			try {
				const exercise = {
					...formData,
					user_id: authStore.userId!,
				}

				const { data, error } = await supaClient.from(DB_TABLE_NAME).upsert(exercise).select().single()

				if (error) {
					throw new Error(error.message)
				}

				const timerIndex = exercises.value.findIndex((exercise) => exercise.id === data?.id)

				if (timerIndex === -1) {
					exercises.value.unshift(data as IExercise)
				} else {
					exercises.value[timerIndex] = data as IExercise
				}
			} catch (error) {
				console.log(error)
			}
		}

		async function getExercises() {
			const { data, error } = await supaClient.from(DB_TABLE_NAME).select()

			if (error) {
				throw new Error(error.message)
			}

			exercises.value = data as IExercise[]
		}

		async function deleteExercise(timerId: string) {
			exercises.value = exercises.value.filter((timer) => timer.id !== timerId)

			const { error } = await supaClient.from(DB_TABLE_NAME).delete().match({ id: timerId })

			if (error) {
				throw new Error(error.message)
			}
		}

		return {
			exercises,
			upsertExercise,
			getExercises,
			deleteExercise,
		}
	},
)
