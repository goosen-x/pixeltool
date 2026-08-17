'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Check, Upload, Lightbulb, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolToggleOption,
	toolToggleTrack
} from '@/lib/ui/tool-pill'
import { SvgEncoderSeo } from './SvgEncoderSeo'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'

export default function SVGEncoderPage() {
	const widget = getWidgetById('svg-encoder')!
	const [svgInput, setSvgInput] = useState('')
	const [encodedResult, setEncodedResult] = useState('')
	const [cssResult, setCssResult] = useState('')
	const [tailwindResult, setTailwindResult] = useState('')
	const [quotes, setQuotes] = useState<'single' | 'double'>('double')
	const [backgroundColor, setBackgroundColor] = useState('white')
	const [copiedField, setCopiedField] = useState<string | null>(null)
	const [isDragging, setIsDragging] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const exampleSvg = `<svg>
  <circle r="50" cx="50" cy="50" fill="tomato"/>
  <circle r="41" cx="47" cy="50" fill="orange"/>
  <circle r="33" cx="48" cy="53" fill="gold"/>
  <circle r="25" cx="49" cy="51" fill="yellowgreen"/>
  <circle r="17" cx="52" cy="50" fill="lightseagreen"/>
  <circle r="9" cx="55" cy="48" fill="teal"/>
</svg>`

	const symbols = /[\r\n%#()<>?[\\\]^`{|}]/g

	const getQuotesConfig = () => {
		const double = '"'
		const single = "'"
		return {
			level1: quotes === 'double' ? double : single,
			level2: quotes === 'double' ? single : double
		}
	}

	const addNameSpace = (data: string) => {
		const quotesConfig = getQuotesConfig()
		if (data.indexOf('http://www.w3.org/2000/svg') < 0) {
			data = data.replace(
				/<svg/g,
				`<svg xmlns=${quotesConfig.level2}http://www.w3.org/2000/svg${quotesConfig.level2}`
			)
		}
		return data
	}

	const encodeSVG = (data: string, forceQuotes?: 'single' | 'double') => {
		const quotesToUse = forceQuotes || quotes

		// Use single quotes instead of double to avoid encoding
		if (quotesToUse === 'double') {
			data = data.replace(/"/g, "'")
		} else {
			data = data.replace(/'/g, '"')
		}

		data = data.replace(/>\s{1,}</g, '><')
		data = data.replace(/\s{2,}/g, ' ')

		return data.replace(symbols, encodeURIComponent)
	}

	const getResults = () => {
		if (!svgInput) {
			setEncodedResult('')
			setCssResult('')
			setTailwindResult('')
			return
		}

		const namespaced = addNameSpace(svgInput)
		const encoded = encodeSVG(namespaced)
		const quotesConfig = getQuotesConfig()

		setEncodedResult(encoded)
		const css = `background-image: url(${quotesConfig.level1}data:image/svg+xml,${encoded}${quotesConfig.level1});`
		setCssResult(css)

		// Generate Tailwind result - inline style
		// For Tailwind, we need to ensure double quotes in SVG to avoid conflicts with single quotes in arbitrary value
		const namespacedForTailwind = addNameSpace(svgInput).replace(/'/g, '"')
		const encodedForTailwind = encodeSVG(namespacedForTailwind, 'double')
		const tailwind = `bg-[url('data:image/svg+xml,${encodedForTailwind}')]`
		setTailwindResult(tailwind)
	}

	const handleEncodedChange = (value: string) => {
		const cleaned = value
			.trim()
			.replace(/background-image:\s{0,}url\(/, '')
			.replace(/["']{0,}data:image\/svg\+xml,/, '')
			.replace(/["']\);{0,}$/, '')

		try {
			setSvgInput(decodeURIComponent(cleaned))
		} catch (e) {
			// Invalid encoded value
		}
	}

	const copyToClipboard = async (text: string, field: string) => {
		try {
			await navigator.clipboard.writeText(text)
			setCopiedField(field)
			setTimeout(() => setCopiedField(null), 2000)
		} catch (err) {
			console.error('Не удалось скопировать:', err)
		}
	}

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(true)
	}

	const handleDragLeave = () => {
		setIsDragging(false)
	}

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(false)

		readSvgFile(e.dataTransfer.files[0])
	}

	/** Чтение .svg — общее для перетаскивания и выбора файла кнопкой. */
	const readSvgFile = (file?: File) => {
		if (!file) return

		if (file.type !== 'image/svg+xml' && !file.name.endsWith('.svg')) {
			setSvgInput('')
			return
		}

		const reader = new FileReader()
		reader.onload = event => setSvgInput(event.target?.result as string)
		reader.readAsText(file)
	}

	const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		readSvgFile(event.target.files?.[0])
	}

	useEffect(() => {
		getResults()
	}, [svgInput, quotes])

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: чем заполнить инструмент. */}
				<div className={toolBar}>
					<span className='text-sm text-muted-foreground'>
						{svgInput
							? `${svgInput.length} символов`
							: 'Вставьте SVG или перетащите файл'}
					</span>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='sm'
							variant='ghost'
							onClick={() => setSvgInput(exampleSvg)}
							title='Подставить пример'
							className='cursor-pointer gap-1.5 text-muted-foreground hover:bg-muted hover:text-foreground'
						>
							<Lightbulb className='h-4 w-4' />
							Пример
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => fileInputRef.current?.click()}
							title='Выбрать .svg файл'
							className={toolIconButton}
						>
							<Upload className='h-4 w-4' />
						</Button>
						<input
							ref={fileInputRef}
							type='file'
							accept='.svg,image/svg+xml'
							onChange={handleFileInput}
							className='hidden'
							aria-label='Загрузить SVG-файл'
						/>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => setSvgInput('')}
							disabled={!svgInput}
							title='Очистить'
							className={toolIconButton}
						>
							<Trash2 className='h-4 w-4' />
						</Button>
					</div>
				</div>

				{/* Рабочая область: слева код, справа то, как он выглядит.
				    Перетащить файл можно на всю область целиком. */}
				<div
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					className={cn(
						'grid transition-colors lg:grid-cols-2',
						isDragging && 'bg-primary/5'
					)}
				>
					<textarea
						value={svgInput}
						onChange={e => setSvgInput(e.target.value)}
						aria-label='Код SVG'
						placeholder='<svg>…</svg>'
						spellCheck={false}
						className='min-h-[16rem] resize-none bg-transparent px-5 py-6 font-mono text-sm focus:outline-none sm:px-6 lg:border-r'
					/>

					<div
						className='flex min-h-[16rem] items-center justify-center border-t p-6 lg:border-t-0'
						style={{ backgroundColor }}
					>
						{svgInput ? (
							<div
								className='h-40 w-40'
								style={{
									backgroundImage: cssResult
										? cssResult
												.replace('background-image: ', '')
												.replace(';', '')
										: '',
									backgroundRepeat: 'no-repeat',
									backgroundPosition: 'center',
									backgroundSize: 'contain'
								}}
							/>
						) : (
							<p className='text-sm text-muted-foreground'>
								Здесь появится картинка
							</p>
						)}
					</div>
				</div>

				{/* Полоса настроек: фон предпросмотра и кавычки в результате. */}
				<div className={toolFooterBar}>
					<div className='flex items-center gap-2'>
						<span className='text-sm text-muted-foreground'>Фон</span>
						{[
							{ color: 'white', label: 'Белый', className: 'bg-white' },
							{ color: '#f3f4f6', label: 'Серый', className: 'bg-gray-100' },
							{ color: 'black', label: 'Чёрный', className: 'bg-black' }
						].map(bg => (
							<button
								key={bg.color}
								type='button'
								onClick={() => setBackgroundColor(bg.color)}
								title={bg.label}
								aria-pressed={backgroundColor === bg.color}
								className={cn(
									'h-5 w-5 cursor-pointer rounded-full border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
									bg.className,
									backgroundColor === bg.color &&
										'ring-2 ring-primary ring-offset-1 ring-offset-background'
								)}
							>
								<span className='sr-only'>{bg.label}</span>
							</button>
						))}
					</div>

					{/* Кавычки влияют на CSS и «кодированный», но не на Tailwind:
					    там значение всегда в одинарных, иначе класс развалится. */}
					<div className='flex flex-wrap items-center gap-1.5'>
						<span className='mr-1 text-sm text-muted-foreground'>Кавычки</span>
						<div className={toolToggleTrack}>
							{(
								[
									['double', 'двойные "'],
									['single', "одинарные '"]
								] as ['double' | 'single', string][]
							).map(([value, label]) => (
								<button
									key={value}
									type='button'
									onClick={() => setQuotes(value)}
									aria-pressed={quotes === value}
									className={toolToggleOption(quotes === value)}
								>
									{label}
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Три результата сразу: раньше они лежали под вкладками, и
				    человек, пришедший за Tailwind-классом, сначала видел
				    «кодированный» вариант. */}
				<div className='grid gap-px border-t bg-border'>
					{[
						{
							key: 'encoded',
							title: 'Кодированный SVG',
							hint: 'можно править прямо здесь — пересоберётся вся строка',
							value: encodedResult,
							onChange: handleEncodedChange
						},
						{
							key: 'css',
							title: 'CSS',
							hint: 'готово для background-image',
							value: cssResult
						},
						{
							key: 'tailwind',
							title: 'Tailwind',
							hint: 'произвольное значение в квадратных скобках',
							value: tailwindResult
						}
					].map(pane => (
						<div key={pane.key} className='bg-background px-5 py-4 sm:px-6'>
							<div className='flex items-center justify-between gap-2'>
								<span className='text-sm font-medium'>
									{pane.title}
									<span className='ml-2 text-xs font-normal text-muted-foreground'>
										{pane.hint}
									</span>
								</span>
								<Button
									size='icon'
									variant='ghost'
									onClick={() => copyToClipboard(pane.value, pane.key)}
									disabled={!pane.value}
									title='Скопировать'
									className={toolIconButton}
								>
									{copiedField === pane.key ? (
										<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
									) : (
										<Copy className='h-4 w-4' />
									)}
								</Button>
							</div>

							{pane.onChange ? (
								<textarea
									value={pane.value}
									onChange={e => pane.onChange(e.target.value)}
									aria-label={pane.title}
									placeholder='Появится здесь'
									spellCheck={false}
									className='mt-1 h-20 w-full resize-none bg-transparent font-mono text-xs focus:outline-none'
								/>
							) : (
								<pre className='mt-1 max-h-20 overflow-auto font-mono text-xs break-all whitespace-pre-wrap text-muted-foreground'>
									{pane.value || 'Появится здесь'}
								</pre>
							)}
						</div>
					))}
				</div>
			</Card>

			<SvgEncoderSeo />
		</WidgetSEOWrapper>
	)
}
