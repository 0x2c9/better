import type { Exercise } from '@/types/exercise'

export type Workout = {
	id?: string
	workout_name: string
	workout_exercises: Exercise[]
	user_id?: string
	created_at?: string
}
