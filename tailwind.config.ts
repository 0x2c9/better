import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

export default {
	content: [
		'./components/**/*.vue',
		'./layouts/**/*.vue',
		'./pages/**/*.vue',
		'./composables/**/*.ts',
		'./app.vue',
		'./stories/**/*.story.vue',
	],
	theme: {
		colors: {
			blue: '#0EA5E9',
			green: '#059669',
			red: '#DC2626',
			orange: '#dd8b1d',
			white: '#FFFFFF',
			black: '#000000',
			transparent: 'transparent',
			neutral: {
				50: colors.neutral['50'],
				100: colors.neutral['100'],
				200: colors.neutral['200'],
				300: colors.neutral['300'],
				400: '#a3a3a3',
				500: '#737373',
				600: '#404040',
				700: '#323232',
				800: '#222222',
				900: '#1A1A19',
				950: '#0B0B0A',
			},
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
