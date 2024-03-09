export default defineNuxtRouteMiddleware((to) => {
	const authStore = useAuthStore()
	if (to.path === '/story') {
		return
	}

	authStore.syncLocalStorage()

	if (!authStore.isAuthenticated && to.meta.auth) {
		return navigateTo('/')
	}

	if (authStore.isAuthenticated && !to.meta.auth) {
		return navigateTo('/home')
	}
})
