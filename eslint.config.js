import antfu from '@antfu/eslint-config'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat()

export default antfu(
	{
		stylistic: {
			tab: 2,
			quotes: 'single',
			indent: 'tab',
		},
		typescript: {
			tsconfigPath: 'tsconfig.json',
			parserOptions: {
				extraFileExtensions: ['.vue'],
			},
		},
		typescript: true,
		vue: true,
	},
	{
		rules: {
			'curly': 'off',
			'no-console': 'off',
			'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
			'style/arrow-parens': ['error', 'always'],
			'vue/max-attributes-per-line': [
				'error',
				{
					singleline: {
						max: 1,
					},
					multiline: {
						max: 1,
					},
				},
			],
			'node/prefer-global/process': 'off',
			'ts/consistent-type-definitions': 'off',
		},
	},
	...compat.config({
		extends: ['plugin:tailwindcss/recommended'],
		rules: {
			'tailwindcss/no-custom-classname': 'off',
			'tailwindcss/migration-from-tailwind-2': 'off',
		},
	}),
)
