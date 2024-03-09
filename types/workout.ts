import type { Exercise } from '@/types/exercise'

export type Workout = {
	id?: string
	workout_name: string
	workout_exercises: Exercise[]
	workout_sets: number
	user_id?: string
	created_at?: string
}

export type WorkoutEntry = {
	id?: string
	workout_name: string
	workout_exercises: Exercise[][]
	workout_initial_exercises: Exercise[]
	workout_sets: number
	workout_duration?: number
	workout_date: string
	user_id?: string
	created_at?: string
}
