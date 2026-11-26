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
import { dump as dumpYAML } from 'js-yaml'
import {
	analyzeStructure,
	parseDocument,
	type JsonStructure,
	type ParseError
} from '@/lib/json-tools'
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
interface JSONAnalysis {
	isValid: boolean
	error?: ParseError
	warnings: string[]
	formatted?: string
	minified?: string
	yaml?: string
	/** Что распознали на входе: JSON или YAML. */
	sourceFormat?: 'json' | 'yaml'
	size: {
		original: number
		formatted: number
		minified: number
	}
	structure: JsonStructure
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

	const analyzeJSON = (jsonString: string) => {
		const parsed = parseDocument(jsonString)
		const originalSize = new TextEncoder().encode(jsonString).length

		if (!parsed.ok) {
			setAnalysis({
				isValid: false,
				error: parsed.error,
				warnings: [],
				size: { original: originalSize, formatted: 0, minified: 0 },
				structure: analyzeStructure(undefined)
			})
			return
		}

		// Select отдаёт '\t' для табов: parseInt вернул бы NaN и убил отступы.
		const indent: string | number =
			indentSize === '\t' ? '\t' : parseInt(indentSize)
		const formatted = JSON.stringify(parsed.data, null, indent)
		const minified = JSON.stringify(parsed.data)
		const yaml = dumpYAML(parsed.data, {
			indent: indentSize === '\t' ? 2 : parseInt(indentSize)
		})

		setAnalysis({
			isValid: true,
			warnings: parsed.warnings,
			formatted,
			minified,
			yaml,
			sourceFormat: parsed.format,
			size: {
				original: originalSize,
				formatted: new TextEncoder().encode(formatted).length,
				minified: new TextEncoder().encode(minified).length
			},
			structure: analyzeStructure(parsed.data)
		})
	}

	const handleCopy = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch {
			// Буфер недоступен (http, запрет браузера): кнопка просто не мигнёт.
		}
	}

	const handleDownload = (text: string, filename: string) => {
		const type = filename.endsWith('.yaml')
			? 'application/yaml'
			: 'application/json'
		const blob = new Blob([text], { type })
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
							{analysis.isValid
								? analysis.sourceFormat === 'yaml'
									? 'YAML распознан'
									: 'JSON корректен'
								: analysis.error?.format === 'yaml'
									? 'ошибка в YAML'
									: 'ошибка в JSON'}
						</span>
					)}

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => fileInputRef.current?.click()}
							title='Загрузить файл .json или .yaml'
							className={toolIconButton}
						>
							<Upload className='h-4 w-4' />
						</Button>
						<input
							ref={fileInputRef}
							type='file'
							accept='.json,.yaml,.yml,.txt,application/json'
							onChange={handleFileUpload}
							aria-label='Загрузить файл JSON или YAML'
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
						placeholder={
							'Вставьте JSON или YAML, например:\n{"name": "Анна", "age": 30}'
						}
						spellCheck={false}
						aria-label='Исходный документ'
						className='min-h-[14rem] resize-none rounded-none border-0 px-5 py-6 font-mono text-base focus-visible:ring-0 sm:px-6 md:text-sm lg:min-h-[22rem] lg:border-r'
					/>

					<div className='max-h-[30rem] min-h-[8rem] overflow-auto border-t px-5 py-6 sm:px-6 lg:min-h-[22rem] lg:border-t-0'>
						{!analysis ? (
							<p className='flex h-full items-center justify-center text-center text-sm text-muted-foreground'>
								Здесь появится результат или место ошибки
							</p>
						) : !analysis.isValid ? (
							<ErrorView error={analysis.error!} />
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
											['ключей всего', analysis.structure.totalKeys],
											['уровней вложенности', analysis.structure.maxDepth]
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
							<>
								{analysis.warnings.map(warning => (
									<p
										key={warning}
										className='mb-3 text-sm text-amber-700 dark:text-amber-400'
									>
										{warning}
									</p>
								))}
								<pre className='font-mono text-xs leading-relaxed whitespace-pre-wrap break-all'>
									{output}
								</pre>
							</>
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

/** Ошибка разбора: что не так и где, со строкой документа и указателем. */
function ErrorView({ error }: { error: ParseError }) {
	// Длинные однострочные JSON обрезаем вокруг ошибки, иначе указатель уедет за край.
	const radius = 40
	const from = Math.max(0, error.column - 1 - radius)
	// Таб шире пробела: заменяем, чтобы указатель стоял под нужным символом.
	const excerpt = error.lineText
		.slice(from, error.column - 1 + radius)
		.replace(/\t/g, ' ')
	const caret = error.column - 1 - from
	return (
		<div className='text-sm'>
			<p className='text-destructive'>{error.message}</p>
			<p className='mt-1 font-mono text-xs text-muted-foreground'>
				строка {error.line}, столбец {error.column}
			</p>
			{excerpt.trim() && (
				<pre className='mt-3 overflow-x-auto rounded-md bg-muted px-3 py-2 font-mono text-xs leading-relaxed'>
					{(from > 0 ? '…' : '') + excerpt}
					{'\n'}
					<span className='text-destructive'>
						{' '.repeat(caret + (from > 0 ? 1 : 0)) + '^'}
					</span>
				</pre>
			)}
		</div>
	)
}
