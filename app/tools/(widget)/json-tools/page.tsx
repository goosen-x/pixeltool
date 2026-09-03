'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
	CheckCircle,
	XCircle,
	Copy,
	Check,
	Download,
	Upload,
	Trash2
} from 'lucide-react'
import { load as loadYAML, dump as dumpYAML } from 'js-yaml'
import { cn } from '@/lib/utils'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { Card } from '@/components/ui/card'
import { JsonToolsSeo } from './JsonToolsSeo'
import { getWidgetById } from '@/lib/constants/widgets'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'
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
	const [copied, setCopied] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)

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

	const handleCopy = (text: string) => {
		navigator.clipboard.writeText(text)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	const handleDownload = (text: string, filename: string) => {
		const blob = new Blob([text], { type: 'application/json' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = filename
		a.click()
		URL.revokeObjectURL(url)
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

	// Что показывать справа: три вида одного и того же документа плюс разбор.
	const output =
		activeTab === 'minified'
			? analysis?.minified
			: activeTab === 'yaml'
				? analysis?.yaml
				: analysis?.formatted

	const outputFilename =
		activeTab === 'minified'
			? 'minified.json'
			: activeTab === 'yaml'
				? 'data.yaml'
				: 'formatted.json'

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: во что превращаем документ и что с ним делаем.
				    Раньше это были вкладки во всю ширину внутри правой колонки. */}
				<div className={toolBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						{(
							[
								['formatted', 'Читаемый'],
								['minified', 'Сжатый'],
								['yaml', 'YAML'],
								['analysis', 'Разбор']
							] as [string, string][]
						).map(([value, label]) => (
							<button
								key={value}
								type='button'
								onClick={() => setActiveTab(value)}
								aria-pressed={activeTab === value}
								className={toolPill(activeTab === value)}
							>
								{label}
							</button>
						))}
					</div>

					{analysis && (
						<span
							className={cn(
								'flex items-center gap-1.5 text-sm',
								analysis.isValid
									? 'text-green-600 dark:text-green-400'
									: 'text-destructive'
							)}
						>
							{analysis.isValid ? (
								<CheckCircle className='h-4 w-4' />
							) : (
								<XCircle className='h-4 w-4' />
							)}
							{analysis.isValid ? 'JSON корректен' : 'ошибка разбора'}
						</span>
					)}

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => fileInputRef.current?.click()}
							title='Загрузить .json'
							className={toolIconButton}
						>
							<Upload className='h-4 w-4' />
						</Button>
						<input
							ref={fileInputRef}
							type='file'
							accept='.json'
							onChange={handleFileUpload}
							aria-label='Загрузить JSON файл'
							className='hidden'
						/>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => output && handleCopy(output)}
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
							onClick={() => output && handleDownload(output, outputFilename)}
							disabled={!output}
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
						placeholder='Вставьте JSON или YAML'
						spellCheck={false}
						aria-label='Исходный документ'
						className='min-h-[22rem] resize-none rounded-none border-0 px-5 py-6 font-mono text-base focus-visible:ring-0 sm:px-6 md:text-sm lg:border-r'
					/>

					<div className='max-h-[30rem] min-h-[22rem] overflow-auto px-5 py-6 sm:px-6'>
						{!analysis ? (
							<p className='flex h-full items-center justify-center text-center text-sm text-muted-foreground'>
								Вставьте документ — результат появится здесь
							</p>
						) : !analysis.isValid ? (
							<div className='text-sm'>
								<p className='text-destructive'>{analysis.error?.message}</p>
								{analysis.error?.line && analysis.error?.column && (
									<p className='mt-1 font-mono text-xs text-muted-foreground'>
										строка {analysis.error.line}, столбец{' '}
										{analysis.error.column}
									</p>
								)}
							</div>
						) : activeTab === 'analysis' ? (
							<div className='space-y-4 text-sm'>
								<div className='flex flex-wrap gap-x-5 gap-y-1'>
									<span className='text-muted-foreground'>
										исходный{' '}
										<span className='font-mono text-foreground'>
											{formatBytes(analysis.size.original)}
										</span>
									</span>
									<span className='text-muted-foreground'>
										читаемый{' '}
										<span className='font-mono text-foreground'>
											{formatBytes(analysis.size.formatted)}
										</span>
									</span>
									<span className='text-muted-foreground'>
										сжатый{' '}
										<span className='font-mono text-foreground'>
											{formatBytes(analysis.size.minified)}
										</span>
									</span>
								</div>

								<div className='flex flex-wrap gap-x-5 gap-y-1'>
									{(
										[
											['объектов', analysis.structure.objects],
											['массивов', analysis.structure.arrays],
											['строк', analysis.structure.strings],
											['чисел', analysis.structure.numbers],
											['булевых', analysis.structure.booleans],
											['null', analysis.structure.nulls],
											['ключей всего', analysis.structure.totalKeys]
										] as [string, number][]
									).map(([label, value]) => (
										<span key={label} className='text-muted-foreground'>
											<span className='font-mono text-foreground'>{value}</span>{' '}
											{label}
										</span>
									))}
								</div>
							</div>
						) : (
							<pre className='font-mono text-xs leading-relaxed whitespace-pre-wrap'>
								{output}
							</pre>
						)}
					</div>
				</div>

				{/* Полоса параметров и примеров. */}
				<div className={toolFooterBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						<span className='mr-1 text-sm text-muted-foreground'>Отступ</span>
						{(
							[
								['2', '2'],
								['4', '4'],
								['\t', 'таб']
							] as [string, string][]
						).map(([value, label]) => (
							<button
								key={value}
								type='button'
								onClick={() => setIndentSize(value)}
								aria-pressed={indentSize === value}
								className={toolPill(indentSize === value, 'font-mono')}
							>
								{label}
							</button>
						))}
					</div>

					<div className='flex flex-wrap items-center gap-1.5'>
						<span className='mr-1 text-sm text-muted-foreground'>Примеры</span>
						{JSON_EXAMPLES.map((example, index) => (
							<button
								key={index}
								type='button'
								onClick={() => loadExample(example.data)}
								className={toolPill(false)}
							>
								{example.name}
							</button>
						))}
					</div>
				</div>
			</Card>

			<ToolScreenshot slug='json-tools' />
			<JsonToolsSeo />
		</WidgetSEOWrapper>
	)
}
