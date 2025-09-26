'use client'

import { useState, useRef } from 'react'
import {
	Type,
	Image as ImageIcon,
	Download,
	Copy,
	Palette,
	FileText
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import {
	WidgetLayout,
	WidgetSection,
	WidgetForm,
	WidgetInfo,
	WidgetShareSection,
	WidgetTips,
	WidgetTutorial,
	WidgetKeyboardShortcuts,
	type InputField
} from '@/components/widgets'
import {
	useWidgetKeyboard,
	commonWidgetShortcuts,
	type KeyboardShortcut
} from '@/lib/hooks/useWidgetKeyboard'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import type { BaseWidgetConfig } from '@/lib/types/widget-base'
import {
	asciiPatterns,
	asciiCategories,
	asciiCharsets,
	type AsciiCharset
} from '@/lib/data/ascii-art-data'
import {
	textToAscii,
	imageToAscii,
	createAsciiImage,
	downloadAsciiAsImage,
	downloadAsciiAsText
} from '@/lib/utils/ascii-converter'

export default function AsciiArtGeneratorPage() {
	const [activeTab, setActiveTab] = useState<'text' | 'image' | 'patterns'>(
		'text'
	)
	const [asciiOutput, setAsciiOutput] = useState('')
	const [selectedPattern, setSelectedPattern] = useState('')
	const [imagePreview, setImagePreview] = useState<string | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [showTutorial, setShowTutorial] = useState(false)

	const config: BaseWidgetConfig = {
		title: 'ASCII Art Generator',
		description:
			'Convert text and images to ASCII art, or use pre-made patterns',
		icon: <Type className='w-6 h-6' />,
		category: 'Creative Tools',
		keywords: ['ascii', 'art', 'text', 'image', 'converter', 'generator']
	}

	// Text to ASCII fields
	const textFields: InputField[] = [
		{
			name: 'text',
			label: 'Text to Convert',
			type: 'text',
			placeholder: 'Enter text to convert to ASCII art',
			required: true,
			icon: <Type className='w-4 h-4' />
		},
		{
			name: 'font',
			label: 'Font Style',
			type: 'select',
			value: 'standard',
			options: [
				{ label: 'Standard', value: 'standard' },
				{ label: 'Small', value: 'small' },
				{ label: 'Big', value: 'big' }
			]
		}
	]

	// Image to ASCII fields
	const imageFields: InputField[] = [
		{
			name: 'width',
			label: 'Width (characters)',
			type: 'slider',
			value: 80,
			min: 40,
			max: 200,
			step: 10
		},
		{
			name: 'charset',
			label: 'Character Set',
			type: 'select',
			value: 'basic',
			options: Object.entries(asciiCharsets).map(([key, value]) => ({
				label: `${key.charAt(0).toUpperCase() + key.slice(1)} (${value.slice(0, 10)}...)`,
				value: key
			}))
		},
		{
			name: 'invert',
			label: 'Invert brightness',
			type: 'switch',
			value: false
		}
	]

	const handleTextToAscii = (data: Record<string, any>) => {
		const { text, font } = data
		const ascii = textToAscii(text, font)
		setAsciiOutput(ascii)
		toast.success('Text converted to ASCII art!')
	}

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		const reader = new FileReader()
		reader.onload = event => {
			const img = new window.Image()
			img.onload = () => {
				const canvas = document.createElement('canvas')
				const ctx = canvas.getContext('2d')!

				canvas.width = img.width
				canvas.height = img.height
				ctx.drawImage(img, 0, 0)

				const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
				setImagePreview(event.target?.result as string)

				// Auto convert with default settings
				const ascii = imageToAscii(imageData, {
					width: 80,
					charset: 'basic',
					invert: false
				})
				setAsciiOutput(ascii)
				toast.success('Image converted to ASCII art!')
			}
			img.src = event.target?.result as string
		}
		reader.readAsDataURL(file)
	}

	const handleImageToAscii = (data: Record<string, any>) => {
		if (!imagePreview) {
			toast.error('Please upload an image first')
			return
		}

		const img = new window.Image()
		img.onload = () => {
			const canvas = document.createElement('canvas')
			const ctx = canvas.getContext('2d')!

			canvas.width = img.width
			canvas.height = img.height
			ctx.drawImage(img, 0, 0)

			const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
			const ascii = imageToAscii(imageData, {
				width: data.width,
				charset: data.charset as AsciiCharset,
				invert: data.invert
			})

			setAsciiOutput(ascii)
			toast.success('Image converted with new settings!')
		}
		img.src = imagePreview
	}

	const handlePatternSelect = (patternId: string) => {
		const pattern = asciiPatterns.find(p => p.id === patternId)
		if (pattern) {
			setAsciiOutput(pattern.pattern.trim())
			setSelectedPattern(patternId)
			toast.success(`Selected ${pattern.name} pattern`)
		}
	}

	const handleCopyAscii = async () => {
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
	}

	const handleDownloadText = () => {
		downloadAsciiAsText(asciiOutput, 'ascii-art.txt')
		toast.success('Downloaded as text file!')
	}

	const handleDownloadImage = () => {
		downloadAsciiAsImage(asciiOutput, 'ascii-art.png', {
			fontSize: 12,
			color: '#000000',
			background: '#FFFFFF'
		})
		toast.success('Downloaded as image!')
	}

	// Tutorial steps
	const tutorialSteps = [
		{
			id: 'welcome',
			title: 'Welcome to ASCII Art Generator',
			description:
				'This tool helps you create ASCII art from text, images, or pre-made patterns'
		},
		{
			id: 'tabs',
			title: 'Choose Your Input Type',
			description:
				'Select Text for text-based art, Image to convert photos, or Patterns for pre-made designs',
			element: '.tabs-list',
			position: 'bottom' as const
		},
		{
			id: 'text-input',
			title: 'Enter Your Text',
			description: 'Type any text here and choose a font style',
			element: 'input[name="text"]',
			position: 'top' as const,
			action: {
				type: 'input' as const,
				target: 'input[name="text"]',
				value: 'Hello ASCII!'
			}
		},
		{
			id: 'generate',
			title: 'Generate ASCII Art',
			description: 'Click this button to create your ASCII art',
			element: 'button:has-text("Generate ASCII Art")',
			position: 'top' as const,
			action: {
				type: 'click' as const,
				target: 'button:has-text("Generate ASCII Art")'
			}
		},
		{
			id: 'copy',
			title: 'Copy or Download',
			description:
				'Copy the result to clipboard or download as text/image file',
			element: '.ascii-output',
			position: 'top' as const
		}
	]

	// Keyboard shortcuts
	const shortcuts: KeyboardShortcut[] = [
		{
			...commonWidgetShortcuts.submit,
			action: () => {
				if (activeTab === 'text') {
					const textInput = document.querySelector(
						'input[name="text"]'
					) as HTMLInputElement
					if (textInput?.value) {
						handleTextToAscii({ text: textInput.value, font: 'standard' })
					}
				}
			}
		},
		{
			key: 'c',
			alt: true,
			description: 'Copy ASCII art',
			action: handleCopyAscii,
			enabled: !!asciiOutput
		},
		{
			key: 'd',
			primary: true,
			shift: true,
			description: 'Download as text',
			action: handleDownloadText,
			enabled: !!asciiOutput
		},
		{
			key: 'i',
			primary: true,
			shift: true,
			description: 'Download as image',
			action: handleDownloadImage,
			enabled: !!asciiOutput
		},
		{
			key: '1',
			primary: true,
			description: 'Text to ASCII tab',
			action: () => setActiveTab('text')
		},
		{
			key: '2',
			primary: true,
			description: 'Image to ASCII tab',
			action: () => setActiveTab('image')
		},
		{
			key: '3',
			primary: true,
			description: 'Patterns tab',
			action: () => setActiveTab('patterns')
		},
		{
			key: 'r',
			primary: true,
			shift: true,
			description: 'Reset all',
			action: () => {
				setAsciiOutput('')
				setImagePreview(null)
				setSelectedPattern('')
				toast.success('Reset complete')
			}
		},
		{
			key: '/',
			description: 'Focus text input',
			action: () => {
				const input = document.querySelector(
					'input[name="text"]'
				) as HTMLInputElement
				input?.focus()
			}
		}
	]

	const { focusElement } = useWidgetKeyboard({
		shortcuts,
		widgetId: 'ascii-art-generator',
		enabled: true
	})

	// Widget tips
	const asciiTips = [
		{
			id: 'font-styles',
			title: 'Multiple Font Styles',
			description: 'Try different font styles for varied artistic effects',
			category: 'basic' as const
		},
		{
			id: 'image-quality',
			title: 'Image Quality Tips',
			description:
				'Use high-contrast images with clear subjects for best results',
			category: 'advanced' as const
		},
		{
			id: 'width-adjustment',
			title: 'Adjust Width',
			description: 'Change the width setting to fit your display or use case',
			category: 'basic' as const
		},
		{
			id: 'keyboard-shortcut',
			title: 'Quick Generate',
			description: 'Press Ctrl/Cmd + Enter to quickly generate ASCII art',
			category: 'shortcut' as const
		},
		{
			id: 'export-options',
			title: 'Export Options',
			description: 'Download as PNG for social media or TXT for code comments',
			category: 'pro' as const
		}
	]

	return (
		<div className='space-y-6'>
			{/* Tips and Tutorial */}
			<div className='flex flex-col sm:flex-row gap-4 justify-between items-start'>
				<WidgetTips
					tips={asciiTips}
					widgetId='ascii-art-generator'
					variant='inline'
					className='flex-1'
				/>
				{!showTutorial && (
					<WidgetTutorial
						steps={tutorialSteps}
						widgetId='ascii-art-generator'
						onComplete={() => {
							toast.success(
								"Tutorial completed! You're ready to create ASCII art"
							)
							setShowTutorial(false)
						}}
					/>
				)}
			</div>
			<Tabs value={activeTab} onValueChange={v => setActiveTab(v as any)}>
				<TabsList className='grid w-full grid-cols-3'>
					<TabsTrigger value='text' className='flex items-center gap-2'>
						<Type className='w-4 h-4' />
						Text to ASCII
					</TabsTrigger>
					<TabsTrigger value='image' className='flex items-center gap-2'>
						<ImageIcon className='w-4 h-4' />
						Image to ASCII
					</TabsTrigger>
					<TabsTrigger value='patterns' className='flex items-center gap-2'>
						<Palette className='w-4 h-4' />
						Patterns
					</TabsTrigger>
				</TabsList>

				<TabsContent value='text' className='mt-6'>
					<WidgetForm
						fields={textFields}
						onSubmit={handleTextToAscii}
						submitLabel='Generate ASCII Art'
					/>
				</TabsContent>

				<TabsContent value='image' className='mt-6 space-y-4'>
					<Card className='p-6'>
						<div className='space-y-4'>
							<div>
								<label className='block text-sm font-medium mb-2'>
									Upload Image
								</label>
								<input
									ref={fileInputRef}
									type='file'
									accept='image/*'
									onChange={handleImageUpload}
									aria-label='Upload Image'
									className='block w-full text-sm text-muted-foreground
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary file:text-primary-foreground
                      hover:file:bg-primary/90'
								/>
							</div>

							{imagePreview && (
								<div className='space-y-2'>
									<p className='text-sm text-muted-foreground'>Preview:</p>
									<Image
										src={imagePreview}
										alt='Uploaded image preview'
										width={300}
										height={200}
										className='max-w-xs rounded-lg border'
									/>
								</div>
							)}
						</div>
					</Card>

					{imagePreview && (
						<WidgetForm
							fields={imageFields}
							onSubmit={handleImageToAscii}
							submitLabel='Update ASCII Art'
							showReset={false}
						/>
					)}
				</TabsContent>

				<TabsContent value='patterns' className='mt-6'>
					<div className='space-y-4'>
						{Object.entries(asciiCategories).map(([category, label]) => (
							<div key={category}>
								<h3 className='font-semibold mb-3'>{label}</h3>
								<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
									{asciiPatterns
										.filter(p => p.category === category)
										.map(pattern => (
											<Card
												key={pattern.id}
												className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
													selectedPattern === pattern.id
														? 'ring-2 ring-primary'
														: ''
												}`}
												onClick={() => handlePatternSelect(pattern.id)}
											>
												<h4 className='font-medium text-sm mb-2'>
													{pattern.name}
												</h4>
												<pre className='text-xs overflow-hidden whitespace-pre font-mono'>
													{pattern.pattern
														.trim()
														.split('\n')
														.slice(0, 3)
														.join('\n')}
													...
												</pre>
											</Card>
										))}
								</div>
							</div>
						))}
					</div>
				</TabsContent>
			</Tabs>

			{/* ASCII Output */}
			{asciiOutput && (
				<Card className='p-6'>
					<div className='flex items-center justify-between mb-4'>
						<h3 className='font-semibold'>ASCII Art Output</h3>
						<div className='flex items-center gap-2'>
							<Button onClick={handleCopyAscii} variant='outline' size='sm'>
								<Copy className='w-4 h-4 mr-2' />
								Copy
							</Button>
							<Button onClick={handleDownloadText} variant='outline' size='sm'>
								<FileText className='w-4 h-4 mr-2' />
								Download Text
							</Button>
							<Button onClick={handleDownloadImage} variant='outline' size='sm'>
								<Download className='w-4 h-4 mr-2' />
								Download Image
							</Button>
						</div>
					</div>

					<div className='relative'>
						<Textarea
							value={asciiOutput}
							readOnly
							className='font-mono text-xs leading-none h-96 resize-none'
							style={{ lineHeight: '1.2' }}
						/>
						<Badge variant='secondary' className='absolute top-2 right-2'>
							{asciiOutput.split('\n').length} lines
						</Badge>
					</div>
				</Card>
			)}

			<WidgetInfo
				howToUse={[
					'Text to ASCII: Enter any text and choose a font style',
					'Image to ASCII: Upload an image to convert it to ASCII characters',
					'Patterns: Browse and select from pre-made ASCII art patterns',
					'Adjust settings like width and character set for images',
					'Copy the result or download as text/image file'
				]}
				features={[
					'Convert text to ASCII art with multiple font styles',
					'Transform images into ASCII art with customizable settings',
					'Library of pre-made ASCII art patterns',
					'Multiple character sets for different styles',
					'Export as text file or PNG image',
					'Real-time preview and adjustments'
				]}
				tips={[
					'Use simple images with good contrast for best results',
					'Adjust width based on where you plan to use the ASCII art',
					'Try different character sets for varied artistic effects',
					'Invert brightness for better results with dark images'
				]}
				warnings={[
					'Large images may take time to process',
					'ASCII art looks best with monospace fonts',
					'Some detail will be lost in image conversion'
				]}
			/>

			<WidgetShareSection
				widgetTitle='ASCII Art Generator'
				widgetDescription='Convert text and images to ASCII art. Create text banners, transform images, or browse ASCII art patterns.'
				hashtags={['asciiart', 'textart', 'developertools', 'webdev']}
			/>

			{/* Keyboard shortcuts */}
			<WidgetKeyboardShortcuts
				shortcuts={shortcuts}
				variant='floating'
				position='bottom-right'
			/>
		</div>
	)
}
