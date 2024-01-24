export default defineNuxtRouteMiddleware((to) => {
	const authStore = useAuthStore()

	authStore.syncLocalStorage()

	if (!authStore.isAuthenticated && to.meta.auth) {
		return navigateTo('/')
	}
})
