import { useState, useCallback, useRef } from 'react'
import { toast } from 'sonner'
import {
	textToAscii,
	imageToAscii,
	createAsciiImage,
	downloadAsciiAsImage,
	downloadAsciiAsText
} from '@/lib/utils/ascii-converter'
import { asciiPatterns, type AsciiCharset } from '@/lib/data/ascii-art-data'

export type AsciiTab = 'text' | 'image' | 'patterns'
export type FontStyle = 'standard' | 'small' | 'big'

export interface TextToAsciiOptions {
	text: string
	font: FontStyle
}

export interface ImageToAsciiOptions {
	width: number
	charset: AsciiCharset
	invert: boolean
}

export interface AsciiPattern {
	id: string
	name: string
	category: string
	pattern: string
}

export function useAsciiArtGenerator() {
	const [activeTab, setActiveTab] = useState<AsciiTab>('text')
	const [asciiOutput, setAsciiOutput] = useState('')
	const [selectedPattern, setSelectedPattern] = useState('')
	const [imagePreview, setImagePreview] = useState<string | null>(null)
	const [isProcessing, setIsProcessing] = useState(false)

	const fileInputRef = useRef<HTMLInputElement>(null)
	const imageDataRef = useRef<ImageData | null>(null)

	// Convert text to ASCII
	const generateTextAscii = useCallback((options: TextToAsciiOptions) => {
		try {
			const { text, font } = options

			if (!text.trim()) {
				toast.error('Please enter some text')
				return
			}

			setIsProcessing(true)
			const ascii = textToAscii(text, font)
			setAsciiOutput(ascii)
			toast.success('Text converted to ASCII art!')
		} catch (error) {
			toast.error('Failed to convert text')
			console.error('Text to ASCII error:', error)
		} finally {
			setIsProcessing(false)
		}
	}, [])

	// Handle image upload
	const handleImageUpload = useCallback((file: File) => {
		if (!file) return

		const reader = new FileReader()
		reader.onload = event => {
			const img = new Image()
			img.onload = () => {
				const canvas = document.createElement('canvas')
				const ctx = canvas.getContext('2d')!

				// Resize image if too large
				const maxWidth = 800
				const scale = img.width > maxWidth ? maxWidth / img.width : 1
				canvas.width = img.width * scale
				canvas.height = img.height * scale

				ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

				const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
				imageDataRef.current = imageData
				setImagePreview(event.target?.result as string)

				// Auto convert with default settings
				generateImageAscii({
					width: 80,
					charset: 'basic',
					invert: false
				})
			}
			img.src = event.target?.result as string
		}
		reader.readAsDataURL(file)
	}, [])

	// Convert image to ASCII
	const generateImageAscii = useCallback((options: ImageToAsciiOptions) => {
		if (!imageDataRef.current) {
			toast.error('Please upload an image first')
			return
		}

		try {
			setIsProcessing(true)
			const ascii = imageToAscii(imageDataRef.current, options)
			setAsciiOutput(ascii)
			toast.success('Image converted to ASCII art!')
		} catch (error) {
			toast.error('Failed to convert image')
			console.error('Image to ASCII error:', error)
		} finally {
			setIsProcessing(false)
		}
	}, [])

	// Select ASCII pattern
	const selectPattern = useCallback((patternId: string) => {
		const pattern = asciiPatterns.find(p => p.id === patternId)
		if (pattern) {
			setAsciiOutput(pattern.pattern.trim())
			setSelectedPattern(patternId)
			toast.success(`Selected ${pattern.name} pattern`)
		}
	}, [])

	// Copy ASCII to clipboard
	const copyAscii = useCallback(async () => {
		if (!asciiOutput) {
			toast.error('No ASCII art to copy')
			return
		}

		try {
			await navigator.clipboard.writeText(asciiOutput)
			toast.success('ASCII art copied to clipboard!')
		} catch (error) {
			toast.error('Failed to copy')
		}
	}, [asciiOutput])

	// Download as text file
	const downloadText = useCallback(() => {
		if (!asciiOutput) {
			toast.error('No ASCII art to download')
			return
		}

		downloadAsciiAsText(asciiOutput, 'ascii-art.txt')
		toast.success('Downloaded as text file!')
	}, [asciiOutput])

	// Download as image
	const downloadImage = useCallback(
		(options?: { fontSize?: number; color?: string; background?: string }) => {
			if (!asciiOutput) {
				toast.error('No ASCII art to download')
				return
			}

			downloadAsciiAsImage(asciiOutput, 'ascii-art.png', {
				fontSize: options?.fontSize || 12,
				color: options?.color || '#000000',
				background: options?.background || '#FFFFFF'
			})
			toast.success('Downloaded as image!')
		},
		[asciiOutput]
	)

	// Reset everything
	const reset = useCallback(() => {
		setAsciiOutput('')
		setImagePreview(null)
		setSelectedPattern('')
		imageDataRef.current = null
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
		toast.success('Reset complete')
	}, [])

	// Get ASCII stats
	const getAsciiStats = useCallback(() => {
		if (!asciiOutput) return null

		const lines = asciiOutput.split('\n')
		const characters = asciiOutput.length
		const maxLineLength = Math.max(...lines.map(line => line.length))

		return {
			lines: lines.length,
			characters,
			maxLineLength,
			aspectRatio: (maxLineLength / lines.length).toFixed(2)
		}
	}, [asciiOutput])

	// Validate text input
	const validateTextInput = useCallback((text: string): boolean => {
		if (!text.trim()) {
			toast.error('Please enter some text')
			return false
		}
		if (text.length > 100) {
			toast.error('Text is too long (max 100 characters)')
			return false
		}
		return true
	}, [])

	// Get filtered patterns by category
	const getPatternsByCategory = useCallback((category?: string) => {
		if (!category) return asciiPatterns
		return asciiPatterns.filter(p => p.category === category)
	}, [])

	return {
		// State
		activeTab,
		asciiOutput,
		selectedPattern,
		imagePreview,
		isProcessing,

		// Refs
		fileInputRef,

		// Actions
		setActiveTab,
		generateTextAscii,
		handleImageUpload,
		generateImageAscii,
		selectPattern,
		copyAscii,
		downloadText,
		downloadImage,
		reset,

		// Utilities
		getAsciiStats,
		validateTextInput,
		getPatternsByCategory,

		// Data
		patterns: asciiPatterns
	}
}
