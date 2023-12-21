export default defineNuxtConfig({
	app: {
		head: {
			htmlAttrs: {
				lang: 'en',
			},
			charset: 'utf-8',
			viewport: 'width=device-width, initial-scale=1.0, user-scalable=no',
			title: 'better',
			meta: [
				{
					name: 'description',
					content: 'better',
				},
				{
					name: 'theme-color',
					content: '#050505',
				},
			],
			link: [
				{
					rel: 'icon',
					type: 'image/svg+xml',
					href: './favicon.svg',
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
	imports: {
		dirs: [
			'icons',
		],
	},
	runtimeConfig: {
		public: {
			supabase: {
				url: '',
				key: '',
			},
		},
	},

	// actual config
	vite: {
		vue: {
			script: {
				defineModel: true,
				propsDestructure: true,
			},
		},
	},
	devtools: {
		enabled: false,
	},
	modules: [
		'@pinia/nuxt',
		'@vueuse/nuxt',
		'nuxt-fable',
	],
	postcss: {
		plugins: {
			tailwindcss: {},
		},
	},
	ssr: false,
	typescript: {
		strict: true,
	},
})
