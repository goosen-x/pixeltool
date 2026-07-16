'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	CheckCircle,
	XCircle,
	Copy,
	Download,
	Upload,
	FileText,
	Braces
} from 'lucide-react'
import { load as loadYAML, dump as dumpYAML } from 'js-yaml'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { WidgetLayout } from '@/components/widgets/WidgetLayout'
import { WidgetOutput } from '@/components/widgets/WidgetOutput'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { Card } from '@/components/ui/card'
import { JsonToolsSeo } from './JsonToolsSeo'
import { getWidgetById } from '@/lib/constants/widgets'
interface JSONError {
	message: string
	line?: number
	column?: number
	position?: number
}

interface JSONAnalysis {
	isValid: boolean
	error?: JSONError
	formatted?: string
	minified?: string
	yaml?: string
	/** Что распознали на входе — JSON или YAML. */
	sourceFormat?: 'json' | 'yaml'
	size: {
		original: number
		formatted: number
		minified: number
	}
	structure: {
		objects: number
		arrays: number
		strings: number
		numbers: number
		booleans: number
		nulls: number
		totalKeys: number
		maxDepth: number
	}
}

const JSON_EXAMPLES = [
	{
		name: 'Простой объект',
		data: '{"name": "John", "age": 30, "city": "New York"}'
	},
	{
		name: 'Массив объектов',
		data: '[{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]'
	},
	{
		name: 'Вложенная структура',
		data: '{"users": [{"profile": {"name": "John", "settings": {"theme": "dark", "notifications": true}}}], "meta": {"version": "1.0"}}'
	},
	{
		name: 'Сложные данные',
		data: '{"api": {"endpoints": [{"method": "GET", "path": "/users", "params": ["limit", "offset"]}, {"method": "POST", "path": "/users", "body": {"name": "string", "email": "string"}}], "auth": {"type": "Bearer", "required": true}}, "config": {"timeout": 5000, "retries": 3, "debug": false}}'
	}
]

export default function JSONToolsPage() {
	const widget = getWidgetById('json-tools')!
	const [input, setInput] = useState('')
	const [analysis, setAnalysis] = useState<JSONAnalysis | null>(null)
	const [indentSize, setIndentSize] = useState('2')
	const [activeTab, setActiveTab] = useState('formatted')

	// Keyboard shortcuts
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		if (input.trim()) {
			const timer = setTimeout(() => {
				analyzeJSON(input)
			}, 300)
			return () => clearTimeout(timer)
		} else {
			setAnalysis(null)
		}
	}, [input, indentSize])

	/**
	 * Разбирает вход как JSON, а если не вышло — как YAML. Порядок важен:
	 * валидный JSON является валидным YAML, поэтому JSON пробуем первым, иначе
	 * любой объект определялся бы как YAML.
	 */
	const parseInput = (
		source: string
	): { data: unknown; format: 'json' | 'yaml' } => {
		try {
			return { data: JSON.parse(source), format: 'json' }
		} catch (jsonError) {
			try {
				const data = loadYAML(source)
				// Скаляр («просто текст») YAML разбирает успешно, но это не документ,
				// а признак того, что человек прислал мусор или сломанный JSON.
				if (data === null || typeof data !== 'object') throw jsonError
				return { data, format: 'yaml' }
			} catch {
				throw jsonError
			}
		}
	}

	const analyzeJSON = (jsonString: string) => {
		setIsLoading(true)

		try {
			const { data: parsed, format } = parseInput(jsonString)

			// Select отдаёт '\t' для табов — parseInt вернул бы NaN и убил отступы.
			const indent: string | number =
				indentSize === '\t' ? '\t' : parseInt(indentSize)

			const formatted = JSON.stringify(parsed, null, indent)
			const minified = JSON.stringify(parsed)
			const yaml = dumpYAML(parsed, {
				indent: indentSize === '\t' ? 2 : parseInt(indentSize)
			})

			// Analyze structure
			const structure = analyzeStructure(parsed)

			// Calculate sizes
			const originalSize = new TextEncoder().encode(jsonString).length
			const formattedSize = new TextEncoder().encode(formatted).length
			const minifiedSize = new TextEncoder().encode(minified).length

			const result: JSONAnalysis = {
				isValid: true,
				formatted,
				minified,
				yaml,
				sourceFormat: format,
				size: {
					original: originalSize,
					formatted: formattedSize,
					minified: minifiedSize
				},
				structure
			}

			setAnalysis(result)
		} catch (error) {
			// Parse error details
			const errorMessage =
				error instanceof Error ? error.message : 'Invalid JSON'
			let line: number | undefined
			let column: number | undefined
			let position: number | undefined

			// Extract line and column from error message
			const positionMatch = errorMessage.match(/at position (\d+)/i)
			if (positionMatch) {
				position = parseInt(positionMatch[1])
				const lines = jsonString.substring(0, position).split('\n')
				line = lines.length
				column = lines[lines.length - 1].length + 1
			}

			setAnalysis({
				isValid: false,
				error: {
					message: errorMessage,
					line,
					column,
					position
				},
				size: {
					original: new TextEncoder().encode(jsonString).length,
					formatted: 0,
					minified: 0
				},
				structure: {
					objects: 0,
					arrays: 0,
					strings: 0,
					numbers: 0,
					booleans: 0,
					nulls: 0,
					totalKeys: 0,
					maxDepth: 0
				}
			})
		} finally {
			setIsLoading(false)
		}
	}

	const analyzeStructure = (data: any, depth = 0): any => {
		const structure = {
			objects: 0,
			arrays: 0,
			strings: 0,
			numbers: 0,
			booleans: 0,
			nulls: 0,
			totalKeys: 0,
			maxDepth: depth
		}

		if (data === null) {
			structure.nulls++
		} else if (typeof data === 'boolean') {
			structure.booleans++
		} else if (typeof data === 'number') {
			structure.numbers++
		} else if (typeof data === 'string') {
			structure.strings++
		} else if (Array.isArray(data)) {
			structure.arrays++
			structure.maxDepth = Math.max(structure.maxDepth, depth)
			data.forEach(item => {
				const subStructure = analyzeStructure(item, depth + 1)
				mergeStructures(structure, subStructure)
			})
		} else if (typeof data === 'object') {
			structure.objects++
			structure.maxDepth = Math.max(structure.maxDepth, depth)
			structure.totalKeys += Object.keys(data).length
			Object.values(data).forEach(value => {
				const subStructure = analyzeStructure(value, depth + 1)
				mergeStructures(structure, subStructure)
			})
		}

		return structure
	}

	const mergeStructures = (target: any, source: any) => {
		target.objects += source.objects
		target.arrays += source.arrays
		target.strings += source.strings
		target.numbers += source.numbers
		target.booleans += source.booleans
		target.nulls += source.nulls
		target.totalKeys += source.totalKeys
		target.maxDepth = Math.max(target.maxDepth, source.maxDepth)
	}

	const handleCopy = (text: string, label: string) => {
		navigator.clipboard.writeText(text)
		toast.success(`${label} copied to clipboard`)
	}

	const handleDownload = (text: string, filename: string) => {
		const blob = new Blob([text], { type: 'application/json' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = filename
		a.click()
		URL.revokeObjectURL(url)
		toast.success(`Downloaded ${filename}`)
	}

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = e => {
				const content = e.target?.result as string
				setInput(content)
			}
			reader.readAsText(file)
		}
	}

	const loadExample = (example: string) => {
		setInput(example)
	}

	const formatBytes = (bytes: number) => {
		if (bytes === 0) return '0 B'
		const k = 1024
		const sizes = ['B', 'KB', 'MB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
	}

	return (
		<WidgetSEOWrapper widget={widget}>
			<WidgetLayout>
				{/* Всё в одной карточке: секции внутри — без собственных рамок */}
				<Card className='space-y-8 p-6 sm:p-8'>
				{/* Быстрый старт: примеры и загрузка/очистка вынесены наверх, чтобы
				    сразу было понятно, с чего начать */}
				<div className='flex flex-col gap-5 border-b pb-7'>
					<div className='min-w-0 space-y-2'>
						<Label className='text-sm font-medium'>Примеры</Label>
						<div className='flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
							{JSON_EXAMPLES.map((example, index) => (
								<Button
									key={index}
									variant='outline'
									size='sm'
									onClick={() => loadExample(example.data)}
									className='shrink-0 text-xs'
								>
									<FileText className='mr-1.5 h-3 w-3' />
									{example.name}
								</Button>
							))}
						</div>
					</div>
				</div>

				<div className='grid gap-8 lg:grid-cols-2 lg:gap-10'>
					{/* Ввод */}
					<div className='space-y-4'>
						<div className='flex items-center justify-between gap-3'>
							<h3 className='text-lg font-semibold'>Исходный JSON</h3>
							<div className='flex gap-2'>
								<label>
									<Button variant='outline' size='sm' asChild>
										<span>
											<Upload className='mr-2 h-4 w-4' />
											Загрузить
										</span>
									</Button>
									<input
										type='file'
										accept='.json'
										onChange={handleFileUpload}
										aria-label='Загрузить JSON файл'
										className='hidden'
									/>
								</label>
								<Button
									variant='outline'
									size='sm'
									onClick={() => setInput('')}
									disabled={!input}
								>
									Очистить
								</Button>
							</div>
						</div>
						<Textarea
							value={input}
							onChange={e => setInput(e.target.value)}
							placeholder='Вставьте JSON сюда…'
							className='min-h-[300px] font-mono text-sm'
							spellCheck={false}
						/>

							{/* Validation Status */}
							{analysis && (
								<div
									className={cn(
										'p-3 rounded-xl border',
										analysis.isValid
											? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
											: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
									)}
								>
									<div className='flex items-center gap-2'>
										{analysis.isValid ? (
											<>
												<CheckCircle className='h-4 w-4 text-green-600 dark:text-green-400' />
												<span className='text-sm font-medium text-green-700 dark:text-green-300'>
													JSON корректен
												</span>
											</>
										) : (
											<>
												<XCircle className='h-4 w-4 text-red-600 dark:text-red-400' />
												<span className='text-sm font-medium text-red-700 dark:text-red-300'>
													Ошибка в JSON
												</span>
											</>
										)}
									</div>
									{analysis.error && (
										<div className='mt-2 text-sm text-red-600 dark:text-red-400'>
											<p className='font-mono'>{analysis.error.message}</p>
											{analysis.error.line && analysis.error.column && (
												<p className='mt-1'>
													Строка {analysis.error.line}, столбец{' '}
													{analysis.error.column}
												</p>
											)}
										</div>
									)}
								</div>
							)}
					</div>

					{/* Результат */}
					<div className='space-y-4'>
						<div className='flex items-center justify-between gap-3'>
							<h3 className='text-lg font-semibold'>Результат</h3>
							<div className='flex items-center gap-2'>
								<Label className='whitespace-nowrap text-sm text-muted-foreground'>
									Отступ
								</Label>
								<Select value={indentSize} onValueChange={setIndentSize}>
									<SelectTrigger className='h-9 w-[132px]'>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='2'>2 пробела</SelectItem>
										<SelectItem value='4'>4 пробела</SelectItem>
										<SelectItem value='\t'>Табуляция</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						{analysis && analysis.isValid ? (
							<Tabs
								value={activeTab}
								onValueChange={setActiveTab}
								className='h-full'
							>
								<TabsList className='grid w-full grid-cols-4'>
									<TabsTrigger
										value='formatted'
										className='cursor-pointer text-xs sm:text-sm'
									>
										Формат
									</TabsTrigger>
									<TabsTrigger
										value='minified'
										className='cursor-pointer text-xs sm:text-sm'
									>
										Сжатый
									</TabsTrigger>
									<TabsTrigger
										value='yaml'
										className='cursor-pointer text-xs sm:text-sm'
									>
										YAML
									</TabsTrigger>
									<TabsTrigger
										value='analysis'
										className='cursor-pointer text-xs sm:text-sm'
									>
										Анализ
									</TabsTrigger>
								</TabsList>

								<TabsContent value='formatted' className='space-y-4'>
									<WidgetOutput>
										<pre className='text-sm font-mono overflow-auto'>
											<code>{analysis.formatted}</code>
										</pre>
									</WidgetOutput>
									<div className='flex items-center gap-2 mt-4'>
										<Button
											variant='outline'
											size='sm'
											onClick={() =>
												handleCopy(analysis.formatted!, 'Formatted JSON')
											}
										>
											<Copy className='h-4 w-4 mr-2' />
											Копировать
										</Button>
										<Button
											variant='outline'
											size='sm'
											onClick={() =>
												handleDownload(analysis.formatted!, 'formatted.json')
											}
										>
											<Download className='h-4 w-4 mr-2' />
											Скачать
										</Button>
									</div>
								</TabsContent>

								<TabsContent value='minified' className='space-y-4'>
									<WidgetOutput>
										<pre className='text-sm font-mono overflow-auto break-all'>
											<code>{analysis.minified}</code>
										</pre>
									</WidgetOutput>
									<div className='flex items-center gap-2 mt-4'>
										<Button
											variant='outline'
											size='sm'
											onClick={() =>
												handleCopy(analysis.minified!, 'Minified JSON')
											}
										>
											<Copy className='h-4 w-4 mr-2' />
											Копировать
										</Button>
										<Button
											variant='outline'
											size='sm'
											onClick={() =>
												handleDownload(analysis.minified!, 'minified.json')
											}
										>
											<Download className='h-4 w-4 mr-2' />
											Скачать
										</Button>
									</div>
								</TabsContent>

								<TabsContent value='yaml' className='space-y-4'>
									{analysis.sourceFormat === 'yaml' && (
										<p className='text-sm text-muted-foreground'>
											На входе распознан YAML — во вкладках «Форматированный»
											и «Сжатый» лежит он же, переведённый в JSON.
										</p>
									)}
									<WidgetOutput>
										<pre className='text-sm font-mono overflow-auto'>
											<code>{analysis.yaml}</code>
										</pre>
									</WidgetOutput>
									<div className='flex items-center gap-2 mt-4'>
										<Button
											variant='outline'
											size='sm'
											className='cursor-pointer'
											onClick={() => handleCopy(analysis.yaml!, 'YAML')}
										>
											<Copy className='h-4 w-4 mr-2' />
											Копировать
										</Button>
										<Button
											variant='outline'
											size='sm'
											className='cursor-pointer'
											onClick={() =>
												handleDownload(analysis.yaml!, 'data.yaml')
											}
										>
											<Download className='h-4 w-4 mr-2' />
											Скачать
										</Button>
									</div>
								</TabsContent>

								<TabsContent value='analysis' className='space-y-4'>
									<div className='space-y-4'>
										{/* Size Analysis */}
										<div className='p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/50'>
											<h4 className='font-medium text-sm mb-3'>Размеры</h4>
											<div className='space-y-2'>
												<div className='flex justify-between items-center'>
													<span className='text-sm text-muted-foreground'>
														Исходный
													</span>
													<Badge variant='secondary'>
														{formatBytes(analysis.size.original)}
													</Badge>
												</div>
												<div className='flex justify-between items-center'>
													<span className='text-sm text-muted-foreground'>
														Форматированный
													</span>
													<Badge variant='secondary'>
														{formatBytes(analysis.size.formatted)}
													</Badge>
												</div>
												<div className='flex justify-between items-center'>
													<span className='text-sm text-muted-foreground'>
														Сжатый
													</span>
													<Badge variant='secondary'>
														{formatBytes(analysis.size.minified)}
													</Badge>
												</div>
												<div className='flex justify-between items-center pt-2 border-t'>
													<span className='text-sm font-medium'>
														Сжатие
													</span>
													<Badge className='bg-gradient-to-r from-primary to-accent text-white'>
														{Math.round(
															(1 -
																analysis.size.minified /
																	analysis.size.original) *
																100
														)}
														%
													</Badge>
												</div>
											</div>
										</div>

										{/* Structure Analysis */}
										<div className='p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/50'>
											<h4 className='font-medium text-sm mb-3'>Структура</h4>
											<div className='grid grid-cols-2 gap-3'>
												<div className='flex justify-between items-center'>
													<span className='text-sm text-muted-foreground'>
														Объекты
													</span>
													<Badge variant='outline'>
														{analysis.structure.objects}
													</Badge>
												</div>
												<div className='flex justify-between items-center'>
													<span className='text-sm text-muted-foreground'>
														Массивы
													</span>
													<Badge variant='outline'>
														{analysis.structure.arrays}
													</Badge>
												</div>
												<div className='flex justify-between items-center'>
													<span className='text-sm text-muted-foreground'>
														Строки
													</span>
													<Badge variant='outline'>
														{analysis.structure.strings}
													</Badge>
												</div>
												<div className='flex justify-between items-center'>
													<span className='text-sm text-muted-foreground'>
														Числа
													</span>
													<Badge variant='outline'>
														{analysis.structure.numbers}
													</Badge>
												</div>
												<div className='flex justify-between items-center'>
													<span className='text-sm text-muted-foreground'>
														Логические
													</span>
													<Badge variant='outline'>
														{analysis.structure.booleans}
													</Badge>
												</div>
												<div className='flex justify-between items-center'>
													<span className='text-sm text-muted-foreground'>
														null
													</span>
													<Badge variant='outline'>
														{analysis.structure.nulls}
													</Badge>
												</div>
												<div className='flex justify-between items-center col-span-2 pt-2 border-t'>
													<span className='text-sm text-muted-foreground'>
														Всего ключей
													</span>
													<Badge variant='outline'>
														{analysis.structure.totalKeys}
													</Badge>
												</div>
												<div className='flex justify-between items-center col-span-2'>
													<span className='text-sm text-muted-foreground'>
														Глубина
													</span>
													<Badge variant='outline'>
														{analysis.structure.maxDepth}
													</Badge>
												</div>
											</div>
										</div>
									</div>
								</TabsContent>
							</Tabs>
						) : (
							<div className='flex h-[400px] items-center justify-center text-muted-foreground'>
								<div className='space-y-3 text-center'>
									<Braces className='mx-auto h-12 w-12 opacity-20' />
									<p className='text-sm'>
										{analysis?.error
											? 'Исправьте ошибки в JSON'
											: 'Вставьте JSON — здесь появится результат'}
									</p>
								</div>
							</div>
						)}
					</div>
				</div>
				</Card>
			</WidgetLayout>
			<JsonToolsSeo />
		</WidgetSEOWrapper>
	)
}
