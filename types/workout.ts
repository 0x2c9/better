import type { IExercise } from '@/types/exercise'

export interface IWorkoutExercise extends IExercise {
	listId?: string
	done?: boolean
}

export interface IWorkout {
	id?: string
	name: string
	exercise_ids: string[]
	user_id?: string
}

export interface IWorkoutResolved {
	id?: string
	name: string
	resolvedExercises: IWorkoutExercise[]
	user_id?: string
}
