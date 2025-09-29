'use client'

import { useTheme } from 'next-themes'

export default function useThemeWithTransition() {
	const { theme, setTheme, ...rest } = useTheme()

	return {
		theme,
		setTheme,
		...rest
	}
}
