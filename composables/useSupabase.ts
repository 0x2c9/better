import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'

import { useNuxtApp, useRuntimeConfig } from '#imports'
import type { Database } from '~/types/supabase'

export function useSupabase() {
	const nuxtApp = useNuxtApp()
	const cfg = useRuntimeConfig()

	if (!nuxtApp._supabaseClient) {
		const supabaseClient = createClient(
			cfg.public.supabase.url,
			cfg.public.supabase.key,
			{
				auth: {
					storageKey: 'supabase.auth.session',
				},
			},
		)

		nuxtApp._supabaseClient = supabaseClient
	}

	return nuxtApp._supabaseClient as SupabaseClient<Database>
}
