import { useState, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import { useCopyToClipboard, useReset } from '@/lib/hooks'
import {
	GradientSettings,
	ColorStop,
	PresetGradient,
	DEFAULT_GRADIENT_SETTINGS,
	generateGradientCSS,
	generateRandomGradient,
	generateId,
	PRESET_GRADIENTS,
	getGradientCategories,
	getGradientsByCategory,
	searchGradients,
	type GradientType,
	type LinearDirection,
	type RadialShape,
	type RadialSize
} from '@/lib/data/css-gradient-data'

interface UseCSSGradientGeneratorOptions {
	translations?: {
		copied: string
		copyError: string
		gradientApplied: string
		colorStopAdded: string
		colorStopRemoved: string
		gradientRandomized: string
	}
}

export function useCSSGradientGenerator(
	options: UseCSSGradientGeneratorOptions = {}
) {
	const { translations } = options

	const [settings, setSettings] = useState<GradientSettings>(
		DEFAULT_GRADIENT_SETTINGS
	)
	const [selectedStopId, setSelectedStopId] = useState<string>('1')
	const [activeCategory, setActiveCategory] = useState<string>('all')
	const [searchQuery, setSearchQuery] = useState('')
	const [exportFormat, setExportFormat] = useState<'css' | 'scss' | 'tailwind'>(
		'css'
	)

	// Use shared utility hooks
	const { copyToClipboard } = useCopyToClipboard({ translations })
	const resetGradient = () => {
		setSettings(DEFAULT_GRADIENT_SETTINGS)
		setSelectedStopId('1')
		setSearchQuery('')
		setActiveCategory('all')
	}
	const { reset } = useReset(resetGradient, {
		successMessage: 'Gradient reset to default'
	})

	// Get the currently selected color stop
	const selectedStop = useMemo(() => {
		return settings.colorStops.find(s => s.id === selectedStopId)
	}, [settings.colorStops, selectedStopId])

	// Generate CSS string for the current gradient
	const gradientCSS = useMemo(() => {
		return generateGradientCSS(settings)
	}, [settings])

	// Get gradient categories
	const categories = useMemo(() => {
		return getGradientCategories()
	}, [])

	// Get filtered gradients based on search and category
	const filteredGradients = useMemo(() => {
		let gradients = PRESET_GRADIENTS

		if (searchQuery) {
			gradients = searchGradients(searchQuery)
		} else if (activeCategory !== 'all') {
			gradients = getGradientsByCategory(activeCategory)
		}

		return gradients
	}, [searchQuery, activeCategory])

	// Update gradient settings
	const updateSettings = useCallback((updates: Partial<GradientSettings>) => {
		setSettings(prev => ({ ...prev, ...updates }))
	}, [])

	// Update gradient type
	const updateGradientType = useCallback(
		(type: GradientType) => {
			updateSettings({ type })
		},
		[updateSettings]
	)

	// Update linear gradient settings
	const updateLinearDirection = useCallback(
		(linearDirection: LinearDirection) => {
			updateSettings({ linearDirection })
		},
		[updateSettings]
	)

	const updateLinearAngle = useCallback(
		(linearAngle: number) => {
			updateSettings({ linearAngle, linearDirection: 'custom' })
		},
		[updateSettings]
	)

	// Update radial gradient settings
	const updateRadialShape = useCallback(
		(radialShape: RadialShape) => {
			updateSettings({ radialShape })
		},
		[updateSettings]
	)

	const updateRadialSize = useCallback(
		(radialSize: RadialSize) => {
			updateSettings({ radialSize })
		},
		[updateSettings]
	)

	const updateRadialPosition = useCallback(
		(radialPositionX: number, radialPositionY: number) => {
			updateSettings({ radialPositionX, radialPositionY })
		},
		[updateSettings]
	)

	// Update conic gradient settings
	const updateConicAngle = useCallback(
		(conicAngle: number) => {
			updateSettings({ conicAngle })
		},
		[updateSettings]
	)

	const updateConicPosition = useCallback(
		(conicPositionX: number, conicPositionY: number) => {
			updateSettings({ conicPositionX, conicPositionY })
		},
		[updateSettings]
	)

	// Toggle repeating gradient
	const toggleRepeating = useCallback(() => {
		updateSettings({ repeating: !settings.repeating })
	}, [settings.repeating, updateSettings])

	// Color stop management
	const addColorStop = useCallback(() => {
		const newStop: ColorStop = {
			id: generateId(),
			color: '#ff0000',
			position: 50,
			opacity: 100
		}

		const newStops = [...settings.colorStops, newStop].sort(
			(a, b) => a.position - b.position
		)
		updateSettings({ colorStops: newStops })
		setSelectedStopId(newStop.id)

		toast.success(translations?.colorStopAdded || 'Color stop added')
	}, [settings.colorStops, updateSettings, translations])

	const removeColorStop = useCallback(
		(stopId: string) => {
			if (settings.colorStops.length <= 2) return // Don't allow removing if only 2 stops remain

			const newStops = settings.colorStops.filter(stop => stop.id !== stopId)
			updateSettings({ colorStops: newStops })

			// If we removed the selected stop, select the first one
			if (selectedStopId === stopId) {
				setSelectedStopId(newStops[0]?.id || '')
			}

			toast.success(translations?.colorStopRemoved || 'Color stop removed')
		},
		[settings.colorStops, selectedStopId, updateSettings, translations]
	)

	const updateColorStop = useCallback(
		(stopId: string, updates: Partial<ColorStop>) => {
			const newStops = settings.colorStops.map(stop =>
				stop.id === stopId ? { ...stop, ...updates } : stop
			)
			updateSettings({ colorStops: newStops })
		},
		[settings.colorStops, updateSettings]
	)

	// Update selected color stop
	const updateSelectedStop = useCallback(
		(updates: Partial<ColorStop>) => {
			if (selectedStopId) {
				updateColorStop(selectedStopId, updates)
			}
		},
		[selectedStopId, updateColorStop]
	)

	// Apply preset gradient
	const applyPresetGradient = useCallback(
		(preset: PresetGradient) => {
			const newSettings = { ...DEFAULT_GRADIENT_SETTINGS, ...preset.settings }
			setSettings(newSettings as GradientSettings)

			// Select the first color stop
			if (newSettings.colorStops && newSettings.colorStops.length > 0) {
				setSelectedStopId(newSettings.colorStops[0].id)
			}

			toast.success(
				translations?.gradientApplied || `Applied "${preset.name}" gradient`
			)
		},
		[translations]
	)

	// Generate random gradient
	const generateRandom = useCallback(() => {
		const randomGradient = generateRandomGradient()
		setSettings(randomGradient)
		setSelectedStopId(randomGradient.colorStops[0]?.id || '')

		toast.success(
			translations?.gradientRandomized || 'Random gradient generated'
		)
	}, [translations])

	// Copy CSS to clipboard
	const copyCSS = useCallback(async () => {
		let cssText = ''

		switch (exportFormat) {
			case 'css':
				cssText = `background: ${gradientCSS};`
				break
			case 'scss':
				cssText = `$gradient: ${gradientCSS};\nbackground: $gradient;`
				break
			case 'tailwind':
				// This is a simplified version - real Tailwind would need custom classes
				cssText = `/* Add to tailwind.config.js */\n.gradient-custom {\n  background: ${gradientCSS};\n}`
				break
		}

		await copyToClipboard(cssText, `${exportFormat.toUpperCase()} code`)
	}, [gradientCSS, exportFormat, copyToClipboard])

	// Export as various formats
	const exportGradient = useCallback(
		(format: 'css' | 'scss' | 'tailwind' | 'json') => {
			let content = ''
			let filename = ''

			switch (format) {
				case 'css':
					content = `.gradient {\n  background: ${gradientCSS};\n}`
					filename = 'gradient.css'
					break
				case 'scss':
					content = `$gradient: ${gradientCSS};\n\n.gradient {\n  background: $gradient;\n}`
					filename = 'gradient.scss'
					break
				case 'tailwind':
					content = `/* Add to tailwind.config.js */\nmodule.exports = {\n  theme: {\n    extend: {\n      backgroundImage: {\n        'custom-gradient': '${gradientCSS}'\n      }\n    }\n  }\n}`
					filename = 'tailwind-gradient.js'
					break
				case 'json':
					content = JSON.stringify(settings, null, 2)
					filename = 'gradient-settings.json'
					break
			}

			// Create and download file
			const blob = new Blob([content], { type: 'text/plain' })
			const url = URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = filename
			a.click()
			URL.revokeObjectURL(url)

			toast.success(`Exported as ${format.toUpperCase()}`)
		},
		[gradientCSS, settings]
	)

	return {
		// State
		settings,
		selectedStopId,
		selectedStop,
		activeCategory,
		searchQuery,
		exportFormat,
		gradientCSS,
		categories,
		filteredGradients,

		// Actions
		setSelectedStopId,
		setActiveCategory,
		setSearchQuery,
		setExportFormat,
		updateSettings,
		updateGradientType,
		updateLinearDirection,
		updateLinearAngle,
		updateRadialShape,
		updateRadialSize,
		updateRadialPosition,
		updateConicAngle,
		updateConicPosition,
		toggleRepeating,
		addColorStop,
		removeColorStop,
		updateColorStop,
		updateSelectedStop,
		applyPresetGradient,
		generateRandom,
		copyCSS,
		exportGradient,
		resetGradient: reset
	}
}
