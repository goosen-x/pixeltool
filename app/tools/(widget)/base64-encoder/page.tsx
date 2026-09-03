'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
	ArrowLeftRight,
	Check,
	Copy,
	Download,
	AlertCircle,
	RotateCcw
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { toolIconButton } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { Base64EncoderSeo } from './Base64EncoderSeo'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'

type Field = 'plain' | 'base64'

interface HistoryItem {
	id: string
	plainText: string
	base64Text: string
	timestamp: number
}

const EXAMPLES = [
	{ label: 'Текст', value: 'Hello, World!' },
	{ label: 'JSON', value: '{"name": "John", "age": 30}' },
	{ label: 'HTML', value: '<h1>Hello World</h1>' },
	{ label: 'Эмодзи', value: '🚀 Ready to launch!' }
]

const HISTORY_KEY = 'base64-history'
const HISTORY_LIMIT = 8

const formatBytes = (bytes: number) => {
	if (bytes === 0) return '0 B'
	const units = ['B', 'KB', 'MB']
	const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), 2)
	return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(1))} ${units[i]}`
}

const sizeOf = (text: string) => new Blob([text]).size

export default function Base64EncoderPage() {
	const widget = getWidgetById('base64-encoder')!

	const [plainText, setPlainText] = useState('')
	const [base64Text, setBase64Text] = useState('')
	const [urlSafe, setUrlSafe] = useState(false)
	const [lineBreaks, setLineBreaks] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [copied, setCopied] = useState<Field | null>(null)
	const [history, setHistory] = useState<HistoryItem[]>([])
	const [lastEdited, setLastEdited] = useState<Field>('plain')

	const encode = useCallback(
		(text: string) => {
			if (!text) return ''
			try {
				let result = btoa(unescape(encodeURIComponent(text)))
				if (urlSafe) {
					result = result
						.replace(/\+/g, '-')
						.replace(/\//g, '_')
						.replace(/=+$/, '')
				}
				if (lineBreaks) {
					result = result.match(/.{1,76}/g)?.join('\n') || result
				}
				return result
			} catch {
				return ''
			}
		},
		[urlSafe, lineBreaks]
	)

	const decode = useCallback(
		(value: string): { result: string; error: string | null } => {
			if (!value.trim()) return { result: '', error: null }

			let text = value.replace(/\s/g, '')
			if (urlSafe) {
				text = text.replace(/-/g, '+').replace(/_/g, '/')
				const padding = text.length % 4
				if (padding) text += '='.repeat(4 - padding)
			}

			if (!/^[A-Za-z0-9+/]*={0,2}$/.test(text)) {
				return {
					result: '',
					error: 'В строке есть символы не из алфавита Base64'
				}
			}

			try {
				return { result: decodeURIComponent(escape(atob(text))), error: null }
			} catch {
				try {
					return { result: atob(text), error: null }
				} catch {
					return { result: '', error: 'Строка обрывается — длина не кратна 4' }
				}
			}
		},
		[urlSafe]
	)

	// Пересчёт в ту сторону, куда пользователь печатал последней
	useEffect(() => {
		const timer = setTimeout(() => {
			if (lastEdited === 'plain') {
				setBase64Text(encode(plainText))
				setError(null)
			} else {
				const { result, error: decodeError } = decode(base64Text)
				setPlainText(result)
				setError(decodeError)
			}
		}, 250)
		return () => clearTimeout(timer)
	}, [plainText, base64Text, lastEdited, encode, decode])

	useEffect(() => {
		const saved = localStorage.getItem(HISTORY_KEY)
		if (!saved) return
		try {
			setHistory(JSON.parse(saved))
		} catch {
			localStorage.removeItem(HISTORY_KEY)
		}
	}, [])

	// История пишется по паузе в наборе, а не по кнопке: раньше в неё попадали
	// только клики по готовым примерам, и собственные преобразования
	// пользователя не сохранялись вообще.
	const lastSaved = useRef('')
	useEffect(() => {
		if (!plainText || !base64Text || error) return
		if (lastSaved.current === base64Text) return

		const timer = setTimeout(() => {
			lastSaved.current = base64Text
			setHistory(prev => {
				const next = [
					{
						id: `${Date.now()}`,
						plainText,
						base64Text,
						timestamp: Date.now()
					},
					...prev.filter(item => item.base64Text !== base64Text)
				].slice(0, HISTORY_LIMIT)
				localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
				return next
			})
		}, 1200)
		return () => clearTimeout(timer)
	}, [plainText, base64Text, error])

	const copy = async (field: Field) => {
		const text = field === 'plain' ? plainText : base64Text
		if (!text) return
		await navigator.clipboard.writeText(text)
		setCopied(field)
		setTimeout(() => setCopied(null), 1600)
	}

	const download = (field: Field) => {
		const text = field === 'plain' ? plainText : base64Text
		if (!text) return
		const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }))
		const link = document.createElement('a')
		link.href = url
		link.download = `${field === 'plain' ? 'text' : 'base64'}-${Date.now()}.txt`
		link.click()
		URL.revokeObjectURL(url)
	}

	const reset = () => {
		setPlainText('')
		setBase64Text('')
		setError(null)
		lastSaved.current = ''
	}

	const clearHistory = () => {
		setHistory([])
		localStorage.removeItem(HISTORY_KEY)
		toast.success('История очищена')
	}

	const plainSize = sizeOf(plainText)
	const base64Size = sizeOf(base64Text)
	const delta =
		plainSize && base64Size
			? Math.round((base64Size / plainSize - 1) * 100)
			: null

	// Оба поля редактируемые: печатаете слева — получаете Base64 справа, вставили
	// Base64 справа — слева появится расшифровка. Отдельных кнопок «Кодировать» и
	// «Декодировать» поэтому нет.
	const panes: { field: Field; title: string; hint: string }[] = [
		{ field: 'plain', title: 'Текст', hint: 'Введите или вставьте текст' },
		{ field: 'base64', title: 'Base64', hint: 'Или вставьте Base64 сюда' }
	]

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: примеры и два переключателя формата. Раньше это
				    была отдельная карточка со своим заголовком «Быстрые примеры» —
				    полстраницы уходило на подпись к четырём кнопкам. */}
				<div className='flex flex-wrap items-center gap-x-6 gap-y-3 border-b bg-muted/30 px-5 py-3 sm:px-6'>
					<div className='flex flex-wrap items-center gap-1.5'>
						{EXAMPLES.map(example => (
							<button
								key={example.label}
								type='button'
								onClick={() => {
									setPlainText(example.value)
									setLastEdited('plain')
								}}
								className='cursor-pointer rounded-full px-2.5 py-1 text-sm text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
							>
								{example.label}
							</button>
						))}
					</div>

					<div className='flex flex-wrap items-center gap-1.5 sm:ml-auto'>
						{[
							{
								active: urlSafe,
								toggle: () => setUrlSafe(v => !v),
								label: 'URL-безопасный',
								title: 'Заменяет + и / на - и _, убирает = на конце'
							},
							{
								active: lineBreaks,
								toggle: () => setLineBreaks(v => !v),
								label: 'Перенос строк',
								title: 'Разбивает результат по 76 символов'
							}
						].map(option => (
							<button
								key={option.label}
								type='button'
								onClick={option.toggle}
								title={option.title}
								aria-pressed={option.active}
								className={cn(
									'cursor-pointer rounded-full border px-3 py-1 text-sm transition-colors',
									'hover:border-primary/50 hover:bg-background',
									'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
									option.active
										? 'border-primary bg-primary/10 text-primary'
										: 'border-transparent text-muted-foreground'
								)}
							>
								{option.label}
							</button>
						))}
					</div>
				</div>

				{/* Две панели в одной карточке, разделённые линией: раньше это были
				    две самостоятельные карточки, и между ними висел зазор, из-за
				    которого пара читалась как два несвязанных инструмента. */}
				<div className='relative grid md:grid-cols-2'>
					{panes.map((pane, index) => {
						const isPlain = pane.field === 'plain'
						const value = isPlain ? plainText : base64Text
						const size = isPlain ? plainSize : base64Size
						const hasError = !isPlain && Boolean(error)

						return (
							<div
								key={pane.field}
								className={cn(
									'group/pane flex min-w-0 flex-col',
									index === 0 && 'md:border-r',
									index === 1 && 'border-t md:border-t-0'
								)}
							>
								<div className='flex items-center justify-between gap-2 px-5 pt-5 sm:px-6'>
									<span
										className={cn(
											'text-sm font-medium',
											hasError && 'text-destructive'
										)}
									>
										{pane.title}
									</span>

									<div
										className={cn(
											'flex items-center gap-0.5 transition-opacity',
											value ? 'opacity-100' : 'pointer-events-none opacity-0'
										)}
									>
										<Button
											size='icon'
											variant='ghost'
											onClick={() => copy(pane.field)}
											title='Скопировать'
											className={toolIconButton}
										>
											{copied === pane.field ? (
												<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
											) : (
												<Copy className='h-4 w-4' />
											)}
										</Button>
										<Button
											size='icon'
											variant='ghost'
											onClick={() => download(pane.field)}
											title='Скачать файлом'
											className={toolIconButton}
										>
											<Download className='h-4 w-4' />
										</Button>
									</div>
								</div>

								<textarea
									value={value}
									onChange={event => {
										if (isPlain) setPlainText(event.target.value)
										else setBase64Text(event.target.value)
										setLastEdited(pane.field)
									}}
									spellCheck={false}
									placeholder={pane.hint}
									className={cn(
										'min-h-[16rem] w-full flex-1 resize-none bg-transparent px-5 py-4 font-mono text-sm leading-relaxed sm:px-6',
										'placeholder:font-sans placeholder:text-muted-foreground/60',
										'focus:outline-none'
									)}
								/>

								<div className='flex min-h-[2.75rem] items-center gap-2 px-5 pb-4 text-xs text-muted-foreground sm:px-6'>
									{hasError ? (
										<span className='flex items-center gap-1.5 text-destructive'>
											<AlertCircle className='h-3.5 w-3.5 shrink-0' />
											{error}
										</span>
									) : (
										value && (
											<>
												<span>{formatBytes(size)}</span>
												{!isPlain && delta !== null && (
													<span className='text-muted-foreground/70'>
														{delta > 0 ? '+' : ''}
														{delta}% к исходному
													</span>
												)}
											</>
										)
									)}
								</div>
							</div>
						)
					})}

					{/* Значок на стыке панелей — не кнопка, а подсказка: показывает, что
					    поля связаны и работают в обе стороны. Кликабельным его делать
					    нельзя, иначе он читается как «поменять местами», а менять тут
					    нечего — печатать можно в любом поле. */}
					<span
						aria-hidden
						className='pointer-events-none absolute left-1/2 top-1/2 hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-background text-muted-foreground/70 shadow-sm md:flex'
					>
						<ArrowLeftRight className='h-4 w-4' />
					</span>
				</div>

				{(plainText || base64Text || history.length > 0) && (
					<div className='flex flex-wrap items-center gap-x-4 gap-y-2 border-t px-5 py-3 sm:px-6'>
						{(plainText || base64Text) && (
							<button
								type='button'
								onClick={reset}
								className='flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
							>
								<RotateCcw className='h-3.5 w-3.5' />
								Очистить поля
							</button>
						)}

						{history.length > 0 && (
							<button
								type='button'
								onClick={clearHistory}
								className='cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:ml-auto'
							>
								Забыть историю ({history.length})
							</button>
						)}
					</div>
				)}
			</Card>

			{/* История — тихий список под инструментом, а не вторая карточка с
			    заголовком и таблицей на два столбца */}
			{history.length > 0 && (
				<div className='mt-6'>
					<p className='px-1 text-sm text-muted-foreground'>Недавнее</p>
					<div className='mt-2 divide-y rounded-xl border'>
						{history.map(item => (
							<button
								key={item.id}
								type='button'
								onClick={() => {
									setPlainText(item.plainText)
									setBase64Text(item.base64Text)
									setLastEdited('plain')
									setError(null)
								}}
								className='flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset'
							>
								<span className='min-w-0 flex-1 truncate font-mono text-sm'>
									{item.plainText}
								</span>
								<span className='hidden min-w-0 flex-1 truncate font-mono text-sm text-muted-foreground sm:block'>
									{item.base64Text}
								</span>
								<span className='shrink-0 text-xs text-muted-foreground/70'>
									{new Date(item.timestamp).toLocaleTimeString('ru-RU', {
										hour: '2-digit',
										minute: '2-digit'
									})}
								</span>
							</button>
						))}
					</div>
				</div>
			)}

			<ToolScreenshot slug='base64-encoder' />
			<Base64EncoderSeo />
		</WidgetSEOWrapper>
	)
}
