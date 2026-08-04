'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
	Copy,
	Check,
	Download,
	Upload,
	AlertCircle,
	Trash2
} from 'lucide-react'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'

interface MinificationResult {
	originalSize: number
	minifiedSize: number
	savings: number
	savingsBytes: number
	minified: string
	errors?: string[]
	warnings?: string[]
	optimizations: string[]
}

const CSS_EXAMPLES = [
	{
		name: 'Стили разметки',
		code: `/* Main Container */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
}

.header {
    background-color: #2c3e50;
    color: white;
    padding: 1rem 2rem;
    border-radius: 8px;
    margin-bottom: 2rem;
}

.header h1 {
    margin: 0;
    font-size: 2.5rem;
    font-weight: 300;
}`
	},
	{
		name: 'Адаптивная сетка',
		code: `/* Grid Layout */
.grid-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    padding: 0px 0px 0px 0px;
}

@media (max-width: 768px) {
    .grid-container {
        grid-template-columns: 1fr;
        gap: 10px;
    }
}

.grid-item {
    background-color: #ffffff;
    border: 1px solid #dddddd;
    border-radius: 8px;
    padding: 20px;
}`
	},
	{
		name: 'Стили кнопок',
		code: `/* Button Components */
.btn-primary {
    background-color: #3498db;
    color: #ffffff;
    border: 0px solid transparent;
    padding: 12px 24px;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-primary:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}`
	}
]

export default function CSSMinifierPage() {
	const [input, setInput] = useState('')
	const [output, setOutput] = useState('')
	const [result, setResult] = useState<MinificationResult | null>(null)
	const [copied, setCopied] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)

	// Options
	const [preserveLineBreaks, setPreserveLineBreaks] = useState(false)
	const [optimizeColors, setOptimizeColors] = useState(true)
	const [optimizeUnits, setOptimizeUnits] = useState(true)
	const [optimizeShorthand, setOptimizeShorthand] = useState(true)

	// Auto-minify with debounce
	const debounceTimer = useRef<NodeJS.Timeout | undefined>(undefined)

	useEffect(() => {
		if (!input.trim()) {
			setOutput('')
			setResult(null)
			return
		}

		// Clear previous timer
		if (debounceTimer.current) {
			clearTimeout(debounceTimer.current)
		}

		// Set new timer for auto-minification
		debounceTimer.current = setTimeout(() => {
			try {
				const minificationResult = minifyCSS(input)
				setResult(minificationResult)
				setOutput(minificationResult.minified)
			} catch (error) {
				console.error('Auto-minification error:', error)
			}
		}, 500)

		// Cleanup
		return () => {
			if (debounceTimer.current) {
				clearTimeout(debounceTimer.current)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		input,
		preserveLineBreaks,
		optimizeColors,
		optimizeUnits,
		optimizeShorthand
	])

	const minifyCSS = (code: string): MinificationResult => {
		let minified = code
		const errors: string[] = []
		const warnings: string[] = []
		const optimizations: string[] = []

		try {
			// Remove comments
			minified = minified.replace(/\/\*[\s\S]*?\*\//g, '')
			optimizations.push('Удалены комментарии')

			// Remove unnecessary whitespace
			if (!preserveLineBreaks) {
				// Collapse multiple spaces
				minified = minified.replace(/\s+/g, ' ')

				// Remove spaces around {, }, ;, :, ,
				minified = minified.replace(/\s*([{}();,:])\s*/g, '$1')

				// Remove space after : in properties
				minified = minified.replace(/:\s*/g, ':')

				optimizations.push('Удалены лишние пробелы')
			}

			// Remove unnecessary semicolons before }
			minified = minified.replace(/;\s*}/g, '}')

			if (optimizeColors) {
				// Optimize HEX colors (#ffffff -> #fff)
				minified = minified.replace(
					/#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3/g,
					'#$1$2$3'
				)

				// Convert rgb(255,255,255) to #fff
				minified = minified.replace(/rgb\(255,255,255\)/gi, '#fff')
				minified = minified.replace(/rgb\(0,0,0\)/gi, '#000')

				optimizations.push('Оптимизированы цвета')
			}

			if (optimizeUnits) {
				// Remove units from 0 values
				minified = minified.replace(/\b0px\b/gi, '0')
				minified = minified.replace(/\b0em\b/gi, '0')
				minified = minified.replace(/\b0rem\b/gi, '0')
				minified = minified.replace(/\b0%\b/g, '0')
				minified = minified.replace(/\b0pt\b/gi, '0')
				minified = minified.replace(/\b0vh\b/gi, '0')
				minified = minified.replace(/\b0vw\b/gi, '0')

				// Optimize decimal values
				minified = minified.replace(/\b0\.(\d+)/g, '.$1')

				optimizations.push('Оптимизированы единицы измерения')
			}

			if (optimizeShorthand) {
				// Optimize margin shorthand
				minified = minified.replace(/margin:\s*0\s+0\s+0\s+0/g, 'margin:0')
				minified = minified.replace(
					/margin:\s*(\d+[a-z]*)\s+\1\s+\1\s+\1/g,
					'margin:$1'
				)

				// Optimize padding shorthand
				minified = minified.replace(/padding:\s*0\s+0\s+0\s+0/g, 'padding:0')
				minified = minified.replace(
					/padding:\s*(\d+[a-z]*)\s+\1\s+\1\s+\1/g,
					'padding:$1'
				)

				// Optimize border shorthand
				minified = minified.replace(/border:\s*0px\s+solid/g, 'border:0')

				// Remove quotes from font names when safe
				minified = minified.replace(
					/font-family:\s*["']([a-zA-Z-]+)["']/g,
					'font-family:$1'
				)

				optimizations.push('Применены сокращённые свойства')
			}

			// Remove empty rules
			minified = minified.replace(/[^{}]+\{\s*\}/g, '')

			// Remove trailing semicolons
			minified = minified.replace(/;}/g, '}')

			// Final trim
			minified = minified.trim()
		} catch (error) {
			errors.push(
				`Ошибка минификации CSS: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`
			)
		}

		const originalSize = new TextEncoder().encode(code).length
		const minifiedSize = new TextEncoder().encode(minified).length
		const savingsBytes = originalSize - minifiedSize
		const savings =
			originalSize > 0 ? Math.round((savingsBytes / originalSize) * 100) : 0

		return {
			originalSize,
			minifiedSize,
			savings: Math.max(0, savings),
			savingsBytes,
			minified,
			errors,
			warnings,
			optimizations
		}
	}

	const formatBytes = (bytes: number): string => {
		if (bytes === 0) return '0 B'
		const k = 1024
		const sizes = ['B', 'KB', 'MB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
	}

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	const downloadCode = () => {
		const blob = new Blob([output], { type: 'text/css' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = 'minified.css'
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		URL.revokeObjectURL(url)
	}

	const loadExample = (example: (typeof CSS_EXAMPLES)[0]) => {
		setInput(example.code)
	}

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = e => {
				const content = e.target?.result as string
				setInput(content)
			}
			reader.readAsText(file)
		}
	}

	const resetAll = () => {
		setInput('')
		setOutput('')
		setResult(null)
		setPreserveLineBreaks(false)
		setOptimizeColors(true)
		setOptimizeUnits(true)
		setOptimizeShorthand(true)
	}

	return (
		<>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: чем заполнить инструмент и что сделать с
				    результатом. Кнопка «Минифицировать» не нужна — сжатие идёт на
				    лету, поэтому её здесь и нет. */}
				<div className={toolBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						<span className='mr-1 text-sm text-muted-foreground'>Пример</span>
						{CSS_EXAMPLES.map(example => (
							<button
								key={example.name}
								type='button'
								onClick={() => loadExample(example)}
								className={toolPill(false)}
							>
								{example.name}
							</button>
						))}
					</div>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => fileInputRef.current?.click()}
							title='Загрузить .css файл'
							className={toolIconButton}
						>
							<Upload className='h-4 w-4' />
						</Button>
						<input
							ref={fileInputRef}
							type='file'
							accept='.css'
							onChange={handleFileUpload}
							className='hidden'
							aria-label='Загрузить CSS-файл'
						/>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => copyToClipboard(output)}
							disabled={!output}
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
							onClick={downloadCode}
							disabled={!output}
							title='Скачать minified.css'
							className={toolIconButton}
						>
							<Download className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={resetAll}
							disabled={!input.trim()}
							title='Очистить'
							className={toolIconButton}
						>
							<Trash2 className='h-4 w-4' />
						</Button>
					</div>
				</div>

				<div className='grid md:grid-cols-2'>
					<Textarea
						value={input}
						onChange={e => setInput(e.target.value)}
						placeholder='Вставьте CSS сюда'
						spellCheck={false}
						aria-label='Исходный CSS'
						className='min-h-[24rem] resize-none rounded-none border-0 px-5 py-6 font-mono text-base focus-visible:ring-0 md:border-r md:text-sm'
					/>

					{output ? (
						<Textarea
							value={output}
							readOnly
							aria-label='Минифицированный CSS'
							className='min-h-[24rem] resize-none rounded-none border-0 bg-muted/20 px-5 py-6 font-mono text-base focus-visible:ring-0 md:text-sm'
						/>
					) : (
						<p className='flex min-h-[24rem] items-center justify-center px-5 text-center text-sm text-muted-foreground'>
							Минифицированный CSS появится здесь
						</p>
					)}
				</div>

				{/* Полоса настроек: что именно оптимизировать. Раньше это пряталось
				    за кнопкой «Настройки минификации» с шевроном. */}
				<div className={toolFooterBar}>
					{(
						[
							{
								label: 'переносы строк',
								value: preserveLineBreaks,
								toggle: () => setPreserveLineBreaks(!preserveLineBreaks),
								title: 'Оставить переносы строк — код останется читаемым'
							},
							{
								label: 'цвета',
								value: optimizeColors,
								toggle: () => setOptimizeColors(!optimizeColors),
								title: '#ffffff → #fff'
							},
							{
								label: 'единицы',
								value: optimizeUnits,
								toggle: () => setOptimizeUnits(!optimizeUnits),
								title: '0px → 0, 0.5em → .5em'
							},
							{
								label: 'сокращения',
								value: optimizeShorthand,
								toggle: () => setOptimizeShorthand(!optimizeShorthand),
								title: 'margin: 0 0 0 0 → margin: 0'
							}
						] as const
					).map(option => (
						<button
							key={option.label}
							type='button'
							onClick={option.toggle}
							aria-pressed={option.value}
							title={option.title}
							className={toolPill(option.value)}
						>
							{option.label}
						</button>
					))}

					{result && (
						<div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground sm:ml-auto'>
							<span className='font-mono font-semibold text-foreground'>
								−{result.savings}%
							</span>
							<span className='font-mono'>
								{formatBytes(result.originalSize)} →{' '}
								{formatBytes(result.minifiedSize)}
							</span>
						</div>
					)}
				</div>

				{result && result.errors && result.errors.length > 0 && (
					<div className={toolFooterBar}>
						<span className='flex items-center gap-2 text-sm text-destructive'>
							<AlertCircle className='h-4 w-4' />
							{result.errors.join('; ')}
						</span>
					</div>
				)}

				{result && result.warnings && result.warnings.length > 0 && (
					<div className={toolFooterBar}>
						<span className='text-sm text-muted-foreground'>
							{result.warnings.join('; ')}
						</span>
					</div>
				)}
			</Card>

			{/* Справка — секцией под карточкой, как обучающие блоки в других тулах */}
			<section className='mx-auto mt-12 max-w-3xl text-left text-foreground'>
				<h2 className='text-2xl font-bold tracking-tight'>
					Что делает минификация
				</h2>
				<p className='mt-3 leading-relaxed'>
					Минификатор убирает из CSS всё, что нужно человеку, но не нужно
					браузеру: комментарии, переносы строк и лишние пробелы. Плюс мелкая
					оптимизация значений —{' '}
					<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
						#ffffff
					</code>{' '}
					превращается в{' '}
					<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
						#fff
					</code>
					, а{' '}
					<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
						0px
					</code>{' '}
					просто в{' '}
					<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
						0
					</code>
					. Поведение стилей при этом не меняется.
				</p>
				<p className='mt-3 leading-relaxed'>
					Файл обычно худеет на 20–40%, а если код щедро откомментирован — то и
					больше. Поверх этого сервер отдаёт стили сжатыми через gzip или
					brotli, и там экономия ещё заметнее: в минифицированном CSS меньше
					повторяющегося «воздуха», поэтому он сжимается лучше.
				</p>
				<p className='mt-3 leading-relaxed'>
					Единственное, о чём стоит помнить: минифицированный CSS нечитаем для
					человека. Исходник храните отдельно, а в продакшен кладите сжатую
					версию — обычно это делает сборщик, а не руками.
				</p>
				<p className='mt-3 leading-relaxed'>
					Удобный порядок работы: сначала соберите стили в генераторах —
					например, подберите цвета в{' '}
					<Link
						href='/tools/color-converter'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						конвертере цветов
					</Link>{' '}
					и фон в{' '}
					<Link
						href='/tools/css-gradient-generator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						генераторе градиентов
					</Link>
					, — а минификатор примените последним шагом, перед тем как положить
					файл в продакшен.
				</p>
			</section>
		</>
	)
}
