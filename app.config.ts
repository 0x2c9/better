export default defineAppConfig({
	unauthenticatedRoutes: {
		index: '/',
		login: '/login',
		register: '/register',
	},
	authenticatedRoutes: {
		appHome: '/home',
	},
})
