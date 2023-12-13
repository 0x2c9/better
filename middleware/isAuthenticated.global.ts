export default defineNuxtRouteMiddleware((to) => {
	const authStore = useAuthStore()
	const appConfig = useAppConfig()

	authStore.syncLocalStorage()

	const authenticatedRoutes = Object.values(appConfig.authenticatedRoutes)

	if (!authStore.isAuthenticated && authenticatedRoutes.includes(to.path)) {
		return navigateTo(appConfig.unauthenticatedRoutes.index)
	}
})
