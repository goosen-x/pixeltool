'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
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
	AlertCircle,
	Check
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

type InputMethod = 'text' | 'file' | 'dataurl'

interface HistoryItem {
	id: string
	plainText: string
	base64Text: string
	timestamp: Date
}

interface EncodingStats {
	inputSize: number
	outputSize: number
	ratio: number
	processingTime: number
}

const FILE_SIZE_LIMIT = 10 * 1024 * 1024 // 10MB

export default function Base64EncoderPage() {
	const [plainText, setPlainText] = useState('')
	const [base64Text, setBase64Text] = useState('')
	const [isProcessing, setIsProcessing] = useState(false)
	const [urlSafe, setUrlSafe] = useState(false)
	const [lineBreaks, setLineBreaks] = useState(false)
	const [stats, setStats] = useState<EncodingStats | null>(null)
	const [history, setHistory] = useState<HistoryItem[]>([])
	const [dragActive, setDragActive] = useState(false)
	const [file, setFile] = useState<File | null>(null)
	const [showPreview, setShowPreview] = useState(false)
	const [imagePreview, setImagePreview] = useState<string | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [lastEditedField, setLastEditedField] = useState<'plain' | 'base64'>(
		'plain'
	)
	const [base64Error, setBase64Error] = useState<string | null>(null)

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

	const encodeToBase64 = useCallback(
		(text: string) => {
			if (!text || text.trim().length === 0) return ''

			try {
				let result = btoa(unescape(encodeURIComponent(text)))

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

				return result
			} catch (error) {
				return ''
			}
		},
		[urlSafe, lineBreaks]
	)

	const decodeFromBase64 = useCallback(
		(base64: string) => {
			if (!base64 || base64.trim().length === 0)
				return { result: '', error: null }

			try {
				let toDecode = base64.trim()

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

				// Check for valid Base64 characters
				const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/
				if (!base64Regex.test(toDecode)) {
					return { result: '', error: 'Неверные символы Base64' }
				}

				// Decode
				try {
					const decoded = atob(toDecode)
					const result = decodeURIComponent(escape(decoded))
					return { result, error: null }
				} catch (e) {
					// If decoding fails, try without URI decoding
					try {
						const result = atob(toDecode)
						return { result, error: null }
					} catch (e2) {
						return { result: '', error: 'Неверный формат Base64' }
					}
				}
			} catch (error) {
				return { result: '', error: 'Ошибка декодирования' }
			}
		},
		[urlSafe]
	)

	// Handle plain text changes
	useEffect(() => {
		if (lastEditedField === 'plain') {
			const timer = setTimeout(() => {
				const encoded = encodeToBase64(plainText)
				setBase64Text(encoded)
				setBase64Error(null)

				// Calculate stats
				if (plainText && encoded) {
					const inputSize = new Blob([plainText]).size
					const outputSize = new Blob([encoded]).size
					const ratio = ((outputSize / inputSize - 1) * 100).toFixed(0)
					setStats({
						inputSize,
						outputSize,
						ratio: parseFloat(ratio),
						processingTime: 0
					})
				} else {
					setStats(null)
				}
			}, 300)
			return () => clearTimeout(timer)
		}
	}, [plainText, lastEditedField, encodeToBase64])

	// Handle base64 text changes
	useEffect(() => {
		if (lastEditedField === 'base64') {
			const timer = setTimeout(() => {
				const { result, error } = decodeFromBase64(base64Text)
				setPlainText(result)
				setBase64Error(error)

				// Calculate stats
				if (base64Text && result && !error) {
					const inputSize = new Blob([base64Text]).size
					const outputSize = new Blob([result]).size
					const ratio = ((1 - outputSize / inputSize) * 100).toFixed(0)
					setStats({
						inputSize,
						outputSize,
						ratio: parseFloat(ratio),
						processingTime: 0
					})
				} else {
					setStats(null)
				}
			}, 300)
			return () => clearTimeout(timer)
		}
	}, [base64Text, lastEditedField, decodeFromBase64])

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
			toast.error('Файл слишком большой. Максимальный размер: 10MB')
			return
		}

		setFile(selectedFile)
	}

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			handleFileSelect(e.target.files[0])
		}
	}

	const copyToClipboard = async (text: string, type: 'plain' | 'base64') => {
		try {
			await navigator.clipboard.writeText(text)
			toast.success(
				type === 'plain'
					? 'Обычный текст скопирован!'
					: 'Base64 текст скопирован!'
			)
		} catch (error) {
			toast.error('Ошибка копирования')
		}
	}

	const downloadFile = (text: string, type: 'plain' | 'base64') => {
		const blob = new Blob([text], { type: 'text/plain' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `${type === 'base64' ? 'base64-encoded' : 'plain-text'}-${Date.now()}.txt`
		a.click()
		URL.revokeObjectURL(url)
		toast.success('Файл загружен!')
	}

	const reset = () => {
		setPlainText('')
		setBase64Text('')
		setFile(null)
		setStats(null)
		setImagePreview(null)
		setBase64Error(null)
		setLastEditedField('plain')
		toast.success('Поля очищены!')
	}

	const clearHistory = () => {
		setHistory([])
		localStorage.removeItem('base64-history')
		toast.success('История очищена!')
	}

	const loadFromHistory = (item: HistoryItem) => {
		setPlainText(item.plainText)
		setBase64Text(item.base64Text)
		setLastEditedField('plain')
		setBase64Error(null)
		toast.success('Данные загружены из истории!')
	}

	const addToHistory = useCallback(() => {
		if (!plainText && !base64Text) return

		const historyItem: HistoryItem = {
			id: Date.now().toString(),
			plainText,
			base64Text,
			timestamp: new Date()
		}

		setHistory(prev => [historyItem, ...prev].slice(0, 10))
	}, [plainText, base64Text])

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
			{/* Quick Examples & Options */}
			<Card>
				<CardContent className='p-4'>
					<div className='flex gap-4'>
						<div className='flex-1'>
							<div className='flex items-center gap-2 mb-3'>
								<Sparkles className='w-4 h-4 text-muted-foreground' />
								<span className='text-sm font-medium text-muted-foreground'>
									Быстрые примеры
								</span>
							</div>
							<div className='flex flex-wrap gap-2'>
								{[
									{
										title: 'Текст',
										icon: <FileText className='w-3 h-3' />,
										plainValue: 'Hello, World!',
										base64Value: 'SGVsbG8sIFdvcmxkIQ=='
									},
									{
										title: 'JSON',
										icon: <Braces className='w-3 h-3' />,
										plainValue: '{"name": "John", "age": 30}',
										base64Value: 'eyJuYW1lIjogIkpvaG4iLCAiYWdlIjogMzB9'
									},
									{
										title: 'HTML',
										icon: <Code2 className='w-3 h-3' />,
										plainValue: '<h1>Hello World</h1>',
										base64Value: 'PGgxPkhlbGxvIFdvcmxkPC9oMT4='
									},
									{
										title: 'Эмодзи',
										icon: <Hash className='w-3 h-3' />,
										plainValue: '🚀 Ready to launch!',
										base64Value: '8J+agCBSZWFkeSB0byBsYXVuY2gh'
									}
								].map((example, index) => (
									<Button
										key={index}
										variant='outline'
										size='sm'
										className='h-8 px-3 gap-1.5'
										onClick={() => {
											setPlainText(example.plainValue)
											setBase64Text(example.base64Value)
											setLastEditedField('plain')
											setBase64Error(null)
											// Add to history after a short delay to allow state to update
											setTimeout(() => {
												const historyItem: HistoryItem = {
													id: Date.now().toString(),
													plainText: example.plainValue,
													base64Text: example.base64Value,
													timestamp: new Date()
												}
												setHistory(prev => [historyItem, ...prev].slice(0, 10))
											}, 100)
										}}
									>
										{example.icon}
										<span className='text-xs'>{example.title}</span>
									</Button>
								))}
							</div>
						</div>
						<div className='border-l pl-4 space-y-3'>
							<div className='flex items-center justify-between gap-4'>
								<Label
									htmlFor='url-safe'
									className='text-xs cursor-pointer whitespace-nowrap'
								>
									URL-безопасный
								</Label>
								<Switch
									id='url-safe'
									checked={urlSafe}
									onCheckedChange={setUrlSafe}
								/>
							</div>
							<div className='flex items-center justify-between gap-4'>
								<Label
									htmlFor='line-breaks'
									className='text-xs cursor-pointer whitespace-nowrap'
								>
									Разбить на строки
								</Label>
								<Switch
									id='line-breaks'
									checked={lineBreaks}
									onCheckedChange={setLineBreaks}
								/>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Bidirectional Interface */}
			<div className='grid lg:grid-cols-2 gap-6'>
				{/* Plain Text Section */}
				<Card>
					<CardHeader className='pb-4'>
						<div className='flex items-center justify-between'>
							<CardTitle className='text-lg flex items-center gap-2'>
								<FileText className='w-5 h-5' />
								Обычный текст
							</CardTitle>
							{plainText && (
								<div className='flex items-center gap-2'>
									<Button
										size='sm'
										variant='outline'
										onClick={() => copyToClipboard(plainText, 'plain')}
										className='h-8'
									>
										<Copy className='w-3.5 h-3.5 mr-1.5' />
										Копировать
									</Button>
									<Button
										size='sm'
										variant='outline'
										onClick={() => downloadFile(plainText, 'plain')}
										className='h-8'
									>
										<Download className='w-3.5 h-3.5 mr-1.5' />
										Скачать
									</Button>
								</div>
							)}
						</div>
					</CardHeader>
					<CardContent>
						<div className='relative'>
							<Textarea
								value={plainText}
								onChange={e => {
									setPlainText(e.target.value)
									setLastEditedField('plain')
								}}
								placeholder='Введите текст для кодирования...'
								className='min-h-[300px] font-mono text-sm resize-none'
								spellCheck={false}
							/>
							{plainText && (
								<Badge variant='secondary' className='absolute top-2 right-2'>
									{formatBytes(new Blob([plainText]).size)}
								</Badge>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Base64 Section */}
				<Card>
					<CardHeader className='pb-4'>
						<div className='flex items-center justify-between'>
							<CardTitle
								className={cn(
									'text-lg flex items-center gap-2',
									base64Error && 'text-destructive'
								)}
							>
								<Binary className='w-5 h-5' />
								Base64 текст
								{base64Error && <AlertCircle className='w-4 h-4' />}
							</CardTitle>
							{base64Text && !base64Error && (
								<div className='flex items-center gap-2'>
									<Button
										size='sm'
										variant='outline'
										onClick={() => copyToClipboard(base64Text, 'base64')}
										className='h-8'
									>
										<Copy className='w-3.5 h-3.5 mr-1.5' />
										Копировать
									</Button>
									<Button
										size='sm'
										variant='outline'
										onClick={() => downloadFile(base64Text, 'base64')}
										className='h-8'
									>
										<Download className='w-3.5 h-3.5 mr-1.5' />
										Скачать
									</Button>
								</div>
							)}
						</div>
						{base64Error && (
							<div className='mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded-md flex items-center gap-2 text-sm text-destructive'>
								<AlertCircle className='w-4 h-4' />
								{base64Error}
							</div>
						)}
					</CardHeader>
					<CardContent>
						<div className='relative'>
							<Textarea
								value={base64Text}
								onChange={e => {
									setBase64Text(e.target.value)
									setLastEditedField('base64')
								}}
								placeholder='Введите Base64 текст для декодирования...'
								className={cn(
									'min-h-[300px] font-mono text-sm resize-none',
									base64Error && 'border-destructive focus:border-destructive'
								)}
								spellCheck={false}
							/>
							{base64Text && !base64Error && (
								<Badge variant='secondary' className='absolute top-2 right-2'>
									{formatBytes(new Blob([base64Text]).size)}
								</Badge>
							)}
							{!base64Error && base64Text && (
								<div className='absolute bottom-2 right-2'>
									<Check className='w-4 h-4 text-green-600' />
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Size stats */}
			{stats && (
				<div className='flex justify-center'>
					<div className='inline-flex items-center gap-3 px-4 py-2 bg-muted/50 rounded-lg text-sm'>
						<span className='text-muted-foreground'>Изменение размера:</span>
						<span
							className={cn(
								'font-semibold',
								stats.ratio > 0 ? 'text-orange-600' : 'text-green-600'
							)}
						>
							{stats.ratio > 0 ? '+' : ''}
							{stats.ratio}%
						</span>
						<span className='text-muted-foreground text-xs'>
							({formatBytes(stats.inputSize)} → {formatBytes(stats.outputSize)})
						</span>
					</div>
				</div>
			)}

			{/* Clear All button when no history */}
			{history.length === 0 && (plainText || base64Text) && (
				<div className='flex justify-center'>
					<Button variant='outline' size='sm' onClick={reset}>
						<RotateCcw className='w-4 h-4 mr-2' />
						Очистить
					</Button>
				</div>
			)}

			{/* History */}
			{history.length > 0 && (
				<Card>
					<CardHeader>
						<div className='flex items-center justify-between'>
							<CardTitle className='text-lg flex items-center gap-2'>
								<History className='w-5 h-5' />
								История
							</CardTitle>
							<div className='flex items-center gap-2'>
								<Button variant='outline' size='sm' onClick={reset}>
									<RotateCcw className='w-3 h-3 mr-1.5' />
									Очистить
								</Button>
								<Button variant='ghost' size='sm' onClick={clearHistory}>
									Очистить историю
								</Button>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className='space-y-3'>
							{history.map(item => (
								<div
									key={item.id}
									className='p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer'
									onClick={() => loadFromHistory(item)}
								>
									<div className='flex items-start justify-between gap-4'>
										<div className='flex-1 min-w-0'>
											<div className='flex items-center gap-2 mb-2'>
												<ArrowRightLeft className='w-4 h-4' />
												<span className='text-sm font-medium'>
													Преобразование
												</span>
												<Badge variant='outline' className='text-xs'>
													{new Date(item.timestamp).toLocaleTimeString()}
												</Badge>
											</div>
											<div className='grid md:grid-cols-2 gap-3'>
												<div>
													<Label className='text-xs text-muted-foreground'>
														Обычный текст
													</Label>
													<div className='text-xs font-mono bg-background rounded p-2 mt-1 truncate'>
														{item.plainText
															? item.plainText.substring(0, 50)
															: ''}
														{item.plainText &&
															item.plainText.length > 50 &&
															'...'}
													</div>
												</div>
												<div>
													<Label className='text-xs text-muted-foreground'>
														Base64 текст
													</Label>
													<div className='text-xs font-mono bg-background rounded p-2 mt-1 truncate'>
														{item.base64Text
															? item.base64Text.substring(0, 50)
															: ''}
														{item.base64Text &&
															item.base64Text.length > 50 &&
															'...'}
													</div>
												</div>
											</div>
										</div>
										<Button
											size='sm'
											variant='ghost'
											onClick={e => {
												e.stopPropagation()
												loadFromHistory(item)
											}}
										>
											<Copy className='w-4 h-4' />
										</Button>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	)
}
