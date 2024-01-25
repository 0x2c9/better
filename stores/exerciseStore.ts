import type { Exercise } from '@/types/exercise'

export const useExerciseStore = defineStore(
	'Exercise Store',
	() => {
		const DB_TABLE_NAME = 'exercises'
		const supaClient = useSupabase()
		const authStore = useAuthStore()

		const exercises = ref<Exercise[]>([])

		async function upsertExercise(formData: Exercise) {
			try {
				const exercise = {
					...formData,
					user_id: authStore.userId!,
				}

				const { data, error } = await supaClient.from(DB_TABLE_NAME).upsert(exercise).select().single()

				if (error) {
					throw new Error(error.message)
				}

				const exerciseIndex = exercises.value.findIndex((exercise) => exercise.id === data?.id)

				if (exerciseIndex === -1) {
					exercises.value.unshift(data as Exercise)
				} else {
					exercises.value[exerciseIndex] = data as Exercise
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

			exercises.value = data as Exercise[]
		}

		async function deleteExercise(exerciseId: string) {
			exercises.value = exercises.value.filter((exercise) => exercise.id !== exerciseId)

			const { error } = await supaClient.from(DB_TABLE_NAME).delete().match({ id: exerciseId })

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
