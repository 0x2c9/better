import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import pkg from './package.json'

dayjs.locale('de')
dayjs.extend(utc)

const appVersion = `v${pkg.version}-${dayjs().utcOffset(1).format('DD.MM.YYYY.HHmmss')}`

console.log(`App Version: ${appVersion}`)

export default defineNuxtConfig({
	app: {
		head: {
			htmlAttrs: {
				lang: 'en',
			},
			charset: 'utf-8',
			viewport: 'width=device-width, initial-scale=1.0, user-scalable=no',
			title: 'better - Track your weight loss and fitness journey with ease.',
			meta: [
				{
					name: 'description',
					content: 'Create and start your workouts with an integrated Timer, track your weight and archive your fitness goals with Better.',
				},
				{
					name: 'theme-color',
					content: '#000000',
				},
			],
			link: [
				{
					rel: 'icon',
					type: 'image/svg+xml',
					href: '/favicon.svg',
				},
				{
					rel: 'icon',
					sizes: '48x48',
					href: '/favicon.ico',
				},
				{
					rel: 'apple-touch-icon',
					sizes: '180x180',
					href: '/apple-touch-icon-180x180.png',
				},
			],
		},
		pageTransition: {
			name: 'page',
			mode: 'out-in',
		},
		layoutTransition: {
			name: 'page',
			mode: 'out-in',
		},
	},
	css: [
		'@/assets/fonts/geist.css',
		'@/assets/styles.css',
	],
	debug: false,
	devtools: {
		enabled: false,
	},
	experimental: {
		payloadExtraction: true,
	},
	imports: {
		dirs: [
			'icons',
		],
	},
	modules: [
		'@pinia/nuxt',
		'@vueuse/nuxt',
		'@vite-pwa/nuxt',
	],
	postcss: {
		plugins: {
			tailwindcss: {},
		},
	},
	pwa: {
		mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
		disable: false,
		scope: '/',
		strategies: 'generateSW',
		registerType: 'prompt',
		workbox: {
			navigateFallbackDenylist: [
				/^\/workout/,
				/^\/analytics/,
			],
			globPatterns: [
				'**/*.{js,css,html,svg,ico,woff,woff2,json,ogg}',
			],
		},
		devOptions: {
			enabled: process.env.PWA_DEV === 'true',
			type: 'module',
			suppressWarnings: true,
		},
		manifest: {
			name: 'better - Track your weight loss and fitness journey with ease.',
			short_name: 'better',
			description: 'Create and start your workouts with an integrated Timer, track your weight and archive your fitness goals with Better',
			theme_color: '#000000',
			background_color: '#000000',
			display: 'standalone',
			orientation: 'portrait',
			scope: '/',
			icons: [
				{
					src: 'pwa-64x64.png',
					sizes: '64x64',
					type: 'image/png',
				},
				{
					src: 'pwa-192x192.png',
					sizes: '192x192',
					type: 'image/png',
				},
				{
					src: 'pwa-512x512.png',
					sizes: '512x512',
					type: 'image/png',
					purpose: 'any',
				},
				{
					src: 'maskable-icon-512x512.png',
					sizes: '512x512',
					type: 'image/png',
					purpose: 'maskable',
				},
			],
			screenshots: [
				{
					src: 'pwa_screenshot_weight.png',
					sizes: '768x1544',
					type: 'image/png',
				},
				{
					src: 'pwa_screenshot_create_workout.png',
					sizes: '768x1544',
					type: 'image/png',
				},
				{
					src: 'pwa_screenshot_workout.png',
					sizes: '768x1544',
					type: 'image/png',
				},
			],
		},
	},
	runtimeConfig: {
		public: {
			supabase: {
				url: '',
				key: '',
			},
			appVersion,
		},
	},
	ssr: false,
	typescript: {
		strict: true,
	},
	vite: {
		vue: {
			script: {
				defineModel: true,
				propsDestructure: true,
			},
		},
	},
})
