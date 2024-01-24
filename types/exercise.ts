type ExerciseCommon = {
	id?: string
	exercise_name: string
	done?: boolean
	user_id?: string
	listId?: string
}

export type RepsExercise = ExerciseCommon & {
	exercise_type: 'reps'
	exercise_repetitions: number
}

export type TimeExercise = ExerciseCommon & {
	exercise_type: 'time'
	exercise_sets: number
	exercise_duration: number
	exercise_training_time: number
	exercise_pause_time: number
}

export type Exercise = RepsExercise | TimeExercise
