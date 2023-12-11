export interface ITimer {
	id?: string
	name: string
	sets: number
	training_time: number
	pause_time: number
	duration: number
	user_id?: string
}

export interface IInterval {
	sets: number
	training_time: number
	pause_time: number
}
