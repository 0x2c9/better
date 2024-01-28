export type WeightEntry = {
	id?: string
	date: string
	user_date_id?: string
	user_id?: string
	weight: number
	date_display?: string
	weight_display?: string
	progress?: 'increase' | 'decrease' | 'same'
}
