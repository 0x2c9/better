import type { Session } from '@supabase/supabase-js'
import { defineStore } from 'pinia'

type UserCredentials = {
	email?: string
	password?: string
}

export const useAuthStore = defineStore('Authentication', () => {
	const supaClient = useSupabase()
	const userSession = ref<Session | null>(null)

	const isAuthenticated = computed(() => !!userSession.value)

	const userId = computed(() => {
		if (!userSession.value)
			return null

		return userSession.value.user.id
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
		userSession.value = null
		await navigateTo('/')
	}

	function syncLocalStorage() {
		const storedSession = localStorage.getItem('supabase.auth.session')

		if (!storedSession) {
			return
		}

		const parsedSession = JSON.parse(storedSession) as Session

		userSession.value = parsedSession
	}

	return {
		userSession,
		isAuthenticated,
		userId,
		syncLocalStorage,
		signIn,
		signUp,
		signOut,
	}
})
