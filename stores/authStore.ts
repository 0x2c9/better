import type { Session } from '@supabase/supabase-js'
import { defineStore } from 'pinia'

type UserCredentials = {
	email?: string
	password?: string
}

export const useAuthStore = defineStore('Authentication', () => {
	const supaClient = useSupabaseClient()
	const supabaseUser = useSupabaseUser()

	const userId = computed(() => {
		if (!supabaseUser.value)
			return null

		return supabaseUser.value.id
	})

	async function signIn(credentials: UserCredentials) {
		if (!supaClient) {
			console.error('[LOCAL]: Supabase client not found')
			return
		}

		if (!credentials.email || !credentials.password) {
			console.error('[LOCAL]: Missing credentials')
			return
		}

		const response = await supaClient.auth.signInWithPassword({
			email: credentials.email,
			password: credentials.password,
		})

		if (response.error) {
			console.error(response.error)
			return
		}

		await navigateTo('/home')
	}

	async function signUp(credentials: UserCredentials) {
		if (!supaClient) {
			console.error('[LOCAL]: Supabase client not found')
			return
		}

		if (!credentials.email || !credentials.password) {
			console.error('[LOCAL]: Missing credentials')
			return
		}

		const response = await supaClient.auth.signUp({
			email: credentials.email,
			password: credentials.password,
		})

		if (response.error) {
			console.error(response.error)
			return
		}

		await navigateTo('/home?onboarding=true')
	}

	async function signOut() {
		await supaClient.auth.signOut()
		await navigateTo('/')
	}

	return {
		userId,
		signIn,
		signUp,
		signOut,
	}
})
