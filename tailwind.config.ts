import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

export default {
	content: [
		'./components/**/*.vue',
		'./layouts/**/*.vue',
		'./pages/**/*.vue',
		'./composables/**/*.ts',
		'./app.vue',
		'./error.vue',
	],
	theme: {
		colors: {
			'white': '#FFFFFF',
			'dirty-white': '#FAFAFA',
			'gray-light': '#F2F2F2',
			'gray-medium': '#666666',
			'gray-dark': '#3E3E3E',
			'black': '#000000',
			'blue': '#0070f3',
			'green': '#20cda6',
			'red': '#e00',
			'transparent': 'transparent',
		},
		extend: {
			boxShadow: {
				better: '0 0 0 1px rgba(0,0,0,.08), 0px 2px 2px rgba(0,0,0,.04)',
			},
		},
		fontFamily: {
			geist: ['Geist', 'monospace'],
		},
	},
	corePlugins: {
		textOpacity: false,
		backgroundOpacity: false,
		borderOpacity: false,
	},
} satisfies Partial<Config>
