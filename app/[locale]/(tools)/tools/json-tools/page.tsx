'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
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
	Minimize2,
	Maximize2,
	Braces,
	AlertCircle,
	Info
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

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
		name: 'Simple Object',
		data: '{"name": "John", "age": 30, "city": "New York"}'
	},
	{
		name: 'Array of Objects',
		data: '[{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]'
	},
	{
		name: 'Nested Structure',
		data: '{"users": [{"profile": {"name": "John", "settings": {"theme": "dark", "notifications": true}}}], "meta": {"version": "1.0"}}'
	},
	{
		name: 'Complex Data',
		data: '{"api": {"endpoints": [{"method": "GET", "path": "/users", "params": ["limit", "offset"]}, {"method": "POST", "path": "/users", "body": {"name": "string", "email": "string"}}], "auth": {"type": "Bearer", "required": true}}, "config": {"timeout": 5000, "retries": 3, "debug": false}}'
	}
]

export default function JSONToolsPage() {
	const [input, setInput] = useState('')
	const [analysis, setAnalysis] = useState<JSONAnalysis | null>(null)
	const [indentSize, setIndentSize] = useState('2')
	const [activeTab, setActiveTab] = useState('validator')
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

	const analyzeJSON = (jsonString: string) => {
		setIsLoading(true)

		try {
			// Parse JSON to check validity
			const parsed = JSON.parse(jsonString)

			// Create formatted version
			const indentSpaces = parseInt(indentSize)
			const formatted = JSON.stringify(parsed, null, indentSpaces)

			// Create minified version
			const minified = JSON.stringify(parsed)

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

			const result: JSONAnalysis = {
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
			}

			setAnalysis(result)
		}

		setIsLoading(false)
	}

	const analyzeStructure = (obj: any, depth = 0): JSONAnalysis['structure'] => {
		let structure = {
			objects: 0,
			arrays: 0,
			strings: 0,
			numbers: 0,
			booleans: 0,
			nulls: 0,
			totalKeys: 0,
			maxDepth: depth
		}

		if (obj === null) {
			structure.nulls++
		} else if (typeof obj === 'boolean') {
			structure.booleans++
		} else if (typeof obj === 'number') {
			structure.numbers++
		} else if (typeof obj === 'string') {
			structure.strings++
		} else if (Array.isArray(obj)) {
			structure.arrays++
			for (const item of obj) {
				const childStructure = analyzeStructure(item, depth + 1)
				structure.objects += childStructure.objects
				structure.arrays += childStructure.arrays
				structure.strings += childStructure.strings
				structure.numbers += childStructure.numbers
				structure.booleans += childStructure.booleans
				structure.nulls += childStructure.nulls
				structure.totalKeys += childStructure.totalKeys
				structure.maxDepth = Math.max(
					structure.maxDepth,
					childStructure.maxDepth
				)
			}
		} else if (typeof obj === 'object') {
			structure.objects++
			const keys = Object.keys(obj)
			structure.totalKeys += keys.length

			for (const key of keys) {
				const childStructure = analyzeStructure(obj[key], depth + 1)
				structure.objects += childStructure.objects
				structure.arrays += childStructure.arrays
				structure.strings += childStructure.strings
				structure.numbers += childStructure.numbers
				structure.booleans += childStructure.booleans
				structure.nulls += childStructure.nulls
				structure.totalKeys += childStructure.totalKeys
				structure.maxDepth = Math.max(
					structure.maxDepth,
					childStructure.maxDepth
				)
			}
		}

		return structure
	}

	const formatBytes = (bytes: number): string => {
		if (bytes === 0) return '0 Bytes'
		const k = 1024
		const sizes = ['Bytes', 'KB', 'MB', 'GB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
	}

	const copyToClipboard = (text: string, label: string) => {
		navigator.clipboard.writeText(text)
		toast.success(`${label} скопирован в буфер обмена!`)
	}

	const downloadJSON = (content: string, filename: string) => {
		const blob = new Blob([content], { type: 'application/json' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = filename
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		URL.revokeObjectURL(url)
		toast.success(`${filename} загружен!`)
	}

	const loadExample = (example: (typeof JSON_EXAMPLES)[0]) => {
		setInput(example.data)
		toast.success(`Загружен пример: ${example.name}`)
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

	const clearInput = () => {
		setInput('')
		setAnalysis(null)
		toast.success('Поле очищено')
	}

	return (
		<div className='max-w-6xl mx-auto space-y-8'>
			{/* Quick Actions */}
			<Card className='p-4'>
				<div className='flex items-center gap-4 flex-wrap'>
					<div className='flex items-center gap-2'>
						<Label htmlFor='file-upload' className='cursor-pointer'>
							<Button variant='outline' size='sm' asChild>
								<span>
									<Upload className='w-4 h-4 mr-2' />
									Загрузить файл
								</span>
							</Button>
						</Label>
						<input
							id='file-upload'
							type='file'
							accept='.json,.txt'
							onChange={handleFileUpload}
							className='hidden'
						/>
					</div>

					<Select
						onValueChange={value =>
							loadExample(JSON_EXAMPLES.find(e => e.name === value)!)
						}
					>
						<SelectTrigger className='w-40'>
							<SelectValue placeholder='Примеры' />
						</SelectTrigger>
						<SelectContent>
							{JSON_EXAMPLES.map(example => (
								<SelectItem key={example.name} value={example.name}>
									{example.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Button onClick={clearInput} variant='outline' size='sm'>
						Очистить
					</Button>

					<div className='flex items-center gap-2 ml-auto'>
						<Label htmlFor='indent-size' className='text-sm'>
							Отступ:
						</Label>
						<Select value={indentSize} onValueChange={setIndentSize}>
							<SelectTrigger className='w-16'>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='2'>2</SelectItem>
								<SelectItem value='4'>4</SelectItem>
								<SelectItem value='8'>8</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</Card>

			{/* Main Content */}
			<div className='grid lg:grid-cols-2 gap-8'>
				{/* Input Section */}
				<Card className='p-6'>
					<div className='flex items-center justify-between mb-4'>
						<h3 className='font-semibold flex items-center gap-2'>
							<Braces className='w-4 h-4' />
							JSON Данные
						</h3>
						{analysis && (
							<Badge variant={analysis.isValid ? 'default' : 'destructive'}>
								{analysis.isValid ? (
									<CheckCircle className='w-3 h-3 mr-1' />
								) : (
									<XCircle className='w-3 h-3 mr-1' />
								)}
								{analysis.isValid ? 'Валидный' : 'Ошибка'}
							</Badge>
						)}
					</div>

					<Textarea
						value={input}
						onChange={e => setInput(e.target.value)}
						placeholder='Вставьте или введите JSON данные здесь...'
						className='min-h-[400px] font-mono text-sm'
					/>

					{analysis && !analysis.isValid && analysis.error && (
						<div className='mt-4 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg'>
							<div className='flex items-start gap-2'>
								<AlertCircle className='w-4 h-4 text-red-600 mt-0.5' />
								<div>
									<p className='text-sm font-medium text-red-800 dark:text-red-200'>
										JSON Ошибка
									</p>
									<p className='text-sm text-red-700 dark:text-red-300 mt-1'>
										{analysis.error.message}
									</p>
									{analysis.error.line && analysis.error.column && (
										<p className='text-xs text-red-600 dark:text-red-400 mt-1'>
											Строка {analysis.error.line}, Колонка{' '}
											{analysis.error.column}
										</p>
									)}
								</div>
							</div>
						</div>
					)}

					{input && (
						<div className='mt-4 text-xs text-muted-foreground'>
							Размер: {formatBytes(analysis?.size.original || 0)}
						</div>
					)}
				</Card>

				{/* Results Section */}
				<Card className='p-6'>
					{!analysis ? (
						<div className='flex items-center justify-center h-[400px] text-muted-foreground'>
							<div className='text-center'>
								<FileText className='w-12 h-12 mx-auto mb-3 opacity-50' />
								<p>Введите JSON данные для анализа</p>
							</div>
						</div>
					) : (
						<Tabs value={activeTab} onValueChange={setActiveTab}>
							<TabsList className='grid grid-cols-3 w-full'>
								<TabsTrigger value='validator'>
									<CheckCircle className='w-4 h-4 mr-2' />
									Валидация
								</TabsTrigger>
								<TabsTrigger value='formatted' disabled={!analysis.isValid}>
									<Maximize2 className='w-4 h-4 mr-2' />
									Форматирование
								</TabsTrigger>
								<TabsTrigger value='minified' disabled={!analysis.isValid}>
									<Minimize2 className='w-4 h-4 mr-2' />
									Сжатие
								</TabsTrigger>
							</TabsList>

							<TabsContent value='validator' className='space-y-4'>
								<div className='space-y-4'>
									{/* Validation Status */}
									<div
										className={cn(
											'p-4 rounded-lg border',
											analysis.isValid
												? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
												: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
										)}
									>
										<div className='flex items-center gap-2'>
											{analysis.isValid ? (
												<CheckCircle className='w-5 h-5 text-green-600' />
											) : (
												<XCircle className='w-5 h-5 text-red-600' />
											)}
											<p
												className={cn(
													'font-medium',
													analysis.isValid
														? 'text-green-800 dark:text-green-200'
														: 'text-red-800 dark:text-red-200'
												)}
											>
												{analysis.isValid
													? 'JSON валидный'
													: 'JSON содержит ошибки'}
											</p>
										</div>
									</div>

									{/* Structure Analysis */}
									{analysis.isValid && (
										<div className='grid grid-cols-2 gap-4'>
											<div className='space-y-3'>
												<h4 className='font-medium text-sm'>Структура</h4>
												<div className='space-y-2 text-sm'>
													<div className='flex justify-between'>
														<span>Объекты:</span>
														<Badge variant='outline'>
															{analysis.structure.objects}
														</Badge>
													</div>
													<div className='flex justify-between'>
														<span>Массивы:</span>
														<Badge variant='outline'>
															{analysis.structure.arrays}
														</Badge>
													</div>
													<div className='flex justify-between'>
														<span>Ключи:</span>
														<Badge variant='outline'>
															{analysis.structure.totalKeys}
														</Badge>
													</div>
													<div className='flex justify-between'>
														<span>Глубина:</span>
														<Badge variant='outline'>
															{analysis.structure.maxDepth}
														</Badge>
													</div>
												</div>
											</div>

											<div className='space-y-3'>
												<h4 className='font-medium text-sm'>Типы данных</h4>
												<div className='space-y-2 text-sm'>
													<div className='flex justify-between'>
														<span>Строки:</span>
														<Badge variant='outline'>
															{analysis.structure.strings}
														</Badge>
													</div>
													<div className='flex justify-between'>
														<span>Числа:</span>
														<Badge variant='outline'>
															{analysis.structure.numbers}
														</Badge>
													</div>
													<div className='flex justify-between'>
														<span>Boolean:</span>
														<Badge variant='outline'>
															{analysis.structure.booleans}
														</Badge>
													</div>
													<div className='flex justify-between'>
														<span>Null:</span>
														<Badge variant='outline'>
															{analysis.structure.nulls}
														</Badge>
													</div>
												</div>
											</div>
										</div>
									)}

									{/* Size Information */}
									<div className='p-4 bg-muted/30 rounded-lg'>
										<h4 className='font-medium text-sm mb-3'>
											Информация о размере
										</h4>
										<div className='space-y-2 text-sm'>
											<div className='flex justify-between'>
												<span>Исходный:</span>
												<span>{formatBytes(analysis.size.original)}</span>
											</div>
											{analysis.isValid && (
												<>
													<div className='flex justify-between'>
														<span>Форматированный:</span>
														<span>{formatBytes(analysis.size.formatted)}</span>
													</div>
													<div className='flex justify-between'>
														<span>Сжатый:</span>
														<span className='text-green-600'>
															{formatBytes(analysis.size.minified)}
															<span className='text-xs ml-1'>
																(-
																{Math.round(
																	(1 -
																		analysis.size.minified /
																			analysis.size.original) *
																		100
																)}
																%)
															</span>
														</span>
													</div>
												</>
											)}
										</div>
									</div>
								</div>
							</TabsContent>

							<TabsContent value='formatted' className='space-y-4'>
								<div className='flex items-center justify-between'>
									<h4 className='font-medium'>Форматированный JSON</h4>
									<div className='flex gap-2'>
										<Button
											onClick={() =>
												copyToClipboard(
													analysis.formatted!,
													'Форматированный JSON'
												)
											}
											size='sm'
											variant='outline'
										>
											<Copy className='w-4 h-4 mr-2' />
											Копировать
										</Button>
										<Button
											onClick={() =>
												downloadJSON(analysis.formatted!, 'formatted.json')
											}
											size='sm'
											variant='outline'
										>
											<Download className='w-4 h-4 mr-2' />
											Скачать
										</Button>
									</div>
								</div>
								<Textarea
									value={analysis.formatted || ''}
									readOnly
									className='min-h-[400px] font-mono text-sm'
								/>
								<div className='text-xs text-muted-foreground'>
									Размер: {formatBytes(analysis.size.formatted)} ({indentSize}{' '}
									пробела отступ)
								</div>
							</TabsContent>

							<TabsContent value='minified' className='space-y-4'>
								<div className='flex items-center justify-between'>
									<h4 className='font-medium'>Сжатый JSON</h4>
									<div className='flex gap-2'>
										<Button
											onClick={() =>
												copyToClipboard(analysis.minified!, 'Сжатый JSON')
											}
											size='sm'
											variant='outline'
										>
											<Copy className='w-4 h-4 mr-2' />
											Копировать
										</Button>
										<Button
											onClick={() =>
												downloadJSON(analysis.minified!, 'minified.json')
											}
											size='sm'
											variant='outline'
										>
											<Download className='w-4 h-4 mr-2' />
											Скачать
										</Button>
									</div>
								</div>
								<Textarea
									value={analysis.minified || ''}
									readOnly
									className='min-h-[400px] font-mono text-sm'
								/>
								<div className='text-xs text-muted-foreground flex items-center gap-4'>
									<span>Размер: {formatBytes(analysis.size.minified)}</span>
									<Badge variant='secondary' className='text-xs'>
										Экономия:{' '}
										{Math.round(
											(1 - analysis.size.minified / analysis.size.original) *
												100
										)}
										%
									</Badge>
								</div>
							</TabsContent>
						</Tabs>
					)}
				</Card>
			</div>

			{/* Info Section */}
			<Card className='p-6 bg-muted/50'>
				<h3 className='font-semibold mb-4'>О JSON инструментах</h3>
				<div className='grid md:grid-cols-2 gap-6 text-sm'>
					<div className='space-y-3'>
						<div>
							<h4 className='font-medium mb-1 flex items-center gap-2'>
								<Info className='w-4 h-4' />
								Что такое JSON?
							</h4>
							<p className='text-muted-foreground'>
								JSON (JavaScript Object Notation) - это легкий текстовый формат
								обмена данными. Он широко используется в веб-разработке для
								передачи данных между сервером и клиентом.
							</p>
						</div>
						<div>
							<h4 className='font-medium mb-1'>Зачем валидировать JSON?</h4>
							<p className='text-muted-foreground'>
								Невалидный JSON может привести к ошибкам в приложении. Валидация
								помогает обнаружить синтаксические ошибки до их попадания в
								production.
							</p>
						</div>
					</div>
					<div className='space-y-3'>
						<div>
							<h4 className='font-medium mb-1'>Форматирование vs Сжатие</h4>
							<p className='text-muted-foreground'>
								<strong>Форматирование</strong> добавляет отступы и переносы
								строк для читаемости.
								<strong>Сжатие</strong> удаляет лишние пробелы для уменьшения
								размера файла.
							</p>
						</div>
						<div>
							<h4 className='font-medium mb-1'>Анализ структуры</h4>
							<p className='text-muted-foreground'>
								Инструмент анализирует структуру JSON, подсчитывает количество
								объектов, массивов, различных типов данных и показывает глубину
								вложенности.
							</p>
						</div>
					</div>
				</div>
			</Card>
		</div>
	)
}
