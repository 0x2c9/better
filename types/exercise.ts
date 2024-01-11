export interface IExercise {
	id?: string
	name: string
	exercise_type: 'reps' | 'duration'
	exercise_duration: number
	exercise_repetions: number
	user_id?: string
}
