'use client'

import { useState, useCallback, useEffect } from 'react'

import { toast } from 'sonner'
import { useAnalytics } from '@/lib/hooks/useAnalytics'
import { useWidgetKeyboard } from '@/lib/hooks/useWidgetKeyboard'
import { useFavorites } from '@/lib/hooks/useFavorites'
import { useSearchHistory } from '@/lib/hooks/useSearchHistory'

interface WidgetCreationConfig {
	widgetId: string
	enableKeyboard?: boolean
	enableAnalytics?: boolean
	enableFavorites?: boolean
	enableHistory?: boolean
	defaultState?: Record<string, any>
	validationRules?: Record<string, (value: any) => boolean | string>
}

interface WidgetState {
	// Common widget states
	isLoading: boolean
	error: string | null
	result: any
	inputs: Record<string, any>
	// Widget-specific state
	customState: Record<string, any>
}

interface WidgetActions {
	// State management
	updateInput: (key: string, value: any) => void
	updateCustomState: (key: string, value: any) => void
	setResult: (result: any) => void
	setError: (error: string | null) => void
	setLoading: (loading: boolean) => void
	reset: () => void

	// Common actions
	copyToClipboard: (text: string, message?: string) => Promise<void>
	downloadAsFile: (content: string, filename: string, type?: string) => void
	shareResult: (data: {
		title: string
		text: string
		url?: string
	}) => Promise<void>

	// Validation
	validateInput: (key: string, value: any) => boolean | string
	validateAllInputs: () => boolean
}

interface WidgetUtilities {
	// Formatting utilities
	formatNumber: (num: number, decimals?: number) => string
	formatDate: (date: Date, format?: string) => string
	formatFileSize: (bytes: number) => string

	// Common calculations
	calculatePercentage: (value: number, total: number) => number
	roundToDecimals: (num: number, decimals: number) => number

	// UI helpers
	getGradientByCategory: (category: string) => string
	getIconByCategory: (category: string) => any
}

export function useWidgetCreation(config: WidgetCreationConfig) {
	const { trackEvent } = useAnalytics(config.widgetId)
	const { isFavorite, toggleFavorite } = useFavorites()
	const { addToHistory } = useSearchHistory()

	// Initialize state
	const [state, setState] = useState<WidgetState>({
		isLoading: false,
		error: null,
		result: null,
		inputs: config.defaultState?.inputs || {},
		customState: config.defaultState?.custom || {}
	})

	// Enable keyboard shortcuts if configured
	useWidgetKeyboard({
		shortcuts: [],
		widgetId: config.widgetId,
		enabled: config.enableKeyboard || false
	})

	// Track widget usage
	useEffect(() => {
		if (config.enableAnalytics) {
			trackEvent('view', {
				timestamp: new Date().toISOString()
			})
		}

		if (config.enableHistory) {
			addToHistory(config.widgetId)
		}
	}, [
		config.widgetId,
		config.enableAnalytics,
		config.enableHistory,
		trackEvent,
		addToHistory
	])

	// State management actions
	const updateInput = useCallback((key: string, value: any) => {
		setState(prev => ({
			...prev,
			inputs: { ...prev.inputs, [key]: value }
		}))
	}, [])

	const updateCustomState = useCallback((key: string, value: any) => {
		setState(prev => ({
			...prev,
			customState: { ...prev.customState, [key]: value }
		}))
	}, [])

	const setResult = useCallback(
		(result: any) => {
			setState(prev => ({ ...prev, result, error: null }))

			if (config.enableAnalytics) {
				trackEvent('use', {
					has_result: !!result
				})
			}
		},
		[config.widgetId, config.enableAnalytics, trackEvent]
	)

	const setError = useCallback(
		(error: string | null) => {
			setState(prev => ({ ...prev, error, result: null }))

			if (error && config.enableAnalytics) {
				trackEvent('action', {
					action_type: 'error',
					error_message: error
				})
			}
		},
		[config.widgetId, config.enableAnalytics, trackEvent]
	)

	const setLoading = useCallback((loading: boolean) => {
		setState(prev => ({ ...prev, isLoading: loading }))
	}, [])

	const reset = useCallback(() => {
		setState({
			isLoading: false,
			error: null,
			result: null,
			inputs: config.defaultState?.inputs || {},
			customState: config.defaultState?.custom || {}
		})

		toast.success('Сброшено')
	}, [config.defaultState])

	// Common utility actions
	const copyToClipboard = useCallback(
		async (text: string, message?: string) => {
			try {
				await navigator.clipboard.writeText(text)
				toast.success(message || 'Скопировано в буфер обмена')

				if (config.enableAnalytics) {
					trackEvent('action', {
						action_type: 'copy',
						content_length: text.length
					})
				}
			} catch (error) {
				toast.error('Ошибка копирования')
			}
		},
		[config.widgetId, config.enableAnalytics, trackEvent]
	)

	const downloadAsFile = useCallback(
		(content: string, filename: string, type: string = 'text/plain') => {
			try {
				const blob = new Blob([content], { type })
				const url = URL.createObjectURL(blob)
				const link = document.createElement('a')
				link.href = url
				link.download = filename
				document.body.appendChild(link)
				link.click()
				document.body.removeChild(link)
				URL.revokeObjectURL(url)

				toast.success('Загрузка завершена')

				if (config.enableAnalytics) {
					trackEvent('export', {
						file_type: type,
						file_size: content.length
					})
				}
			} catch (error) {
				toast.error('Ошибка загрузки')
			}
		},
		[config.widgetId, config.enableAnalytics, trackEvent]
	)

	const shareResult = useCallback(
		async (data: { title: string; text: string; url?: string }) => {
			try {
				if (navigator.share) {
					await navigator.share(data)

					if (config.enableAnalytics) {
						trackEvent('share', {
							share_method: 'native'
						})
					}
				} else {
					// Fallback to copying URL
					const shareUrl = data.url || window.location.href
					await copyToClipboard(shareUrl, 'Ссылка скопирована')
				}
			} catch (error) {
				if ((error as Error).name !== 'AbortError') {
					toast.error('Ошибка при попытке поделиться')
				}
			}
		},
		[config.widgetId, config.enableAnalytics, trackEvent, copyToClipboard]
	)

	// Validation
	const validateInput = useCallback(
		(key: string, value: any): boolean | string => {
			if (!config.validationRules || !config.validationRules[key]) {
				return true
			}

			return config.validationRules[key](value)
		},
		[config.validationRules]
	)

	const validateAllInputs = useCallback((): boolean => {
		if (!config.validationRules) return true

		for (const [key, validator] of Object.entries(config.validationRules)) {
			const result = validator(state.inputs[key])
			if (result !== true) {
				setError(typeof result === 'string' ? result : 'Ошибка валидации')
				return false
			}
		}

		return true
	}, [config.validationRules, state.inputs, setError])

	// Utility functions
	const utilities: WidgetUtilities = {
		formatNumber: (num: number, decimals: number = 2) => {
			return new Intl.NumberFormat(undefined, {
				minimumFractionDigits: decimals,
				maximumFractionDigits: decimals
			}).format(num)
		},

		formatDate: (date: Date, format?: string) => {
			// Simple date formatting - can be enhanced with date-fns if needed
			return date.toLocaleDateString()
		},

		formatFileSize: (bytes: number) => {
			const units = ['B', 'KB', 'MB', 'GB', 'TB']
			let size = bytes
			let unitIndex = 0

			while (size >= 1024 && unitIndex < units.length - 1) {
				size /= 1024
				unitIndex++
			}

			return `${size.toFixed(2)} ${units[unitIndex]}`
		},

		calculatePercentage: (value: number, total: number) => {
			if (total === 0) return 0
			return (value / total) * 100
		},

		roundToDecimals: (num: number, decimals: number) => {
			return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
		},

		getGradientByCategory: (category: string) => {
			const gradients: Record<string, string> = {
				css: 'from-blue-500 to-purple-600',
				converter: 'from-green-500 to-teal-600',
				generator: 'from-orange-500 to-red-600',
				calculator: 'from-indigo-500 to-blue-600',
				formatter: 'from-pink-500 to-rose-600',
				validator: 'from-purple-500 to-indigo-600',
				tool: 'from-gray-500 to-gray-700'
			}
			return gradients[category] || gradients.tool
		},

		getIconByCategory: (category: string) => {
			// This would return the appropriate icon component
			// Implementation depends on your icon library
			return null
		}
	}

	const actions: WidgetActions = {
		updateInput,
		updateCustomState,
		setResult,
		setError,
		setLoading,
		reset,
		copyToClipboard,
		downloadAsFile,
		shareResult,
		validateInput,
		validateAllInputs
	}

	return {
		// State
		...state,

		// Actions
		...actions,

		// Utilities
		...utilities,

		// Widget config
		widgetId: config.widgetId,
		isFavorite: config.enableFavorites ? isFavorite(config.widgetId) : false,
		toggleFavorite: config.enableFavorites
			? () => toggleFavorite(config.widgetId)
			: undefined
	}
}
