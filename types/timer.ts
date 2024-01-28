export type ITimer = {
	id?: string
	name: string
	sets: number
	training_time: number
	pause_time: number
	duration: number
	user_id?: string
	created_at?: string
}

export type IInterval = {
	sets: number
	training_time: number
	pause_time: number
}
