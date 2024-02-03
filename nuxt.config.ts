export default defineNuxtConfig({
	app: {
		head: {
			htmlAttrs: {
				lang: 'en',
			},
			charset: 'utf-8',
			viewport: 'width=device-width, initial-scale=1.0, user-scalable=no',
			title: 'better - Track your weight loss and fitness journey',
			meta: [
				{
					name: 'description',
					content: 'better helps you monitor your weight, exercise and nutrition to achieve your fitness goals.',
				},
				{
					name: 'theme-color',
					content: '#0B0B0A',
				},
			],
			link: [
				{
					rel: 'icon',
					type: 'image/svg+xml',
					href: './favicon.svg',
				},
				{
					rel: 'icon',
					sizes: '48x48',
					href: './favicon.ico',
				},
				{
					rel: 'apple-touch-icon',
					sizes: '180x180',
					href: './apple-touch-icon-180x180.png',
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
	devtools: {
		enabled: false,
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
		mode: 'development',
		disable: false,
		scope: '/',
		srcDir: './service-worker',
		strategies: 'generateSW',
		devOptions: {
			enabled: true,
			type: 'module',
		},
		manifest: {
			name: 'better - Track your weight loss and fitness journey',
			short_name: 'better',
			description: 'better helps you monitor your weight, exercise and nutrition to achieve your fitness goals.',
			theme_color: '#0B0B0A',
			background_color: '#0B0B0A',
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
