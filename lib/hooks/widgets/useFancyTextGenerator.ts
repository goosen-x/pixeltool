import { useState, useEffect, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import {
	fontStyles,
	generateZalgoText,
	exampleTexts,
	type FontStyles
} from '@/lib/data/fancy-text-data'

interface UseFancyTextGeneratorOptions {
	translations?: {
		copied: string
		copyError: string
	}
}

export interface GeneratedText {
	styleKey: string
	styleName: string
	text: string
	description: string
}

export function useFancyTextGenerator(
	options: UseFancyTextGeneratorOptions = {}
) {
	const { translations } = options

	const [inputText, setInputText] = useState('Lorem ipsum')
	const [copiedStyle, setCopiedStyle] = useState<string | null>(null)
	const [mounted, setMounted] = useState(false)
	const [zalgoIntensity, setZalgoIntensity] = useState(50)
	const [zalgoText, setZalgoText] = useState('')

	// Initialize component
	useEffect(() => {
		setMounted(true)
	}, [])

	// Generate Zalgo text when input or intensity changes
	useEffect(() => {
		if (mounted) {
			setZalgoText(generateZalgoText(inputText, zalgoIntensity))
		}
	}, [inputText, zalgoIntensity, mounted])

	// Generate all font styles
	const generatedTexts = useMemo((): GeneratedText[] => {
		if (!inputText.trim()) return []

		return Object.entries(fontStyles).map(([key, style]) => ({
			styleKey: key,
			styleName: style.name,
			text: style.convert(inputText),
			description: style.description
		}))
	}, [inputText])

	// Copy text to clipboard
	const copyToClipboard = useCallback(
		async (text: string, styleKey: string) => {
			try {
				await navigator.clipboard.writeText(text)
				setCopiedStyle(styleKey)

				// Clear copied state after 2 seconds
				setTimeout(() => setCopiedStyle(null), 2000)

				toast.success(
					translations?.copied ||
						`${fontStyles[styleKey]?.name || 'Text'} copied to clipboard!`
				)
			} catch (err) {
				toast.error(translations?.copyError || 'Failed to copy text')
			}
		},
		[translations]
	)

	// Copy Zalgo text
	const copyZalgoText = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(zalgoText)
			setCopiedStyle('zalgo')

			// Clear copied state after 2 seconds
			setTimeout(() => setCopiedStyle(null), 2000)

			toast.success(translations?.copied || 'Zalgo text copied to clipboard!')
		} catch (err) {
			toast.error(translations?.copyError || 'Failed to copy Zalgo text')
		}
	}, [zalgoText, translations])

	// Load example text
	const loadExampleText = useCallback(() => {
		const randomExample =
			exampleTexts[Math.floor(Math.random() * exampleTexts.length)]
		setInputText(randomExample)
		toast.success('Example text loaded')
	}, [])

	// Clear all text
	const clearText = useCallback(() => {
		setInputText('')
		setCopiedStyle(null)
	}, [])

	// Reset Zalgo intensity
	const resetZalgoIntensity = useCallback(() => {
		setZalgoIntensity(50)
	}, [])

	// Get style by key
	const getStyleByKey = useCallback((key: string) => {
		return fontStyles[key] || null
	}, [])

	return {
		// State
		inputText,
		copiedStyle,
		mounted,
		zalgoIntensity,
		zalgoText,
		generatedTexts,
		fontStyles,
		exampleTexts,

		// Actions
		setInputText,
		setZalgoIntensity,
		copyToClipboard,
		copyZalgoText,
		loadExampleText,
		clearText,
		resetZalgoIntensity,
		getStyleByKey
	}
}
