import { createClient } from '@supabase/supabase-js'

import { defineNuxtPlugin, useCookie, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin({
	name: 'supabase',
	enforce: 'pre',
	async setup() {
		const { url, key } = useRuntimeConfig().public.supabase
		const accessToken = useCookie(`sb-access-token`).value
		const refreshToken = useCookie(`sb-refresh-token`).value

		const supabaseClient = createClient(url, key, {
			auth: {
				flowType: 'pkce',
				detectSessionInUrl: true,
				persistSession: true,
				autoRefreshToken: true,
			},
		})

		// Set user & session server side
		if (accessToken && refreshToken) {
			const { data } = await supabaseClient.auth.setSession({
				refresh_token: refreshToken,
				access_token: accessToken,
			})
			if (data?.user) {
				useSupabaseUser().value = data.user
			}
		}

		return {
			provide: {
				supabase: {
					client: supabaseClient,
				},
			},
		}
	},
})
