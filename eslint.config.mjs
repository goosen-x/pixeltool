import pluginNext from '@next/eslint-plugin-next'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginJsxA11y from 'eslint-plugin-jsx-a11y'
import tseslint from 'typescript-eslint'

export default tseslint.config(
	{
		ignores: [
			'.next/**',
			'node_modules/**',
			'out/**',
			'coverage/**',
			'scripts/**/*.js',
			'test/**/*.js',
		],
	},
	...tseslint.configs.recommended,
	{
		files: ['**/*.{ts,tsx,js,jsx}'],
		plugins: {
			'@next/next': pluginNext,
			react: pluginReact,
			'react-hooks': pluginReactHooks,
			'jsx-a11y': pluginJsxA11y,
		},
		rules: {
			// Next.js rules
			...pluginNext.configs.recommended.rules,
			...pluginNext.configs['core-web-vitals'].rules,

			// React rules
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',

			// Accessibility
			'jsx-a11y/alt-text': 'warn',
			'jsx-a11y/anchor-is-valid': 'warn',

			// Code quality
			'no-console': ['warn', { allow: ['warn', 'error'] }],
			'no-debugger': 'error',
			'prefer-const': 'error',
			'no-var': 'error',

			// TypeScript - relax some rules
			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-empty-object-type': 'off',
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
	},
	{
		files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
		rules: {
			'no-console': 'off',
			'@next/next/no-html-link-for-pages': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
		},
	},
	{
		files: ['scripts/**/*.ts'],
		rules: {
			'no-console': 'off',
			'@typescript-eslint/no-require-imports': 'off',
		},
	}
)
