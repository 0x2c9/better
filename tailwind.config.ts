import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

export default {
	content: [
		'./components/**/*.vue',
		'./layouts/**/*.vue',
		'./pages/**/*.vue',
		'./composables/**/*.ts',
		'./app.vue',
	],
	theme: {
		colors: {
			blue: '#509BF5',
			green: '#4B917D',
			red: '#F93049',
			orange: '#dd8b1d',
			white: '#FFFFFF',
			black: '#000000',
			neutral: colors.neutral,
		},
		extend: {
			boxShadow: {
				better: '0 0 0 1px rgba(0,0,0,.08),0 4px 6px rgba(0,0,0,.04)',
			},
		},

		fontFamily: {
			inter: ['Geist', 'monospace'],
		},
	},
	corePlugins: {
		textOpacity: false,
		backgroundOpacity: false,
		borderOpacity: false,
	},
} satisfies Partial<Config>
