'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
	Palette,
	Copy,
	Download,
	Upload,
	Zap,
	RefreshCw,
	AlertCircle,
	CheckCircle,
	FileText,
	Sparkles,
	TrendingDown,
	Info,
	Lightbulb,
	BarChart3,
	ChevronDown,
	ChevronUp,
	Settings,
	X
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

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
	const [isProcessing, setIsProcessing] = useState(false)
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

	const handleMinify = () => {
		if (!input.trim()) {
			toast.error('Введите CSS код для минификации')
			return
		}

		setIsProcessing(true)

		setTimeout(() => {
			try {
				const minificationResult = minifyCSS(input)

				setResult(minificationResult)
				setOutput(minificationResult.minified)

				if (minificationResult.errors && minificationResult.errors.length > 0) {
					toast.error(`Обнаружены ошибки: ${minificationResult.errors.length}`)
				} else {
					toast.success(
						`CSS минифицирован! Сжатие ${minificationResult.savings}%`
					)
				}
			} catch (error) {
				toast.error('Ошибка минификации CSS')
				console.error('Minification error:', error)
			} finally {
				setIsProcessing(false)
			}
		}, 300)
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
			{/* Main Interface */}
			<div className='grid lg:grid-cols-2 gap-6'>
				{/* Input Panel */}
				<Card className='p-6'>
					<div className='space-y-4'>
						{/* Header */}
						<div className='flex flex-wrap items-center justify-between gap-3'>
							<div className='flex items-center gap-2'>
								<FileText className='w-5 h-5 text-pink-500' />
								<h3 className='font-semibold text-sm sm:text-base'>
									Исходный код
								</h3>
							</div>
							<div className='flex flex-wrap items-center gap-2'>
								{input && (
									<Badge variant='secondary' className='font-mono text-xs'>
										{formatBytes(new TextEncoder().encode(input).length)}
									</Badge>
								)}
								<Label htmlFor='file-upload'>
									<Button variant='outline' size='sm' asChild>
										<span className='cursor-pointer text-xs sm:text-sm'>
											<Upload className='w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2' />
											<span className='hidden xs:inline'>Загрузить CSS</span>
											<span className='xs:hidden'>CSS</span>
										</span>
									</Button>
								</Label>
								<input
									id='file-upload'
									type='file'
									accept='.css'
									onChange={handleFileUpload}
									className='hidden'
									aria-label='Upload CSS file'
								/>
							</div>
						</div>

						{/* Textarea */}
						<Textarea
							value={input}
							onChange={e => setInput(e.target.value)}
							placeholder='Вставьте CSS код сюда...'
							className='min-h-[300px] font-mono text-sm resize-none'
						/>

						{/* Examples */}
						<div className='flex flex-wrap gap-2'>
							{CSS_EXAMPLES.map(example => (
								<Button
									key={example.name}
									onClick={() => loadExample(example)}
									variant='outline'
									size='sm'
								>
									{example.name}
								</Button>
							))}
						</div>

						{/* Options Toggle */}
						<div className='space-y-4'>
							<div className='flex flex-wrap items-center justify-between gap-2'>
								<Button
									variant='ghost'
									size='sm'
									className='gap-1 sm:gap-2 text-xs sm:text-sm'
									onClick={() => setShowOptions(!showOptions)}
								>
									<Settings className='h-3 w-3 sm:h-4 sm:w-4' />
									<span className='hidden xs:inline'>
										Настройки минификации
									</span>
									<span className='xs:hidden'>Настройки</span>
									{showOptions ? (
										<ChevronUp className='h-3 w-3 sm:h-4 sm:w-4' />
									) : (
										<ChevronDown className='h-3 w-3 sm:h-4 sm:w-4' />
									)}
								</Button>

								{/* Primary Actions */}
								<div className='flex flex-wrap gap-2'>
									<Button
										onClick={handleMinify}
										disabled={isProcessing || !input.trim()}
										size='sm'
										className='bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-xs sm:text-sm'
									>
										{isProcessing ? (
											<>
												<RefreshCw className='w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin' />
												<span className='hidden xs:inline'>Минификация...</span>
											</>
										) : (
											<>
												<Zap className='w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2' />
												<span className='hidden xs:inline'>Минифицировать</span>
												<span className='xs:hidden'>Старт</span>
											</>
										)}
									</Button>
									<Button
										variant='outline'
										onClick={resetAll}
										disabled={!input.trim()}
										size='icon'
										className='h-8 w-8 sm:h-9 sm:w-9'
									>
										<X className='h-3 w-3 sm:h-4 sm:w-4' />
									</Button>
								</div>
							</div>

							{/* Options Content */}
							{showOptions && (
								<div className='grid grid-cols-2 gap-3 p-4 bg-muted/50 rounded-lg'>
									<div className='flex items-center space-x-2'>
										<Switch
											id='preserve-lines'
											checked={preserveLineBreaks}
											onCheckedChange={setPreserveLineBreaks}
										/>
										<Label
											htmlFor='preserve-lines'
											className='text-sm cursor-pointer'
										>
											Сохранить переносы строк
										</Label>
									</div>

									<div className='flex items-center space-x-2'>
										<Switch
											id='optimize-colors'
											checked={optimizeColors}
											onCheckedChange={setOptimizeColors}
										/>
										<Label
											htmlFor='optimize-colors'
											className='text-sm cursor-pointer'
										>
											Оптимизировать цвета
										</Label>
									</div>

									<div className='flex items-center space-x-2'>
										<Switch
											id='optimize-units'
											checked={optimizeUnits}
											onCheckedChange={setOptimizeUnits}
										/>
										<Label
											htmlFor='optimize-units'
											className='text-sm cursor-pointer'
										>
											Оптимизировать единицы
										</Label>
									</div>

									<div className='flex items-center space-x-2'>
										<Switch
											id='optimize-shorthand'
											checked={optimizeShorthand}
											onCheckedChange={setOptimizeShorthand}
										/>
										<Label
											htmlFor='optimize-shorthand'
											className='text-sm cursor-pointer'
										>
											Сокращённые свойства
										</Label>
									</div>
								</div>
							)}
						</div>
					</div>
				</Card>

				{/* Output Panel */}
				<Card className='p-6'>
					<div className='space-y-4'>
						{/* Header with inline stats */}
						<div className='flex flex-col gap-3'>
							<div className='flex flex-wrap items-center justify-between gap-2'>
								<div className='flex items-center gap-2'>
									<TrendingDown className='w-5 h-5 text-green-500' />
									<h3 className='font-semibold text-sm sm:text-base'>
										Минифицированный код
									</h3>
								</div>
								{output && (
									<div className='flex flex-wrap gap-2'>
										<Button
											onClick={() => copyToClipboard(output)}
											variant='outline'
											size='sm'
											className='text-xs sm:text-sm'
										>
											<Copy className='w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2' />
											<span className='hidden xs:inline'>Копировать</span>
											<span className='xs:hidden'>Copy</span>
										</Button>

										<Button
											onClick={downloadCode}
											variant='outline'
											size='sm'
											className='text-xs sm:text-sm'
										>
											<Download className='w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2' />
											<span className='hidden xs:inline'>Скачать</span>
											<span className='xs:hidden'>Save</span>
										</Button>
									</div>
								)}
							</div>

							{/* Inline stats bar */}
							{result && (
								<div className='flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground pb-3 border-b'>
									<div className='flex items-center gap-1.5'>
										<Badge className='bg-green-500 text-white text-xs'>
											-{result.savings}%
										</Badge>
										<span className='whitespace-nowrap'>сжатие</span>
									</div>
									<div className='flex items-center gap-1'>
										<span className='font-mono text-xs'>
											{formatBytes(result.originalSize)}
										</span>
										<span>→</span>
										<span className='font-mono font-medium text-xs'>
											{formatBytes(result.minifiedSize)}
										</span>
									</div>
									<div className='text-green-600 dark:text-green-400 font-medium whitespace-nowrap'>
										Сохранено: {formatBytes(result.savingsBytes)}
									</div>
								</div>
							)}
						</div>

						{!output ? (
							<div className='flex flex-col items-center justify-center h-[300px] border-2 border-dashed rounded-lg text-muted-foreground'>
								<Palette className='w-12 h-12 mb-3 opacity-20' />
								<p className='text-sm'>Минифицированный CSS появится здесь</p>
							</div>
						) : (
							<Textarea
								value={output}
								readOnly
								className='min-h-[300px] font-mono text-sm resize-none bg-muted/50'
							/>
						)}
					</div>
				</Card>
			</div>

			{/* Results Details */}
			{result && (
				<Card className='p-6'>
					{/* Optimizations Applied */}
					{result.optimizations && result.optimizations.length > 0 && (
						<div className='mb-4 p-3 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg'>
							<div className='flex items-start gap-2'>
								<CheckCircle className='w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0' />
								<div className='flex-1'>
									<p className='font-medium text-sm text-purple-900 dark:text-purple-100 mb-1.5'>
										Применённые оптимизации
									</p>
									<ul className='text-xs text-purple-800 dark:text-purple-200 space-y-0.5'>
										{result.optimizations.map((opt, index) => (
											<li key={index} className='flex items-start gap-1.5'>
												<span className='text-purple-500'>•</span>
												<span>{opt}</span>
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					)}

					{/* Warnings */}
					{result.warnings && result.warnings.length > 0 && (
						<div className='mb-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg'>
							<div className='flex items-start gap-2'>
								<Info className='w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0' />
								<div className='flex-1'>
									<p className='font-medium text-sm text-yellow-900 dark:text-yellow-100 mb-1.5'>
										Важные заметки
									</p>
									<ul className='text-xs text-yellow-800 dark:text-yellow-200 space-y-0.5'>
										{result.warnings.map((warning, index) => (
											<li key={index} className='flex items-start gap-1.5'>
												<span className='text-yellow-500'>•</span>
												<span>{warning}</span>
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					)}

					{/* Errors */}
					{result.errors && result.errors.length > 0 ? (
						<div className='p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg'>
							<div className='flex items-start gap-2'>
								<AlertCircle className='w-4 h-4 text-red-600 mt-0.5 flex-shrink-0' />
								<div className='flex-1'>
									<p className='font-medium text-sm text-red-900 dark:text-red-100 mb-1.5'>
										Обнаружены ошибки
									</p>
									<ul className='text-xs text-red-800 dark:text-red-200 space-y-0.5'>
										{result.errors.map((error, index) => (
											<li key={index} className='flex items-start gap-1.5'>
												<span className='text-red-500'>•</span>
												<span>{error}</span>
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					) : (
						<div className='p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg'>
							<div className='flex items-center gap-2'>
								<CheckCircle className='w-4 h-4 text-green-600' />
								<p className='text-green-900 dark:text-green-100 font-medium text-sm'>
									CSS успешно минифицирован без ошибок!
								</p>
							</div>
						</div>
					)}
				</Card>
			)}

			{/* Info Card */}
			<Card className='p-6 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20'>
				<div className='flex items-center gap-2 mb-4'>
					<Lightbulb className='w-5 h-5 text-amber-500' />
					<h3 className='font-semibold text-lg'>О минификации CSS</h3>
				</div>

				<div className='grid md:grid-cols-3 gap-6 text-sm'>
					<div className='space-y-3'>
						<div>
							<h4 className='font-medium mb-2 flex items-center gap-2'>
								<Zap className='w-4 h-4 text-pink-500' />
								Оптимизации
							</h4>
							<ul className='text-muted-foreground space-y-1.5'>
								<li>• Удаление комментариев и пробелов</li>
								<li>• Сокращение HEX-кодов цветов</li>
								<li>• Оптимизация нулевых значений</li>
								<li>• Упрощение сокращённых свойств</li>
							</ul>
						</div>
					</div>
					<div className='space-y-3'>
						<div>
							<h4 className='font-medium mb-2 flex items-center gap-2'>
								<TrendingDown className='w-4 h-4 text-green-500' />
								Преимущества
							</h4>
							<ul className='text-muted-foreground space-y-1.5'>
								<li>• Уменьшение размера на 20-60%</li>
								<li>• Быстрая загрузка стилей</li>
								<li>• Снижение нагрузки на сервер</li>
								<li>• Улучшение производительности</li>
							</ul>
						</div>
					</div>
					<div className='space-y-3'>
						<div>
							<h4 className='font-medium mb-2 flex items-center gap-2'>
								<Info className='w-4 h-4 text-purple-500' />
								Рекомендации
							</h4>
							<ul className='text-muted-foreground space-y-1.5'>
								<li>• Храните оригинальные файлы</li>
								<li>• Тестируйте в браузерах</li>
								<li>• Используйте с препроцессорами</li>
								<li>• Включите gzip на сервере</li>
							</ul>
						</div>
					</div>
				</div>
			</Card>
		</div>
	)
}
