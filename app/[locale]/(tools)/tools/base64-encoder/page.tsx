'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@/components/ui/tooltip'
import {
	ArrowRightLeft,
	Binary,
	Copy,
	Download,
	FileText,
	Link,
	Loader2,
	RotateCcw,
	Shield,
	Upload,
	FileUp,
	FileDown,
	Sparkles,
	History,
	Settings2,
	Eye,
	EyeOff,
	Trash2,
	FileImage,
	Code2,
	Hash,
	Braces,
	Lock,
	Unlock
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'

type Mode = 'encode' | 'decode'
type InputMethod = 'text' | 'file' | 'dataurl'

interface HistoryItem {
	id: string
	timestamp: Date
	mode: Mode
	inputType: InputMethod
	inputSize: number
	outputSize: number
	preview: string
}

interface EncodingStats {
	inputSize: number
	outputSize: number
	ratio: number
	processingTime: number
}

const FILE_SIZE_LIMIT = 10 * 1024 * 1024 // 10MB

export default function Base64EncoderPage() {
	const t = useTranslations('widgets.base64Encoder')
	const [mode, setMode] = useState<Mode>('encode')
	const [inputMethod, setInputMethod] = useState<InputMethod>('text')
	const [input, setInput] = useState('')
	const [output, setOutput] = useState('')
	const [isProcessing, setIsProcessing] = useState(false)
	const [urlSafe, setUrlSafe] = useState(false)
	const [lineBreaks, setLineBreaks] = useState(false)
	const [showLineNumbers, setShowLineNumbers] = useState(false)
	const [stats, setStats] = useState<EncodingStats | null>(null)
	const [history, setHistory] = useState<HistoryItem[]>([])
	const [dragActive, setDragActive] = useState(false)
	const [file, setFile] = useState<File | null>(null)
	const [showPreview, setShowPreview] = useState(false)
	const [imagePreview, setImagePreview] = useState<string | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const processingTimeRef = useRef<number>(0)

	// Load history from localStorage
	useEffect(() => {
		const savedHistory = localStorage.getItem('base64-history')
		if (savedHistory) {
			try {
				const parsed = JSON.parse(savedHistory)
				setHistory(
					parsed.map((item: any) => ({
						...item,
						timestamp: new Date(item.timestamp)
					}))
				)
			} catch (error) {
				console.error('Failed to load history:', error)
			}
		}
	}, [])

	// Save history to localStorage
	useEffect(() => {
		if (history.length > 0) {
			localStorage.setItem('base64-history', JSON.stringify(history))
		}
	}, [history])

	const processBase64 = useCallback(async () => {
		if (!input && !file) return

		setIsProcessing(true)
		const startTime = performance.now()

		try {
			let result = ''
			let inputData = input
			let inputSize = 0

			// Handle file input
			if (inputMethod === 'file' && file) {
				const reader = new FileReader()
				const fileContent = await new Promise<string>((resolve, reject) => {
					reader.onload = e => resolve(e.target?.result as string)
					reader.onerror = reject
					if (mode === 'encode') {
						reader.readAsDataURL(file)
					} else {
						reader.readAsText(file)
					}
				})

				if (mode === 'encode') {
					// Extract base64 from data URL
					inputData = fileContent.split(',')[1] || ''
					result = inputData

					// If it's an image, set preview
					if (file.type.startsWith('image/')) {
						setImagePreview(fileContent)
					}
				} else {
					inputData = fileContent
				}
				inputSize = file.size
			} else {
				inputSize = new Blob([inputData]).size
			}

			// Process encoding/decoding
			if (mode === 'encode' && inputMethod !== 'file') {
				// Handle Data URL input
				if (inputMethod === 'dataurl' && inputData.startsWith('data:')) {
					result = inputData.split(',')[1] || ''
				} else {
					// Regular text encoding
					result = btoa(unescape(encodeURIComponent(inputData)))
				}

				// Apply URL-safe encoding if needed
				if (urlSafe) {
					result = result
						.replace(/\+/g, '-')
						.replace(/\//g, '_')
						.replace(/=+$/, '')
				}

				// Add line breaks if needed
				if (lineBreaks) {
					result = result.match(/.{1,76}/g)?.join('\n') || result
				}
			} else if (mode === 'decode') {
				let toDecode = inputData.trim()

				// Extract from Data URL if needed
				if (inputMethod === 'dataurl' && toDecode.startsWith('data:')) {
					toDecode = toDecode.split(',')[1] || ''
				}

				// Convert URL-safe base64 back to standard
				if (urlSafe) {
					toDecode = toDecode.replace(/-/g, '+').replace(/_/g, '/')
					const padding = toDecode.length % 4
					if (padding) {
						toDecode += '='.repeat(4 - padding)
					}
				}

				// Remove all whitespace
				toDecode = toDecode.replace(/\s/g, '')

				// Decode
				result = decodeURIComponent(escape(atob(toDecode)))
			}

			const endTime = performance.now()
			const processingTime = endTime - startTime

			// Calculate stats
			const outputSize = new Blob([result]).size
			const ratio =
				mode === 'encode'
					? (outputSize / inputSize - 1) * 100
					: (1 - outputSize / inputSize) * 100

			setOutput(result)
			setStats({
				inputSize,
				outputSize,
				ratio,
				processingTime
			})

			// Add to history
			const historyItem: HistoryItem = {
				id: Date.now().toString(),
				timestamp: new Date(),
				mode,
				inputType: inputMethod,
				inputSize,
				outputSize,
				preview: result.substring(0, 50) + (result.length > 50 ? '...' : '')
			}

			setHistory(prev => [historyItem, ...prev].slice(0, 10))

			// Success feedback
			toast.success(t(`success.${mode}`))
		} catch (error) {
			console.error('Processing error:', error)
			toast.error(t(`errors.${mode}Failed`))
			setOutput('')
			setStats(null)
		} finally {
			setIsProcessing(false)
		}
	}, [input, file, mode, inputMethod, urlSafe, lineBreaks, t])

	// Auto-process on input change
	useEffect(() => {
		if (input || file) {
			const timer = setTimeout(() => {
				processBase64()
			}, 500)
			return () => clearTimeout(timer)
		} else {
			setOutput('')
			setStats(null)
			setImagePreview(null)
		}
	}, [input, file, mode, urlSafe, lineBreaks, processBase64])

	const handleDrag = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		if (e.type === 'dragenter' || e.type === 'dragover') {
			setDragActive(true)
		} else if (e.type === 'dragleave') {
			setDragActive(false)
		}
	}, [])

	const handleDrop = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setDragActive(false)

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			handleFileSelect(e.dataTransfer.files[0])
		}
	}, [])

	const handleFileSelect = (selectedFile: File) => {
		if (selectedFile.size > FILE_SIZE_LIMIT) {
			toast.error(t('errors.fileTooLarge'))
			return
		}

		setFile(selectedFile)
		setInputMethod('file')
		setInput('')
	}

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			handleFileSelect(e.target.files[0])
		}
	}

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(output)
			toast.success(t('success.copied'))
		} catch (error) {
			toast.error(t('errors.copyFailed'))
		}
	}

	const downloadOutput = () => {
		const blob = new Blob([output], { type: 'text/plain' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `${mode === 'encode' ? 'encoded' : 'decoded'}-${Date.now()}.txt`
		a.click()
		URL.revokeObjectURL(url)
		toast.success(t('success.downloaded'))
	}

	const swapInputOutput = () => {
		setInput(output)
		setOutput('')
		setFile(null)
		setInputMethod('text')
		setMode(mode === 'encode' ? 'decode' : 'encode')
		setImagePreview(null)
	}

	const reset = () => {
		setInput('')
		setOutput('')
		setFile(null)
		setStats(null)
		setImagePreview(null)
		setInputMethod('text')
		toast.success(t('success.cleared'))
	}

	const clearHistory = () => {
		setHistory([])
		localStorage.removeItem('base64-history')
		toast.success(t('success.historyCleared'))
	}

	const loadFromHistory = (item: HistoryItem) => {
		// For simplicity, we'll just show the output preview
		toast.info(t('info.historyLoaded'))
	}

	const formatBytes = (bytes: number): string => {
		if (bytes === 0) return '0 B'
		const k = 1024
		const sizes = ['B', 'KB', 'MB', 'GB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
	}

	const formatTime = (ms: number): string => {
		if (ms < 1) return '<1ms'
		if (ms < 1000) return `${Math.round(ms)}ms`
		return `${(ms / 1000).toFixed(2)}s`
	}

	return (
		<div className='max-w-7xl mx-auto space-y-6'>
			{/* Header */}
			<Card className='border-0 shadow-lg bg-gradient-to-r from-primary/5 to-accent/5'>
				<CardContent className='p-6'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-4'>
							<div className='p-3 rounded-xl bg-primary/10'>
								<Binary className='w-8 h-8 text-primary' />
							</div>
							<div>
								<h1 className='text-2xl font-bold'>{t('title')}</h1>
								<p className='text-muted-foreground'>{t('description')}</p>
							</div>
						</div>
						<div className='flex items-center gap-2'>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant='outline'
											size='icon'
											onClick={() => setShowPreview(!showPreview)}
											className={cn(showPreview && 'bg-primary/10')}
										>
											{showPreview ? (
												<Eye className='w-4 h-4' />
											) : (
												<EyeOff className='w-4 h-4' />
											)}
										</Button>
									</TooltipTrigger>
									<TooltipContent>{t('preview.toggle')}</TooltipContent>
								</Tooltip>
							</TooltipProvider>
							<Button variant='outline' size='icon' onClick={reset}>
								<RotateCcw className='w-4 h-4' />
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Mode Toggle */}
			<Card>
				<CardContent className='p-4'>
					<Tabs
						value={mode}
						onValueChange={v => setMode(v as Mode)}
						className='w-full'
					>
						<TabsList className='grid grid-cols-2 w-full h-12'>
							<TabsTrigger value='encode' className='gap-2 text-base'>
								<Lock className='w-4 h-4' />
								{t('mode.encode')}
							</TabsTrigger>
							<TabsTrigger value='decode' className='gap-2 text-base'>
								<Unlock className='w-4 h-4' />
								{t('mode.decode')}
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</CardContent>
			</Card>

			<div className='grid lg:grid-cols-2 gap-6'>
				{/* Input Section */}
				<div className='space-y-4'>
					<Card>
						<CardHeader className='pb-4'>
							<div className='flex items-center justify-between'>
								<CardTitle className='text-lg flex items-center gap-2'>
									<FileUp className='w-5 h-5' />
									{t('input.title')}
								</CardTitle>
								<div className='flex items-center gap-2'>
									{/* Input Method Tabs */}
									<Tabs
										value={inputMethod}
										onValueChange={v => setInputMethod(v as InputMethod)}
									>
										<TabsList className='h-8'>
											<TabsTrigger value='text' className='text-xs px-3 h-7'>
												<FileText className='w-3 h-3 mr-1' />
												{t('input.text')}
											</TabsTrigger>
											<TabsTrigger value='file' className='text-xs px-3 h-7'>
												<Upload className='w-3 h-3 mr-1' />
												{t('input.file')}
											</TabsTrigger>
											<TabsTrigger value='dataurl' className='text-xs px-3 h-7'>
												<Link className='w-3 h-3 mr-1' />
												{t('input.dataUrl')}
											</TabsTrigger>
										</TabsList>
									</Tabs>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<AnimatePresence mode='wait'>
								{inputMethod === 'file' ? (
									<motion.div
										key='file'
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										transition={{ duration: 0.2 }}
									>
										<div
											className={cn(
												'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
												dragActive
													? 'border-primary bg-primary/5'
													: 'border-muted-foreground/25',
												file && 'bg-muted/30'
											)}
											onDragEnter={handleDrag}
											onDragLeave={handleDrag}
											onDragOver={handleDrag}
											onDrop={handleDrop}
										>
											<input
												ref={fileInputRef}
												type='file'
												onChange={handleFileInputChange}
												className='hidden'
												accept={mode === 'decode' ? 'text/plain' : '*/*'}
											/>
											{file ? (
												<div className='space-y-4'>
													<div className='flex items-center justify-center gap-3'>
														{file.type.startsWith('image/') ? (
															<FileImage className='w-12 h-12 text-primary' />
														) : file.type.includes('json') ? (
															<Braces className='w-12 h-12 text-primary' />
														) : (
															<FileText className='w-12 h-12 text-primary' />
														)}
														<div className='text-left'>
															<p className='font-medium'>{file.name}</p>
															<p className='text-sm text-muted-foreground'>
																{formatBytes(file.size)}
															</p>
														</div>
													</div>
													<div className='flex gap-2 justify-center'>
														<Button
															variant='outline'
															size='sm'
															onClick={() => fileInputRef.current?.click()}
														>
															{t('actions.changeFile')}
														</Button>
														<Button
															variant='outline'
															size='sm'
															onClick={() => {
																setFile(null)
																setImagePreview(null)
															}}
														>
															<Trash2 className='w-4 h-4' />
														</Button>
													</div>
												</div>
											) : (
												<>
													<Upload className='w-12 h-12 mx-auto mb-4 text-muted-foreground' />
													<p className='text-lg font-medium mb-2'>
														{t('input.dropFile')}
													</p>
													<p className='text-sm text-muted-foreground mb-4'>
														{t('input.or')}
													</p>
													<Button
														variant='outline'
														onClick={() => fileInputRef.current?.click()}
													>
														{t('input.selectFile')}
													</Button>
													<p className='text-xs text-muted-foreground mt-4'>
														{t('input.maxSize', { size: '10MB' })}
													</p>
												</>
											)}
										</div>
									</motion.div>
								) : (
									<motion.div
										key='text'
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										transition={{ duration: 0.2 }}
									>
										<div className='relative'>
											<Textarea
												value={input}
												onChange={e => setInput(e.target.value)}
												placeholder={t(
													`input.placeholder.${inputMethod}.${mode}`
												)}
												className='min-h-[300px] font-mono text-sm resize-none'
												spellCheck={false}
											/>
											{showLineNumbers && input && (
												<div className='absolute left-2 top-2 text-xs text-muted-foreground select-none pointer-events-none'>
													{input.split('\n').map((_, i) => (
														<div key={i}>{i + 1}</div>
													))}
												</div>
											)}
											{input && (
												<Badge
													variant='secondary'
													className='absolute top-2 right-2'
												>
													{formatBytes(new Blob([input]).size)}
												</Badge>
											)}
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</CardContent>
					</Card>

					{/* Options */}
					<Card>
						<CardHeader className='pb-3'>
							<CardTitle className='text-base flex items-center gap-2'>
								<Settings2 className='w-4 h-4' />
								{t('options.title')}
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-3'>
							<div className='flex items-center justify-between'>
								<Label htmlFor='url-safe' className='text-sm cursor-pointer'>
									{t('options.urlSafe')}
								</Label>
								<Switch
									id='url-safe'
									checked={urlSafe}
									onCheckedChange={setUrlSafe}
								/>
							</div>
							{mode === 'encode' && (
								<div className='flex items-center justify-between'>
									<Label
										htmlFor='line-breaks'
										className='text-sm cursor-pointer'
									>
										{t('options.lineBreaks')}
									</Label>
									<Switch
										id='line-breaks'
										checked={lineBreaks}
										onCheckedChange={setLineBreaks}
									/>
								</div>
							)}
							<div className='flex items-center justify-between'>
								<Label
									htmlFor='line-numbers'
									className='text-sm cursor-pointer'
								>
									{t('options.lineNumbers')}
								</Label>
								<Switch
									id='line-numbers'
									checked={showLineNumbers}
									onCheckedChange={setShowLineNumbers}
								/>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Output Section */}
				<div className='space-y-4'>
					<Card>
						<CardHeader className='pb-4'>
							<div className='flex items-center justify-between'>
								<CardTitle className='text-lg flex items-center gap-2'>
									<FileDown className='w-5 h-5' />
									{t('output.title')}
								</CardTitle>
								{output && (
									<div className='flex items-center gap-2'>
										<Button
											size='sm'
											variant='outline'
											onClick={copyToClipboard}
											className='h-8'
										>
											<Copy className='w-3.5 h-3.5 mr-1.5' />
											{t('actions.copy')}
										</Button>
										<Button
											size='sm'
											variant='outline'
											onClick={downloadOutput}
											className='h-8'
										>
											<Download className='w-3.5 h-3.5 mr-1.5' />
											{t('actions.download')}
										</Button>
									</div>
								)}
							</div>
						</CardHeader>
						<CardContent>
							<div className='relative'>
								{isProcessing ? (
									<div className='flex items-center justify-center h-[300px]'>
										<Loader2 className='w-8 h-8 animate-spin text-muted-foreground' />
									</div>
								) : (
									<>
										<Textarea
											value={output}
											readOnly
											placeholder={t(`output.placeholder.${mode}`)}
											className='min-h-[300px] font-mono text-sm resize-none'
											spellCheck={false}
										/>
										{output && (
											<Badge
												variant='secondary'
												className='absolute top-2 right-2'
											>
												{formatBytes(new Blob([output]).size)}
											</Badge>
										)}
									</>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Stats & Actions */}
					{stats && (
						<Card>
							<CardContent className='p-4'>
								<div className='grid grid-cols-2 gap-4 mb-4'>
									<div className='text-center p-3 rounded-lg bg-muted/50'>
										<div className='text-2xl font-bold'>
											{stats.ratio > 0 ? '+' : ''}
											{stats.ratio.toFixed(1)}%
										</div>
										<div className='text-xs text-muted-foreground'>
											{t(
												`stats.${mode === 'encode' ? 'increase' : 'decrease'}`
											)}
										</div>
									</div>
									<div className='text-center p-3 rounded-lg bg-muted/50'>
										<div className='text-2xl font-bold'>
											{formatTime(stats.processingTime)}
										</div>
										<div className='text-xs text-muted-foreground'>
											{t('stats.time')}
										</div>
									</div>
								</div>
								<Button
									className='w-full'
									variant='outline'
									onClick={swapInputOutput}
									disabled={!output}
								>
									<ArrowRightLeft className='w-4 h-4 mr-2' />
									{t(`actions.swap.${mode}`)}
								</Button>
							</CardContent>
						</Card>
					)}

					{/* Image Preview */}
					{showPreview && imagePreview && (
						<Card>
							<CardHeader className='pb-3'>
								<CardTitle className='text-base'>
									{t('preview.title')}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='rounded-lg overflow-hidden bg-checkered'>
									<img
										src={imagePreview}
										alt='Preview'
										className='max-w-full max-h-64 mx-auto'
									/>
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</div>

			{/* History */}
			{history.length > 0 && (
				<Card>
					<CardHeader>
						<div className='flex items-center justify-between'>
							<CardTitle className='text-lg flex items-center gap-2'>
								<History className='w-5 h-5' />
								{t('history.title')}
							</CardTitle>
							<Button variant='ghost' size='sm' onClick={clearHistory}>
								{t('history.clear')}
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						<div className='space-y-2'>
							{history.map(item => (
								<div
									key={item.id}
									className='flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer'
									onClick={() => loadFromHistory(item)}
								>
									<div className='flex items-center gap-3'>
										<div className='p-2 rounded bg-background'>
											{item.mode === 'encode' ? (
												<Lock className='w-4 h-4' />
											) : (
												<Unlock className='w-4 h-4' />
											)}
										</div>
										<div>
											<div className='flex items-center gap-2'>
												<span className='font-medium text-sm'>
													{t(`mode.${item.mode}`)}
												</span>
												<Badge variant='outline' className='text-xs'>
													{t(`input.${item.inputType}`)}
												</Badge>
											</div>
											<div className='text-xs text-muted-foreground'>
												{formatBytes(item.inputSize)} →{' '}
												{formatBytes(item.outputSize)}
												{' • '}
												{new Date(item.timestamp).toLocaleTimeString()}
											</div>
										</div>
									</div>
									<div className='text-xs font-mono text-muted-foreground max-w-[200px] truncate'>
										{item.preview}
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Quick Examples */}
			<Card>
				<CardHeader>
					<CardTitle className='text-lg flex items-center gap-2'>
						<Sparkles className='w-5 h-5' />
						{t('examples.title')}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-3'>
						{[
							{
								title: t('examples.text'),
								icon: <FileText className='w-4 h-4' />,
								value: 'Hello, World!',
								mode: 'encode' as Mode,
								type: 'text' as InputMethod
							},
							{
								title: t('examples.json'),
								icon: <Braces className='w-4 h-4' />,
								value: '{"name": "John", "age": 30}',
								mode: 'encode' as Mode,
								type: 'text' as InputMethod
							},
							{
								title: t('examples.html'),
								icon: <Code2 className='w-4 h-4' />,
								value: '<h1>Hello World</h1>',
								mode: 'encode' as Mode,
								type: 'text' as InputMethod
							},
							{
								title: t('examples.base64'),
								icon: <Hash className='w-4 h-4' />,
								value: 'SGVsbG8sIFdvcmxkIQ==',
								mode: 'decode' as Mode,
								type: 'text' as InputMethod
							},
							{
								title: t('examples.dataUrl'),
								icon: <Link className='w-4 h-4' />,
								value: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==',
								mode: 'decode' as Mode,
								type: 'dataurl' as InputMethod
							},
							{
								title: t('examples.urlSafe'),
								icon: <Shield className='w-4 h-4' />,
								value: 'SGVsbG8sIFdvcmxkIQ',
								mode: 'decode' as Mode,
								type: 'text' as InputMethod
							}
						].map((example, index) => (
							<Button
								key={index}
								variant='outline'
								className='h-auto p-4 justify-start'
								onClick={() => {
									setMode(example.mode)
									setInputMethod(example.type)
									setInput(example.value)
									if (example.title === t('examples.urlSafe')) {
										setUrlSafe(true)
									}
								}}
							>
								<div className='flex items-start gap-3'>
									<div className='p-2 rounded-lg bg-muted'>{example.icon}</div>
									<div className='text-left'>
										<div className='font-medium text-sm'>{example.title}</div>
										<div className='text-xs text-muted-foreground mt-1'>
											{example.value.substring(0, 30)}...
										</div>
									</div>
								</div>
							</Button>
						))}
					</div>
				</CardContent>
			</Card>

			<style jsx>{`
				.bg-checkered {
					background-color: #f0f0f0;
					background-image:
						linear-gradient(45deg, #e0e0e0 25%, transparent 25%),
						linear-gradient(-45deg, #e0e0e0 25%, transparent 25%),
						linear-gradient(45deg, transparent 75%, #e0e0e0 75%),
						linear-gradient(-45deg, transparent 75%, #e0e0e0 75%);
					background-size: 20px 20px;
					background-position:
						0 0,
						0 10px,
						10px -10px,
						-10px 0px;
				}
			`}</style>
		</div>
	)
}
