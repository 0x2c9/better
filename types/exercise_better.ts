export type ExerciseType = 'reps' | 'time'
export type DurationType = 'sets' | 'single'

export interface IExercise {
	id?: string
	exercise_name: string
	user_id?: string
}

export interface IExerciseRepetition extends IExercise {
	repetition: number
}

export interface IExerciseTimeSingle extends IExercise {
	duration_type: 'single'
	duration: number
}

export interface IExerciseTimeSets extends IExercise {
	duration_type: 'sets'
	sets: number
	exercise_training_time: number
	exercise_pause_time: number
	set_duration: number
}

export type Exercise =
    | (IExerciseRepetition & { exercise_type: 'reps' })
    | (IExerciseTimeSingle & { exercise_type: 'time' })
    | (IExerciseTimeSets & { exercise_type: 'time' })
