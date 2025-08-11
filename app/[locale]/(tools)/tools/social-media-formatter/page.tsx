'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	Copy,
	Check,
	RefreshCw,
	Space,
	AlignLeft,
	Hash,
	Facebook,
	Instagram,
	Twitter
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface FormatterOption {
	id: string
	label: string
	icon: React.ReactNode
	description: string
	transform: (text: string) => string
	example: {
		before: string
		after: string
	}
}

// Zero-width characters for different purposes
const ZERO_WIDTH_SPACE = '\u200B'
const ZERO_WIDTH_NON_JOINER = '\u200C'
const ZERO_WIDTH_JOINER = '\u200D'
const WORD_JOINER = '\u2060'
const INVISIBLE_SEPARATOR = '\u2063'

const formatterOptions: FormatterOption[] = [
	{
		id: 'preserve-spaces',
		label: 'Preserve Spaces',
		icon: <Space className='w-4 h-4' />,
		description: 'Keep multiple spaces between words',
		transform: (text: string) => {
			// Replace multiple spaces with space + zero-width space pattern
			return text.replace(/ {2,}/g, match => {
				return match.split('').join(ZERO_WIDTH_SPACE)
			})
		},
		example: {
			before: 'Hello     World',
			after: 'Hello     World'
		}
	},
	{
		id: 'preserve-newlines',
		label: 'Preserve Line Breaks',
		icon: <AlignLeft className='w-4 h-4' />,
		description: 'Keep multiple line breaks in posts',
		transform: (text: string) => {
			// Replace multiple newlines with newline + zero-width space pattern
			return text.replace(/\n{2,}/g, match => {
				return match.split('').join(ZERO_WIDTH_SPACE)
			})
		},
		example: {
			before: 'Line 1\n\n\n\nLine 2',
			after: 'Line 1\n\n\n\nLine 2'
		}
	},
	{
		id: 'text-indent',
		label: 'Text Indentation',
		icon: <AlignLeft className='w-4 h-4' />,
		description: 'Add indentation to paragraphs',
		transform: (text: string) => {
			// Add 4 spaces with zero-width spaces at the beginning of each paragraph
			const indent = '    '.split('').join(ZERO_WIDTH_SPACE)
			return text
				.split('\n')
				.map(line => {
					if (line.trim()) {
						return indent + line
					}
					return line
				})
				.join('\n')
		},
		example: {
			before: 'First paragraph\nSecond paragraph',
			after: '    First paragraph\n    Second paragraph'
		}
	},
	{
		id: 'center-text',
		label: 'Center Text',
		icon: <AlignLeft className='w-4 h-4' />,
		description: 'Center text with spaces',
		transform: (text: string) => {
			const lines = text.split('\n')
			const maxLength = Math.max(...lines.map(line => line.length))

			return lines
				.map(line => {
					if (line.trim()) {
						const spaces = Math.floor((maxLength - line.trim().length) / 2)
						const padding = ' '.repeat(spaces).split('').join(ZERO_WIDTH_SPACE)
						return padding + line.trim() + padding
					}
					return line
				})
				.join('\n')
		},
		example: {
			before: 'Center\nThis Text',
			after: '   Center   \n This Text  '
		}
	},
	{
		id: 'full-format',
		label: 'Full Format',
		icon: <Hash className='w-4 h-4' />,
		description: 'Preserve all spaces and line breaks',
		transform: (text: string) => {
			// Preserve both spaces and newlines
			let result = text

			// Replace multiple spaces
			result = result.replace(/ {2,}/g, match => {
				return match.split('').join(ZERO_WIDTH_SPACE)
			})

			// Replace multiple newlines
			result = result.replace(/\n{2,}/g, match => {
				return match.split('').join(ZERO_WIDTH_SPACE)
			})

			return result
		},
		example: {
			before: 'Text   with\n\n\nmultiple   spaces',
			after: 'Text   with\n\n\nmultiple   spaces'
		}
	}
]

export default function SocialMediaFormatterPage() {
	const [mounted, setMounted] = useState(false)
	const [inputText, setInputText] = useState('')
	const [outputText, setOutputText] = useState('')
	const [selectedOption, setSelectedOption] = useState('preserve-spaces')
	const [copiedOutput, setCopiedOutput] = useState(false)
	const [charCount, setCharCount] = useState({ input: 0, output: 0 })

	useEffect(() => {
		setMounted(true)
	}, [])

	useEffect(() => {
		setCharCount({
			input: inputText.length,
			output: outputText.length
		})
	}, [inputText, outputText])

	const formatText = () => {
		if (!inputText.trim()) {
			toast.error('Please enter some text')
			return
		}

		const option = formatterOptions.find(opt => opt.id === selectedOption)
		if (!option) return

		const formatted = option.transform(inputText)
		setOutputText(formatted)
		toast.success('Text formatted successfully!')
	}

	const copyToClipboard = async () => {
		if (!outputText) {
			toast.error('No formatted text to copy')
			return
		}

		try {
			await navigator.clipboard.writeText(outputText)
			setCopiedOutput(true)
			toast.success('Copied to clipboard! Paste it on your social media.')
			setTimeout(() => setCopiedOutput(false), 2000)
		} catch (err) {
			toast.error('Failed to copy text')
		}
	}

	const reset = () => {
		setInputText('')
		setOutputText('')
		toast.success('Reset complete')
	}

	if (!mounted) {
		return (
			<div className='max-w-6xl mx-auto space-y-8'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight mb-2'>
						Social Media Formatter
					</h1>
					<p className='text-muted-foreground'>
						Format text with spaces and line breaks for social media
					</p>
				</div>
				<div className='animate-pulse space-y-8'>
					<div className='h-96 bg-muted rounded-lg'></div>
				</div>
			</div>
		)
	}

	return (
		<div className='max-w-6xl mx-auto space-y-8'>
			{/* Formatter Options */}
			<Card className='p-6'>
				<h3 className='font-semibold mb-4'>Formatting Options</h3>
				<Tabs value={selectedOption} onValueChange={setSelectedOption}>
					<TabsList className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 w-full'>
						{formatterOptions.map(option => (
							<TabsTrigger
								key={option.id}
								value={option.id}
								className='text-xs'
							>
								<span className='flex items-center gap-1'>
									{option.icon}
									<span className='hidden sm:inline'>{option.label}</span>
								</span>
							</TabsTrigger>
						))}
					</TabsList>

					{formatterOptions.map(option => (
						<TabsContent key={option.id} value={option.id} className='mt-4'>
							<div className='space-y-3'>
								<p className='text-sm text-muted-foreground'>
									{option.description}
								</p>
								<div className='grid md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg'>
									<div>
										<p className='text-xs font-medium mb-1'>Before:</p>
										<code className='text-xs bg-background p-2 rounded block whitespace-pre'>
											{option.example.before}
										</code>
									</div>
									<div>
										<p className='text-xs font-medium mb-1'>After:</p>
										<code className='text-xs bg-background p-2 rounded block whitespace-pre'>
											{option.example.after}
										</code>
									</div>
								</div>
							</div>
						</TabsContent>
					))}
				</Tabs>
			</Card>

			{/* Text Areas */}
			<div className='grid lg:grid-cols-2 gap-6'>
				{/* Input */}
				<Card className='p-6'>
					<div className='space-y-4'>
						<div className='flex items-center justify-between'>
							<Label htmlFor='input'>Input Text</Label>
							<Badge variant='outline'>{charCount.input} chars</Badge>
						</div>

						<Textarea
							id='input'
							value={inputText}
							onChange={e => setInputText(e.target.value)}
							placeholder='Enter your text here...'
							className='min-h-[300px] font-mono text-sm'
							spellCheck={false}
						/>

						<div className='flex gap-2'>
							<Button onClick={formatText} className='flex-1'>
								<RefreshCw className='w-4 h-4 mr-2' />
								Format Text
							</Button>
							<Button onClick={reset} variant='outline'>
								Reset
							</Button>
						</div>
					</div>
				</Card>

				{/* Output */}
				<Card className='p-6'>
					<div className='space-y-4'>
						<div className='flex items-center justify-between'>
							<Label htmlFor='output'>Formatted Text</Label>
							<div className='flex items-center gap-2'>
								<Badge variant='outline'>{charCount.output} chars</Badge>
								{outputText && charCount.output > charCount.input && (
									<Badge variant='secondary'>
										+{charCount.output - charCount.input} invisible chars
									</Badge>
								)}
							</div>
						</div>

						<Textarea
							id='output'
							value={outputText}
							readOnly
							placeholder='Formatted text will appear here...'
							className='min-h-[300px] font-mono text-sm bg-muted'
							spellCheck={false}
						/>

						<Button
							onClick={copyToClipboard}
							className='w-full'
							disabled={!outputText}
						>
							{copiedOutput ? (
								<>
									<Check className='w-4 h-4 mr-2' />
									Copied!
								</>
							) : (
								<>
									<Copy className='w-4 h-4 mr-2' />
									Copy to Clipboard
								</>
							)}
						</Button>
					</div>
				</Card>
			</div>

			{/* Instructions */}
			<Card className='p-6 bg-muted/50'>
				<h3 className='font-semibold mb-3'>How to Use</h3>
				<ol className='space-y-2 text-sm'>
					<li className='flex gap-2'>
						<span className='font-medium'>1.</span>
						<span>Enter or paste your text in the input field</span>
					</li>
					<li className='flex gap-2'>
						<span className='font-medium'>2.</span>
						<span>Choose a formatting option that suits your needs</span>
					</li>
					<li className='flex gap-2'>
						<span className='font-medium'>3.</span>
						<span>Click &quot;Format Text&quot; to apply the formatting</span>
					</li>
					<li className='flex gap-2'>
						<span className='font-medium'>4.</span>
						<span>
							Copy the formatted text and paste it on your social media platform
						</span>
					</li>
				</ol>
			</Card>

			{/* Info Section */}
			<Card className='p-6 bg-muted/50'>
				<h3 className='font-semibold mb-3'>How It Works</h3>
				<div className='space-y-3 text-sm text-muted-foreground'>
					<p>
						Social media platforms typically remove extra spaces and line breaks
						to maintain consistent formatting. This tool uses invisible Unicode
						characters (zero-width spaces) to preserve your intended formatting.
					</p>
					<div className='grid md:grid-cols-2 gap-4 mt-4'>
						<div>
							<h4 className='font-medium text-foreground mb-2'>
								Supported Features
							</h4>
							<ul className='space-y-1 text-xs'>
								<li>• Multiple spaces between words</li>
								<li>• Extra line breaks between paragraphs</li>
								<li>• Text indentation</li>
								<li>• Centered text alignment</li>
							</ul>
						</div>
						<div>
							<h4 className='font-medium text-foreground mb-2'>
								Compatible Platforms
							</h4>
							<ul className='space-y-1 text-xs'>
								<li>• Facebook posts and comments</li>
								<li>• Instagram captions and bio</li>
								<li>• Twitter/X posts</li>
								<li>• LinkedIn posts</li>
								<li>• WordPress and other blogs</li>
							</ul>
						</div>
					</div>
					<p className='text-xs mt-4'>
						Note: Some platforms may still have limitations. The formatting
						works best with Latin characters and may vary with different fonts
						or devices.
					</p>
				</div>
			</Card>
		</div>
	)
}
