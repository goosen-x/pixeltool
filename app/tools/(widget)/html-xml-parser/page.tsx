'use client'

import { useState, useCallback, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { HtmlXmlParserSeo } from './HtmlXmlParserSeo'
import {
	Copy,
	Check,
	Download,
	Trash2,
	AlertCircle,
	CheckCircle2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill,
	toolToggleOption,
	toolToggleTrack
} from '@/lib/ui/tool-pill'

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
	const [copied, setCopied] = useState(false)

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
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
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
	}, [result, minify, input])

	return (
		<>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: режим и действия. Тумблеры-переключатели
				    заменены таблетками, выпадающий список отступа — тремя
				    значениями подряд. */}
				<div className={toolBar}>
					<div className={toolToggleTrack}>
						<button
							type='button'
							onClick={() => setMinify(false)}
							aria-pressed={!minify}
							className={toolToggleOption(!minify)}
						>
							Форматировать
						</button>
						<button
							type='button'
							onClick={() => setMinify(true)}
							aria-pressed={minify}
							className={toolToggleOption(minify)}
						>
							Минифицировать
						</button>
					</div>

					{result && (
						<span
							className={cn(
								'flex items-center gap-1.5 text-sm',
								result.isValid
									? 'text-green-600 dark:text-green-400'
									: 'text-destructive'
							)}
						>
							{result.isValid ? (
								<CheckCircle2 className='h-4 w-4' />
							) : (
								<AlertCircle className='h-4 w-4' />
							)}
							{result.isValid ? 'разметка валидна' : 'есть ошибки'}
						</span>
					)}

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<button
							type='button'
							onClick={() => setInput(EXAMPLE_HTML)}
							className={toolPill(false)}
						>
							Пример
						</button>
						<Button
							size='icon'
							variant='ghost'
							onClick={handleCopy}
							disabled={!result?.output}
							title='Скопировать результат'
							className={toolIconButton}
						>
							{copied ? (
								<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
							) : (
								<Copy className='h-4 w-4' />
							)}
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={handleDownload}
							disabled={!result?.output}
							title='Скачать файлом'
							className={toolIconButton}
						>
							<Download className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => setInput('')}
							disabled={!input}
							title='Очистить'
							className={toolIconButton}
						>
							<Trash2 className='h-4 w-4' />
						</Button>
					</div>
				</div>

				<div className='grid lg:grid-cols-2'>
					<Textarea
						value={input}
						onChange={e => setInput(e.target.value)}
						placeholder='Вставьте HTML или XML'
						spellCheck={false}
						aria-label='Исходный код'
						className='min-h-[24rem] resize-none rounded-none border-0 px-5 py-6 font-mono text-base focus-visible:ring-0 sm:px-6 md:text-sm lg:border-r'
					/>

					{result?.errors.length ? (
						<div className='min-h-[24rem] px-5 py-6 sm:px-6'>
							<ul className='space-y-1'>
								{result.errors.map((error, index) => (
									<li key={index} className='text-sm text-destructive'>
										{error}
									</li>
								))}
							</ul>
						</div>
					) : (
						<Textarea
							value={result?.output || ''}
							readOnly
							placeholder='Результат появится здесь'
							spellCheck={false}
							aria-label='Результат'
							className='min-h-[24rem] resize-none rounded-none border-0 bg-muted/20 px-5 py-6 font-mono text-base focus-visible:ring-0 md:text-sm'
						/>
					)}
				</div>

				{/* Полоса параметров форматирования: в режиме минификации отступ и
				    комментарии ни на что не влияют, поэтому их там нет. */}
				<div className={toolFooterBar}>
					{!minify && (
						<>
							<div className='flex flex-wrap items-center gap-1.5'>
								<span className='mr-1 text-sm text-muted-foreground'>
									Отступ
								</span>
								{[2, 4, 8].map(size => (
									<button
										key={size}
										type='button'
										onClick={() => setIndentSize(size)}
										aria-pressed={indentSize === size}
										className={toolPill(indentSize === size, 'font-mono')}
									>
										{size}
									</button>
								))}
							</div>

							<button
								type='button'
								onClick={() => setPreserveComments(!preserveComments)}
								aria-pressed={preserveComments}
								className={toolPill(preserveComments)}
							>
								сохранять комментарии
							</button>
						</>
					)}

					{result?.stats && (
						<span className='flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground sm:ml-auto'>
							<span>
								элементов{' '}
								<span className='font-mono text-foreground'>
									{result.stats.elements}
								</span>
							</span>
							<span>
								атрибутов{' '}
								<span className='font-mono text-foreground'>
									{result.stats.attributes}
								</span>
							</span>
							<span>
								текстовых узлов{' '}
								<span className='font-mono text-foreground'>
									{result.stats.textNodes}
								</span>
							</span>
							<span>
								комментариев{' '}
								<span className='font-mono text-foreground'>
									{result.stats.comments}
								</span>
							</span>
						</span>
					)}
				</div>
			</Card>

			<HtmlXmlParserSeo />
		</>
	)
}
