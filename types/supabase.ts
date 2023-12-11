export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[]

export interface Database {
	public: {
		Tables: {
			user_timers: {
				Row: {
					id: string
					name: string | null
					pause_time: number
					sets: number
					training_time: number
					user_id: string
				}
				Insert: {
					id?: string
					name?: string | null
					pause_time: number
					sets: number
					training_time: number
					user_id: string
				}
				Update: {
					id?: string
					name?: string | null
					pause_time?: number
					sets?: number
					training_time?: number
					user_id?: string
				}
				Relationships: [
					{
						foreignKeyName: 'user_timers_user_id_fkey'
						columns: ['user_id']
						referencedRelation: 'users'
						referencedColumns: ['id']
					},
				]
			}
			user_weight_entries: {
				Row: {
					date: string
					id: string
					user_date_id: string
					user_id: string
					weight: number
				}
				Insert: {
					date: string
					id?: string
					user_date_id: string
					user_id: string
					weight: number
				}
				Update: {
					date?: string
					id?: string
					user_date_id?: string
					user_id?: string
					weight?: number
				}
				Relationships: [
					{
						foreignKeyName: 'user_weight_entries_user_id_fkey'
						columns: ['user_id']
						referencedRelation: 'users'
						referencedColumns: ['id']
					},
				]
			}
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			[_ in never]: never
		}
		Enums: {
			[_ in never]: never
		}
		CompositeTypes: {
			[_ in never]: never
		}
	}
}
