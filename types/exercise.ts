export interface IExercise {
	id?: string
	exercise_name: string
	exercise_type: 'reps' | 'time'
	exercise_repetions: number
	exercise_duration_type: 'sets' | 'single'
	exercise_sets: number
	exercise_set_duration: number
	exercise_training_time: number
	exercise_pause_time: number
	done?: boolean
	user_id?: string
}
