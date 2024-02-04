export default defineNuxtRouteMiddleware((to) => {
	const authStore = useAuthStore()

	if (import.meta.client) {
		authStore.syncLocalStorage()
	}

	if (!authStore.isAuthenticated && to.meta.auth) {
		return navigateTo('/')
	}
})
