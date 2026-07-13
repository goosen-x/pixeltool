'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
	Copy,
	Download,
	Upload,
	AlertCircle,
	CheckCircle,
	ChevronDown,
	ChevronUp,
	Settings,
	X
} from 'lucide-react'
import { toast } from 'sonner'

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
	const [showOptions, setShowOptions] = useState(false)

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
		toast.success('Скопировано в буфер обмена!')
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
		toast.success('Файл minified.css скачан!')
	}

	const loadExample = (example: (typeof CSS_EXAMPLES)[0]) => {
		setInput(example.code)
		toast.success(`Пример загружен: ${example.name}`)
	}

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = e => {
				const content = e.target?.result as string
				setInput(content)
				toast.success(`Файл ${file.name} загружен!`)
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
		toast.success('Сброшено')
	}

	return (
		<div className='max-w-7xl mx-auto space-y-6'>
			<Card className='space-y-8 p-6 sm:p-8'>
				{/* Примеры — ряд наверху, как в остальных CSS-тулах */}
				<div className='flex flex-wrap items-center gap-2'>
					<span className='mr-1 text-sm font-medium text-muted-foreground'>
						Примеры:
					</span>
					{CSS_EXAMPLES.map(example => (
						<Button
							key={example.name}
							onClick={() => loadExample(example)}
							variant='outline'
							size='sm'
							className='cursor-pointer'
						>
							{example.name}
						</Button>
					))}
					<div className='ml-auto flex items-center gap-2'>
						<Label htmlFor='file-upload'>
							<Button variant='outline' size='sm' asChild>
								<span className='cursor-pointer'>
									<Upload className='mr-2 h-4 w-4' />
									Загрузить файл
								</span>
							</Button>
						</Label>
						<input
							id='file-upload'
							type='file'
							accept='.css'
							onChange={handleFileUpload}
							className='hidden'
							aria-label='Загрузить CSS-файл'
						/>
						<Button
							variant='ghost'
							size='sm'
							onClick={resetAll}
							disabled={!input.trim()}
							className='cursor-pointer'
						>
							Сбросить
						</Button>
					</div>
				</div>

				<div className='grid gap-10 border-t pt-8 lg:grid-cols-2'>
					{/* Ввод */}
					<div className='space-y-4'>
						<div className='flex items-center justify-between'>
							<h3 className='text-sm font-semibold tracking-wide uppercase text-muted-foreground'>
								Исходный код
							</h3>
							{input && (
								<span className='font-mono text-xs text-muted-foreground'>
									{formatBytes(new TextEncoder().encode(input).length)}
								</span>
							)}
						</div>

						<Textarea
							value={input}
							onChange={e => setInput(e.target.value)}
							placeholder='Вставьте CSS код сюда...'
							className='min-h-[320px] resize-none font-mono text-sm'
						/>

						<div className='space-y-4'>
							<div className='flex flex-wrap items-center justify-between gap-2'>
								<Button
									variant='ghost'
									size='sm'
									className='cursor-pointer gap-2'
									onClick={() => setShowOptions(!showOptions)}
								>
									<Settings className='h-4 w-4' />
									Настройки минификации
									{showOptions ? (
										<ChevronUp className='h-4 w-4' />
									) : (
										<ChevronDown className='h-4 w-4' />
									)}
								</Button>
							</div>

							{showOptions && (
								<div className='grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-4'>
									<div className='flex items-center space-x-2'>
										<Switch
											id='preserve-lines'
											checked={preserveLineBreaks}
											onCheckedChange={setPreserveLineBreaks}
											className='cursor-pointer'
										/>
										<Label
											htmlFor='preserve-lines'
											className='cursor-pointer text-sm'
										>
											Сохранить переносы строк
										</Label>
									</div>

									<div className='flex items-center space-x-2'>
										<Switch
											id='optimize-colors'
											checked={optimizeColors}
											onCheckedChange={setOptimizeColors}
											className='cursor-pointer'
										/>
										<Label
											htmlFor='optimize-colors'
											className='cursor-pointer text-sm'
										>
											Оптимизировать цвета
										</Label>
									</div>

									<div className='flex items-center space-x-2'>
										<Switch
											id='optimize-units'
											checked={optimizeUnits}
											onCheckedChange={setOptimizeUnits}
											className='cursor-pointer'
										/>
										<Label
											htmlFor='optimize-units'
											className='cursor-pointer text-sm'
										>
											Оптимизировать единицы
										</Label>
									</div>

									<div className='flex items-center space-x-2'>
										<Switch
											id='optimize-shorthand'
											checked={optimizeShorthand}
											onCheckedChange={setOptimizeShorthand}
											className='cursor-pointer'
										/>
										<Label
											htmlFor='optimize-shorthand'
											className='cursor-pointer text-sm'
										>
											Сокращённые свойства
										</Label>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Вывод */}
					<div className='space-y-4'>
						<div className='flex items-center justify-between'>
							<h3 className='text-sm font-semibold tracking-wide uppercase text-muted-foreground'>
								Минифицированный код
							</h3>
							{output && (
								<div className='flex gap-1'>
									<Button
										onClick={() => copyToClipboard(output)}
										variant='ghost'
										size='sm'
										className='h-8 cursor-pointer px-2'
										aria-label='Скопировать результат'
									>
										<Copy className='h-3.5 w-3.5' />
									</Button>
									<Button
										onClick={downloadCode}
										variant='ghost'
										size='sm'
										className='h-8 cursor-pointer px-2'
										aria-label='Скачать файл'
									>
										<Download className='h-3.5 w-3.5' />
									</Button>
								</div>
							)}
						</div>

						{result && (
							<div className='flex flex-wrap items-center gap-x-4 gap-y-1 border-b pb-3 text-xs text-muted-foreground'>
								<span className='font-mono text-sm font-semibold text-foreground'>
									−{result.savings}%
								</span>
								<span className='font-mono'>
									{formatBytes(result.originalSize)} →{' '}
									{formatBytes(result.minifiedSize)}
								</span>
								<span>сэкономлено {formatBytes(result.savingsBytes)}</span>
							</div>
						)}

						{!output ? (
							<div className='flex h-[320px] flex-col items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground'>
								Минифицированный CSS появится здесь
							</div>
						) : (
							<Textarea
								value={output}
								readOnly
								className='min-h-[320px] resize-none bg-muted/50 font-mono text-sm'
							/>
						)}

						{result && (
							<div className='space-y-3 text-sm'>
								{result.errors && result.errors.length > 0 ? (
									<div className='rounded-lg border border-destructive/30 bg-destructive/5 p-3'>
										<p className='mb-1.5 flex items-center gap-2 font-medium text-destructive'>
											<AlertCircle className='h-4 w-4' />
											Обнаружены ошибки
										</p>
										<ul className='space-y-0.5 text-xs text-muted-foreground'>
											{result.errors.map((error, index) => (
												<li key={index}>• {error}</li>
											))}
										</ul>
									</div>
								) : (
									<p className='flex items-center gap-2 text-sm text-muted-foreground'>
										<CheckCircle className='h-4 w-4' />
										CSS минифицирован без ошибок
									</p>
								)}

								{result.warnings && result.warnings.length > 0 && (
									<div className='rounded-lg bg-muted/50 p-3'>
										<p className='mb-1.5 text-xs font-medium'>Важные заметки</p>
										<ul className='space-y-0.5 text-xs text-muted-foreground'>
											{result.warnings.map((warning, index) => (
												<li key={index}>• {warning}</li>
											))}
										</ul>
									</div>
								)}

								{result.optimizations && result.optimizations.length > 0 && (
									<div className='rounded-lg bg-muted/50 p-3'>
										<p className='mb-1.5 text-xs font-medium'>
											Применённые оптимизации
										</p>
										<ul className='space-y-0.5 text-xs text-muted-foreground'>
											{result.optimizations.map((opt, index) => (
												<li key={index}>• {opt}</li>
											))}
										</ul>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
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
			</section>
		</div>
	)
}
