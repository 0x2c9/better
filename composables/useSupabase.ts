import type { SupabaseClient } from '@supabase/supabase-js'

export function useSupabaseClient<T>() {
	return useNuxtApp().$supabase?.client as SupabaseClient<T>
}
