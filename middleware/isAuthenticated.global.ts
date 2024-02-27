export default defineNuxtRouteMiddleware((to) => {
	const user = useSupabaseUser()

	if (user.value && !to.meta.auth) {
		return navigateTo('/home')
	}

	if (!user.value && to.meta.auth) {
		return navigateTo('/login')
	}
})
