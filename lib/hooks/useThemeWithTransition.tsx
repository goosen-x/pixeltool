'use client'

import { useTheme } from 'next-themes'
import { useCallback, useEffect, useState, useRef } from 'react'

export type TransitionType = 'fade' | 'scale' | 'slide' | 'circle' | 'none'

export default function useThemeWithTransition() {
	const { theme, setTheme: originalSetTheme, ...rest } = useTheme()
	const [transitionType, setTransitionType] = useState<TransitionType>(() => {
		// Always use fade transition
		return 'fade'
	})
	const transitionTypeRef = useRef<TransitionType>(transitionType)

	useEffect(() => {
		// Update ref when state changes
		transitionTypeRef.current = transitionType
	}, [transitionType])

	// Remove localStorage sync since we always use fade

	const updateTransitionType = useCallback((type: TransitionType) => {
		// Do nothing since we always use fade
	}, [])

	const setTheme = useCallback(
		(newTheme: string, clickEvent?: React.MouseEvent) => {
			// Use ref value for immediate access to current transition type
			const currentTransitionType = transitionTypeRef.current

			// Check if View Transitions API is supported
			if (!document.startViewTransition || currentTransitionType === 'none') {
				originalSetTheme(newTheme)
				return
			}

			// Remove any existing transition classes
			document.documentElement.classList.remove(
				'theme-transition-fade',
				'theme-transition-scale',
				'theme-transition-slide',
				'theme-transition-circle'
			)

			// Add the current transition class
			if (currentTransitionType === 'circle' && clickEvent) {
				const button = clickEvent.currentTarget as HTMLElement
				const rect = button.getBoundingClientRect()
				const x = rect.left + rect.width / 2
				const y = rect.top + rect.height / 2

				// Set CSS variables for circle animation
				document.documentElement.style.setProperty('--theme-x', `${x}px`)
				document.documentElement.style.setProperty('--theme-y', `${y}px`)
			}

			document.documentElement.classList.add(
				`theme-transition-${currentTransitionType}`
			)

			// Use View Transitions API for smooth theme change
			const transition = document.startViewTransition(() => {
				originalSetTheme(newTheme)
			})

			// Clean up after transition
			transition.finished.then(() => {
				document.documentElement.classList.remove(
					'theme-transition-fade',
					'theme-transition-scale',
					'theme-transition-slide',
					'theme-transition-circle'
				)
				document.documentElement.style.removeProperty('--theme-x')
				document.documentElement.style.removeProperty('--theme-y')
			})
		},
		[originalSetTheme]
	)

	return {
		theme,
		setTheme,
		transitionType,
		setTransitionType: updateTransitionType,
		...rest
	}
}
