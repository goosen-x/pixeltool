'use client'

import { useState, useCallback } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { useTranslations } from 'next-intl' // Removed
import {
	Copy,
	Download,
	Code,
	FileCode,
	AlertCircle,
	CheckCircle2
} from 'lucide-react'
import { toast } from 'sonner'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { WidgetWrapper } from '@/components/tools/WidgetWrapper'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type ParseMode = 'format' | 'minify' | 'validate' | 'extract'

interface ParseResult {
	output: string
	isValid: boolean
	errors: string[]
	stats?: {
		elements: number
		attributes: number
		textNodes: number
		comments: number
	}
}

export default function HtmlXmlParserPage() {
	// const t = useTranslations('widgets.htmlXmlParser') // Removed
	const [input, setInput] = useState('')
	const [result, setResult] = useState<ParseResult | null>(null)
	const [mode, setMode] = useState<ParseMode>('format')
	const [indentSize, setIndentSize] = useState(2)
	const [preserveComments, setPreserveComments] = useState(true)
	const [isProcessing, setIsProcessing] = useState(false)

	const detectType = (content: string): 'html' | 'xml' => {
		const trimmed = content.trim()
		if (trimmed.startsWith('<?xml')) return 'xml'
		if (trimmed.toLowerCase().includes('<!doctype html')) return 'html'
		if (trimmed.includes('<html')) return 'html'
		return 'xml'
	}

	const parseAndValidate = (
		content: string
	): { doc: Document | null; errors: string[] } => {
		const errors: string[] = []
		const parser = new DOMParser()

		try {
			const type = detectType(content)
			const mimeType = type === 'html' ? 'text/html' : 'text/xml'
			const doc = parser.parseFromString(content, mimeType)

			// Check for parsing errors
			const parserError = doc.querySelector('parsererror')
			if (parserError) {
				errors.push(parserError.textContent || 'Unknown parsing error')
				return { doc: null, errors }
			}

			return { doc, errors }
		} catch (error) {
			errors.push(error instanceof Error ? error.message : 'Unknown error')
			return { doc: null, errors }
		}
	}

	const formatDocument = (doc: Document, indent: number = 2): string => {
		const serialize = (node: Node, level: number = 0): string => {
			const spaces = ' '.repeat(level * indent)

			if (node.nodeType === Node.TEXT_NODE) {
				const text = node.textContent?.trim()
				return text ? `${spaces}${text}` : ''
			}

			if (node.nodeType === Node.COMMENT_NODE) {
				return preserveComments ? `${spaces}<!--${node.textContent}-->` : ''
			}

			if (node.nodeType === Node.ELEMENT_NODE) {
				const element = node as Element
				const tagName = element.tagName.toLowerCase()
				const attributes = Array.from(element.attributes)
					.map(attr => ` ${attr.name}="${attr.value}"`)
					.join('')

				const children = Array.from(node.childNodes)
					.map(child => serialize(child, level + 1))
					.filter(s => s)
					.join('\n')

				if (children) {
					return `${spaces}<${tagName}${attributes}>\n${children}\n${spaces}</${tagName}>`
				} else {
					return `${spaces}<${tagName}${attributes} />`
				}
			}

			return ''
		}

		return serialize(doc.documentElement)
	}

	const minifyDocument = (content: string): string => {
		return content
			.replace(/\s+/g, ' ')
			.replace(/>\s+</g, '><')
			.replace(/\s+\/>/g, '/>')
			.trim()
	}

	const extractData = (doc: Document): string => {
		const extract = (node: Node, path: string = ''): string[] => {
			const results: string[] = []

			if (node.nodeType === Node.ELEMENT_NODE) {
				const element = node as Element
				const currentPath = path
					? `${path} > ${element.tagName}`
					: element.tagName

				// Extract attributes
				if (element.attributes.length > 0) {
					const attrs = Array.from(element.attributes)
						.map(attr => `${attr.name}="${attr.value}"`)
						.join(' ')
					results.push(`${currentPath}: ${attrs}`)
				}

				// Extract text content
				const textContent = Array.from(element.childNodes)
					.filter(n => n.nodeType === Node.TEXT_NODE)
					.map(n => n.textContent?.trim())
					.filter(t => t)
					.join(' ')

				if (textContent) {
					results.push(`${currentPath}: "${textContent}"`)
				}

				// Process children
				Array.from(element.childNodes).forEach(child => {
					results.push(...extract(child, currentPath))
				})
			}

			return results
		}

		return extract(doc.documentElement).join('\n')
	}

	const getDocumentStats = (doc: Document) => {
		let elements = 0
		let attributes = 0
		let textNodes = 0
		let comments = 0

		const walk = (node: Node) => {
			if (node.nodeType === Node.ELEMENT_NODE) {
				elements++
				attributes += (node as Element).attributes.length
			} else if (node.nodeType === Node.TEXT_NODE) {
				if (node.textContent?.trim()) textNodes++
			} else if (node.nodeType === Node.COMMENT_NODE) {
				comments++
			}

			Array.from(node.childNodes).forEach(walk)
		}

		walk(doc.documentElement)

		return { elements, attributes, textNodes, comments }
	}

	const processInput = useCallback(() => {
		if (!input.trim()) {
			toast.error('Введите HTML или XML код')
			return
		}

		setIsProcessing(true)

		try {
			const { doc, errors } = parseAndValidate(input)

			if (!doc || errors.length > 0) {
				setResult({
					output: '',
					isValid: false,
					errors
				})
				setIsProcessing(false)
				return
			}

			let output = ''

			switch (mode) {
				case 'format':
					output = formatDocument(doc, indentSize)
					break
				case 'minify':
					output = minifyDocument(input)
					break
				case 'validate':
					output = 'Документ валиден'
					break
				case 'extract':
					output = extractData(doc)
					break
			}

			setResult({
				output,
				isValid: true,
				errors: [],
				stats: getDocumentStats(doc)
			})
		} catch (error) {
			setResult({
				output: '',
				isValid: false,
				errors: [error instanceof Error ? error.message : 'Unknown error']
			})
		} finally {
			setIsProcessing(false)
		}
	}, [input, mode, indentSize, preserveComments])

	const handleCopy = useCallback(() => {
		if (!result?.output) return
		navigator.clipboard.writeText(result.output)
		toast.success('Скопировано в буфер обмена')
	}, [result])

	const handleDownload = useCallback(() => {
		if (!result?.output) return
		const blob = new Blob([result.output], { type: 'text/plain' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `parsed-${mode}.${detectType(input)}`
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		URL.revokeObjectURL(url)
		toast.success('Файл загружен')
	}, [result, mode, input])

	return (
		<WidgetWrapper>
			<div className='grid gap-6 lg:grid-cols-2'>
				<Card>
					<CardHeader>
						<CardTitle>Ввод</CardTitle>
					</CardHeader>
					<CardContent>
						<Textarea
							value={input}
							onChange={e => setInput(e.target.value)}
							placeholder='Вставьте HTML или XML код здесь...'
							className='min-h-[400px] font-mono text-sm'
						/>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className='flex items-center justify-between'>
							Результат
							{result && (
								<span
									className={cn(
										'text-sm font-normal flex items-center gap-1',
										result.isValid ? 'text-green-600' : 'text-red-600'
									)}
								>
									{result.isValid ? (
										<>
											<CheckCircle2 className='w-4 h-4' />
											Валидный
										</>
									) : (
										<>
											<AlertCircle className='w-4 h-4' />
											Невалидный
										</>
									)}
								</span>
							)}
						</CardTitle>
					</CardHeader>
					<CardContent>
						{result?.errors.length ? (
							<div className='mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg'>
								<p className='font-medium text-red-600 dark:text-red-400 mb-2'>
									Ошибки:
								</p>
								<ul className='list-disc list-inside space-y-1'>
									{result.errors.map((error, index) => (
										<li
											key={index}
											className='text-sm text-red-600 dark:text-red-400'
										>
											{error}
										</li>
									))}
								</ul>
							</div>
						) : null}

						<Textarea
							value={result?.output || ''}
							readOnly
							placeholder='Результат обработки появится здесь'
							className='min-h-[400px] font-mono text-sm'
						/>

						{result?.stats && (
							<div className='mt-4 grid grid-cols-2 gap-2 text-sm'>
								<div className='flex justify-between p-2 bg-muted rounded'>
									<span>Элементы:</span>
									<span className='font-mono'>{result.stats.elements}</span>
								</div>
								<div className='flex justify-between p-2 bg-muted rounded'>
									<span>Атрибуты:</span>
									<span className='font-mono'>{result.stats.attributes}</span>
								</div>
								<div className='flex justify-between p-2 bg-muted rounded'>
									<span>Текстовые узлы:</span>
									<span className='font-mono'>{result.stats.textNodes}</span>
								</div>
								<div className='flex justify-between p-2 bg-muted rounded'>
									<span>Комментарии:</span>
									<span className='font-mono'>{result.stats.comments}</span>
								</div>
							</div>
						)}

						<div className='mt-4 flex gap-2'>
							<Button
								onClick={handleCopy}
								variant='outline'
								className='flex-1'
								disabled={!result?.output}
							>
								<Copy className='w-4 h-4 mr-2' />
								Копировать
							</Button>
							<Button
								onClick={handleDownload}
								variant='outline'
								className='flex-1'
								disabled={!result?.output}
							>
								<Download className='w-4 h-4 mr-2' />
								Скачать
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Настройки</CardTitle>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div>
						<Label htmlFor='mode'>Режим</Label>
						<Select
							value={mode}
							onValueChange={value => setMode(value as ParseMode)}
						>
							<SelectTrigger id='mode'>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='format'>
									<div className='flex items-center gap-2'>
										<Code className='w-4 h-4' />
										Форматирование
									</div>
								</SelectItem>
								<SelectItem value='minify'>
									<div className='flex items-center gap-2'>
										<FileCode className='w-4 h-4' />
										Минификация
									</div>
								</SelectItem>
								<SelectItem value='validate'>
									<div className='flex items-center gap-2'>
										<CheckCircle2 className='w-4 h-4' />
										Валидация
									</div>
								</SelectItem>
								<SelectItem value='extract'>
									<div className='flex items-center gap-2'>
										<AlertCircle className='w-4 h-4' />
										Извлечение данных
									</div>
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{mode === 'format' && (
						<>
							<div>
								<Label htmlFor='indent'>Размер отступа</Label>
								<Select
									value={indentSize.toString()}
									onValueChange={value => setIndentSize(parseInt(value))}
								>
									<SelectTrigger id='indent'>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='2'>2 пробелов</SelectItem>
										<SelectItem value='4'>4 пробелов</SelectItem>
										<SelectItem value='8'>8 пробелов</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className='flex items-center space-x-2'>
								<Switch
									id='comments'
									checked={preserveComments}
									onCheckedChange={setPreserveComments}
								/>
								<Label htmlFor='comments'>Сохранять комментарии</Label>
							</div>
						</>
					)}

					<Button
						onClick={processInput}
						className='w-full'
						size='lg'
						disabled={!input || isProcessing}
					>
						{isProcessing ? 'Обработка...' : 'Обработать'}
					</Button>
				</CardContent>
			</Card>
		</WidgetWrapper>
	)
}
