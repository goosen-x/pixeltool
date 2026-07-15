'use client'

import { useState, useCallback, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { HtmlXmlParserSeo } from './HtmlXmlParserSeo'
import { Copy, Download, AlertCircle, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

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

// Нарочно в одну строку — чтобы форматирование сразу показало результат.
const EXAMPLE_HTML =
	'<article class="card"><header><h2>Заголовок статьи</h2><span class="tag">новости</span></header><p>Короткий текст со <a href="/news">ссылкой</a> внутри.</p><!-- список пунктов --><ul><li>Первый пункт</li><li>Второй пункт</li></ul></article>'

export default function HtmlXmlParserPage() {
	const [input, setInput] = useState('')
	const [result, setResult] = useState<ParseResult | null>(null)
	const [minify, setMinify] = useState(false)
	const [indentSize, setIndentSize] = useState(2)
	const [preserveComments, setPreserveComments] = useState(true)

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
			setResult(null)
			return
		}

		try {
			const { doc, errors } = parseAndValidate(input)

			if (!doc || errors.length > 0) {
				setResult({
					output: '',
					isValid: false,
					errors
				})
				return
			}

			const output = minify
				? minifyDocument(input)
				: formatDocument(doc, indentSize)

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
		}
	}, [input, minify, indentSize, preserveComments])

	// Живой результат: обрабатываем сам по вводу и смене настроек, с дебаунсом,
	// чтобы разбор не дёргался на каждое нажатие клавиши.
	useEffect(() => {
		const timer = setTimeout(processInput, 300)
		return () => clearTimeout(timer)
	}, [processInput])

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
		a.download = `${minify ? 'minified' : 'formatted'}.${detectType(input)}`
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		URL.revokeObjectURL(url)
		toast.success('Файл загружен')
	}, [result, minify, input])

	return (
		<>
			<Card>
				<CardContent className='space-y-4 pt-6'>
					{/* Форматтер: по умолчанию — читаемый вид с отступами, тумблер
					    переключает на минификацию. Настройки отступа и комментариев
					    нужны только в режиме форматирования. */}
					<div className='flex flex-wrap items-center gap-x-6 gap-y-3'>
						<div className='flex items-center gap-2'>
							<Switch
								id='minify'
								checked={minify}
								onCheckedChange={setMinify}
								className='cursor-pointer'
							/>
							<Label htmlFor='minify' className='cursor-pointer text-sm'>
								Минифицировать
							</Label>
						</div>

						{!minify && (
							<>
								<div className='flex items-center gap-2'>
									<Label
										htmlFor='indent'
										className='text-sm text-muted-foreground'
									>
										Отступ
									</Label>
									<Select
										value={indentSize.toString()}
										onValueChange={value => setIndentSize(parseInt(value))}
									>
										<SelectTrigger id='indent' className='w-32 cursor-pointer'>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='2'>2 пробела</SelectItem>
											<SelectItem value='4'>4 пробела</SelectItem>
											<SelectItem value='8'>8 пробелов</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className='flex items-center gap-2'>
									<Switch
										id='comments'
										checked={preserveComments}
										onCheckedChange={setPreserveComments}
										className='cursor-pointer'
									/>
									<Label
										htmlFor='comments'
										className='cursor-pointer text-sm text-muted-foreground'
									>
										Сохранять комментарии
									</Label>
								</div>
							</>
						)}
					</div>

					{/* Ввод и результат — рядом, в одной карточке */}
					<div className='grid gap-4 lg:grid-cols-2'>
						<div className='space-y-2'>
							<div className='flex h-7 items-center justify-between gap-2'>
								<span className='text-sm font-medium'>Ввод</span>
								<Button
									variant='ghost'
									size='sm'
									className='h-7 cursor-pointer px-2'
									onClick={() => setInput(EXAMPLE_HTML)}
								>
									Пример
								</Button>
							</div>
							<Textarea
								value={input}
								onChange={e => setInput(e.target.value)}
								placeholder='Вставьте HTML или XML код здесь...'
								className='min-h-[420px] resize-none font-mono text-sm'
								spellCheck={false}
							/>
						</div>

						<div className='space-y-2'>
							<div className='flex h-7 items-center justify-between gap-2'>
								<div className='flex items-center gap-3'>
									<span className='text-sm font-medium'>Результат</span>
									{result && (
										<span
											className={cn(
												'flex items-center gap-1 text-xs font-medium',
												result.isValid ? 'text-green-600' : 'text-red-600'
											)}
										>
											{result.isValid ? (
												<>
													<CheckCircle2 className='h-3.5 w-3.5' />
													Валидный
												</>
											) : (
												<>
													<AlertCircle className='h-3.5 w-3.5' />
													Невалидный
												</>
											)}
										</span>
									)}
								</div>
								<div className='flex items-center gap-1'>
									<Button
										onClick={handleCopy}
										variant='ghost'
										size='sm'
										className='h-7 cursor-pointer px-2'
										disabled={!result?.output}
									>
										<Copy className='mr-1.5 h-3.5 w-3.5' />
										Копировать
									</Button>
									<Button
										onClick={handleDownload}
										variant='ghost'
										size='sm'
										className='h-7 cursor-pointer px-2'
										disabled={!result?.output}
									>
										<Download className='mr-1.5 h-3.5 w-3.5' />
										Скачать
									</Button>
								</div>
							</div>

							{result?.errors.length ? (
								<div className='rounded-lg bg-red-50 p-4 dark:bg-red-900/20'>
									<p className='mb-2 font-medium text-red-600 dark:text-red-400'>
										Ошибки:
									</p>
									<ul className='list-inside list-disc space-y-1'>
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
							) : (
								<Textarea
									value={result?.output || ''}
									readOnly
									placeholder='Результат появится здесь автоматически'
									className='min-h-[420px] resize-none bg-muted/30 font-mono text-sm'
									spellCheck={false}
								/>
							)}

							{result?.stats && (
								<div className='grid grid-cols-2 gap-2 text-sm'>
									<div className='flex justify-between rounded bg-muted p-2'>
										<span className='text-muted-foreground'>Элементы</span>
										<span className='font-mono'>{result.stats.elements}</span>
									</div>
									<div className='flex justify-between rounded bg-muted p-2'>
										<span className='text-muted-foreground'>Атрибуты</span>
										<span className='font-mono'>{result.stats.attributes}</span>
									</div>
									<div className='flex justify-between rounded bg-muted p-2'>
										<span className='text-muted-foreground'>Текст. узлы</span>
										<span className='font-mono'>{result.stats.textNodes}</span>
									</div>
									<div className='flex justify-between rounded bg-muted p-2'>
										<span className='text-muted-foreground'>Комментарии</span>
										<span className='font-mono'>{result.stats.comments}</span>
									</div>
								</div>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
			<HtmlXmlParserSeo />
		</>
	)
}
