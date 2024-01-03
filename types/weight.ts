export interface IWeightEntry {
	date: string
	id: string
	user_date_id: string
	user_id: string
	weight: number
	date_display: string
	weight_display: string
}

export interface IWeightEntryFormData {
	date: string
	weight: number
	id?: string
	user_id?: string
}

export type IWeightEntryUnsaved = Omit<IWeightEntry, 'id' | 'created_at' | 'updated_at'>

export type IWeightEntrySorted = IWeightEntry & {
	progress: 'increase' | 'decrease' | 'same'
}
