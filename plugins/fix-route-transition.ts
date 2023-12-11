// issue: https://github.com/vuejs/core/issues/8105
// solution: https://github.com/nuxt/nuxt/issues/13350#issuecomment-1649356108

import type { Router } from 'vue-router'

interface CustomRouter extends Router {
	running?: boolean
	nextRoute?: string | null
}

export default defineNuxtPlugin((nuxtApp) => {
	const customRouter: CustomRouter = useNuxtApp().$router

	nuxtApp.hook('page:start', () => {
		customRouter.running = false
		customRouter.beforeEach((to, _from, next) => {
			if (customRouter.running) {
				next(true)
			} else {
				customRouter.nextRoute = to.fullPath
				next(false)
			}
		})
	})
	nuxtApp.hook('page:transition:finish', async () => {
		customRouter.running = true
		if (customRouter.nextRoute) {
			await customRouter.push(customRouter.nextRoute)
			customRouter.nextRoute = null
		}
	})
})
