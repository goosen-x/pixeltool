import { useState, useCallback, useRef } from 'react'
import { toast } from 'sonner'

export interface GeneratorOptions {
	[key: string]: any
}

export interface GeneratorResult<T> {
	value: T
	timestamp: Date
	options: GeneratorOptions
}

export interface GeneratorConfig<
	T,
	TOptions extends GeneratorOptions = GeneratorOptions
> {
	generate: (options: TOptions) => T | Promise<T>
	validate?: (options: TOptions) => string | null
	format?: (value: T) => string
	defaultOptions?: TOptions
	maxHistory?: number
	allowDuplicates?: boolean
}

export function useGenerator<
	T,
	TOptions extends GeneratorOptions = GeneratorOptions
>(config: GeneratorConfig<T, TOptions>) {
	const [options, setOptions] = useState<TOptions>(
		config.defaultOptions || ({} as TOptions)
	)
	const [currentValue, setCurrentValue] = useState<T | null>(null)
	const [history, setHistory] = useState<GeneratorResult<T>[]>([])
	const [isGenerating, setIsGenerating] = useState(false)
	const [favorites, setFavorites] = useState<T[]>([])

	const abortControllerRef = useRef<AbortController | null>(null)

	// Generate new value
	const generate = useCallback(async () => {
		// Validate options
		if (config.validate) {
			const error = config.validate(options)
			if (error) {
				toast.error(error)
				return
			}
		}

		// Cancel any ongoing generation
		if (abortControllerRef.current) {
			abortControllerRef.current.abort()
		}
		abortControllerRef.current = new AbortController()

		setIsGenerating(true)

		try {
			const result = await config.generate(options)

			// Check if generation was aborted
			if (abortControllerRef.current?.signal.aborted) {
				return
			}

			setCurrentValue(result)

			// Add to history
			const generatorResult: GeneratorResult<T> = {
				value: result,
				timestamp: new Date(),
				options: { ...options }
			}

			setHistory(prev => {
				const newHistory = [generatorResult, ...prev]
				const maxHistory = config.maxHistory || 50
				return newHistory.slice(0, maxHistory)
			})

			toast.success('Generated successfully!')
		} catch (error) {
			if (error instanceof Error && error.name === 'AbortError') {
				return
			}
			toast.error('Generation failed')
			console.error('Generator error:', error)
		} finally {
			setIsGenerating(false)
			abortControllerRef.current = null
		}
	}, [options, config])

	// Generate multiple values
	const generateBatch = useCallback(
		async (count: number) => {
			const results: T[] = []

			for (let i = 0; i < count; i++) {
				try {
					const result = await config.generate(options)

					if (!config.allowDuplicates) {
						// Check for duplicates
						const isDuplicate = results.some(
							r => JSON.stringify(r) === JSON.stringify(result)
						)
						if (isDuplicate) {
							i-- // Retry this iteration
							continue
						}
					}

					results.push(result)
				} catch (error) {
					toast.error(`Failed to generate item ${i + 1}`)
					break
				}
			}

			if (results.length > 0) {
				setCurrentValue(results[results.length - 1])

				// Add all to history
				const timestamp = new Date()
				const historyItems = results.map(value => ({
					value,
					timestamp,
					options: { ...options }
				}))

				setHistory(prev =>
					[...historyItems, ...prev].slice(0, config.maxHistory || 50)
				)

				toast.success(`Generated ${results.length} items!`)
			}

			return results
		},
		[options, config]
	)

	// Update single option
	const updateOption = useCallback(
		<K extends keyof TOptions>(key: K, value: TOptions[K]) => {
			setOptions(prev => ({ ...prev, [key]: value }))
		},
		[]
	)

	// Update multiple options
	const updateOptions = useCallback((updates: Partial<TOptions>) => {
		setOptions(prev => ({ ...prev, ...updates }))
	}, [])

	// Reset options
	const resetOptions = useCallback(() => {
		setOptions(config.defaultOptions || ({} as TOptions))
		toast.success('Options reset')
	}, [config.defaultOptions])

	// Copy current value
	const copyCurrent = useCallback(() => {
		if (!currentValue) {
			toast.error('Nothing to copy')
			return
		}

		const text = config.format
			? config.format(currentValue)
			: String(currentValue)

		navigator.clipboard.writeText(text)
		toast.success('Copied to clipboard!')
	}, [currentValue, config])

	// Copy all history
	const copyHistory = useCallback(() => {
		if (history.length === 0) {
			toast.error('No history to copy')
			return
		}

		const text = history
			.map(item =>
				config.format ? config.format(item.value) : String(item.value)
			)
			.join('\n')

		navigator.clipboard.writeText(text)
		toast.success(`Copied ${history.length} items!`)
	}, [history, config])

	// Add to favorites
	const addToFavorites = useCallback(
		(value?: T) => {
			const valueToAdd = value || currentValue
			if (!valueToAdd) {
				toast.error('Nothing to add to favorites')
				return
			}

			const exists = favorites.some(
				f => JSON.stringify(f) === JSON.stringify(valueToAdd)
			)

			if (!exists) {
				setFavorites(prev => [...prev, valueToAdd])
				toast.success('Added to favorites')
			} else {
				toast.info('Already in favorites')
			}
		},
		[currentValue, favorites]
	)

	// Remove from favorites
	const removeFromFavorites = useCallback((index: number) => {
		setFavorites(prev => prev.filter((_, i) => i !== index))
		toast.success('Removed from favorites')
	}, [])

	// Clear history
	const clearHistory = useCallback(() => {
		setHistory([])
		toast.success('History cleared')
	}, [])

	// Load from history
	const loadFromHistory = useCallback(
		(index: number) => {
			const item = history[index]
			if (item) {
				setCurrentValue(item.value)
				setOptions(item.options as TOptions)
				toast.success('Loaded from history')
			}
		},
		[history]
	)

	return {
		// State
		options,
		currentValue,
		history,
		isGenerating,
		favorites,

		// Actions
		generate,
		generateBatch,
		updateOption,
		updateOptions,
		resetOptions,
		copyCurrent,
		copyHistory,
		addToFavorites,
		removeFromFavorites,
		clearHistory,
		loadFromHistory,

		// Utilities
		format: config.format || ((v: T) => String(v))
	}
}

// Example: Password generator
export function usePasswordGenerator() {
	interface PasswordOptions {
		length: number
		uppercase: boolean
		lowercase: boolean
		numbers: boolean
		symbols: boolean
		excludeSimilar: boolean
		excludeAmbiguous: boolean
	}

	return useGenerator<string, PasswordOptions>({
		defaultOptions: {
			length: 16,
			uppercase: true,
			lowercase: true,
			numbers: true,
			symbols: true,
			excludeSimilar: false,
			excludeAmbiguous: false
		},
		generate: options => {
			let charset = ''

			if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
			if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
			if (options.numbers) charset += '0123456789'
			if (options.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'

			if (options.excludeSimilar) {
				charset = charset.replace(/[ilLI|`1oO0]/g, '')
			}

			if (options.excludeAmbiguous) {
				charset = charset.replace(/[{}[\]()\/\\'"~,;.<>]/g, '')
			}

			let password = ''
			for (let i = 0; i < options.length; i++) {
				password += charset.charAt(Math.floor(Math.random() * charset.length))
			}

			return password
		},
		validate: options => {
			if (options.length < 4) return 'Password must be at least 4 characters'
			if (options.length > 128) return 'Password cannot exceed 128 characters'

			if (
				!options.uppercase &&
				!options.lowercase &&
				!options.numbers &&
				!options.symbols
			) {
				return 'At least one character type must be selected'
			}

			return null
		},
		maxHistory: 20,
		allowDuplicates: true
	})
}
