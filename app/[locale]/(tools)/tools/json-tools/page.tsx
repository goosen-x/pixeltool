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
	Minimize2,
	Maximize2,
	Braces,
	AlertCircle,
	Info,
	Code2,
	Settings2
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { WidgetLayout } from '@/components/widgets/WidgetLayout'
import { WidgetSection } from '@/components/widgets/WidgetSection'
import { WidgetInput } from '@/components/widgets/WidgetInput'
import { WidgetOutput } from '@/components/widgets/WidgetOutput'
import { useTranslations } from 'next-intl'
import {
	useWidgetKeyboard,
	editorShortcuts
} from '@/lib/hooks/useWidgetKeyboard'

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
	const t = useTranslations('widgets.jsonTools')
	const [input, setInput] = useState('')
	const [analysis, setAnalysis] = useState<JSONAnalysis | null>(null)
	const [indentSize, setIndentSize] = useState('2')
	const [activeTab, setActiveTab] = useState('formatted')

	// Keyboard shortcuts
	useWidgetKeyboard({
		widgetId: 'json-tools',
		shortcuts: [
			{
				key: 'f',
				alt: true,
				description: 'Format JSON',
				action: () => {
					if (input.trim()) {
						analyzeJSON(input)
						setActiveTab('formatted')
					}
				}
			},
			{
				key: 'm',
				primary: true,
				description: 'Minify JSON',
				action: () => {
					if (input.trim()) {
						analyzeJSON(input)
						setActiveTab('minified')
					}
				}
			},
			{
				key: 'c',
				alt: true,
				description: 'Copy result',
				action: () => {
					if (analysis && analysis.isValid) {
						const text =
							activeTab === 'formatted'
								? analysis.formatted!
								: analysis.minified!
						handleCopy(
							text,
							`${activeTab === 'formatted' ? 'Formatted' : 'Minified'} JSON`
						)
					}
				}
			},
			{
				key: 'd',
				primary: true,
				description: 'Download result',
				action: () => {
					if (analysis && analysis.isValid) {
						const text =
							activeTab === 'formatted'
								? analysis.formatted!
								: analysis.minified!
						handleDownload(text, `${activeTab}.json`)
					}
				}
			},
			{
				key: 'k',
				alt: true,
				description: 'Clear input',
				action: () => setInput('')
			}
		]
	})
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
		<WidgetLayout>
			<div className='grid gap-6 lg:grid-cols-2'>
				{/* Input Section */}
				<WidgetSection icon={Code2} title={t('sections.input')}>
					<div className='space-y-4'>
						<WidgetInput label='JSON Input' className='h-full'>
							<Textarea
								value={input}
								onChange={e => setInput(e.target.value)}
								placeholder='Paste your JSON here...'
								className='min-h-[300px] font-mono text-sm'
								spellCheck={false}
							/>
						</WidgetInput>

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
												Valid JSON
											</span>
										</>
									) : (
										<>
											<XCircle className='h-4 w-4 text-red-600 dark:text-red-400' />
											<span className='text-sm font-medium text-red-700 dark:text-red-300'>
												Invalid JSON
											</span>
										</>
									)}
								</div>
								{analysis.error && (
									<div className='mt-2 text-sm text-red-600 dark:text-red-400'>
										<p className='font-mono'>{analysis.error.message}</p>
										{analysis.error.line && analysis.error.column && (
											<p className='mt-1'>
												Line {analysis.error.line}, Column{' '}
												{analysis.error.column}
											</p>
										)}
									</div>
								)}
							</div>
						)}

						<div className='flex items-center gap-2 mt-4'>
							<Button
								variant='outline'
								size='sm'
								onClick={() => setInput('')}
								disabled={!input}
							>
								Clear
							</Button>
							<label>
								<Button variant='outline' size='sm' asChild>
									<span>
										<Upload className='h-4 w-4 mr-2' />
										Upload
									</span>
								</Button>
								<input
									type='file'
									accept='.json'
									onChange={handleFileUpload}
									aria-label={t('uploadJSON')}
									className='hidden'
								/>
							</label>
						</div>

						{/* Examples */}
						<div className='space-y-2'>
							<Label className='text-sm text-muted-foreground'>Examples</Label>
							<div className='grid grid-cols-2 gap-2'>
								{JSON_EXAMPLES.map((example, index) => (
									<Button
										key={index}
										variant='outline'
										size='sm'
										onClick={() => loadExample(example.data)}
										className='justify-start text-xs'
									>
										<FileText className='h-3 w-3 mr-1' />
										{example.name}
									</Button>
								))}
							</div>
						</div>
					</div>
				</WidgetSection>

				{/* Output Section */}
				<WidgetSection icon={Braces} title={t('sections.output')}>
					{analysis && analysis.isValid ? (
						<Tabs
							value={activeTab}
							onValueChange={setActiveTab}
							className='h-full'
						>
							<TabsList className='grid w-full grid-cols-3'>
								<TabsTrigger value='formatted'>
									<Maximize2 className='h-4 w-4 mr-2' />
									Formatted
								</TabsTrigger>
								<TabsTrigger value='minified'>
									<Minimize2 className='h-4 w-4 mr-2' />
									Minified
								</TabsTrigger>
								<TabsTrigger value='analysis'>
									<Info className='h-4 w-4 mr-2' />
									Analysis
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
										Copy
									</Button>
									<Button
										variant='outline'
										size='sm'
										onClick={() =>
											handleDownload(analysis.formatted!, 'formatted.json')
										}
									>
										<Download className='h-4 w-4 mr-2' />
										Download
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
										Copy
									</Button>
									<Button
										variant='outline'
										size='sm'
										onClick={() =>
											handleDownload(analysis.minified!, 'minified.json')
										}
									>
										<Download className='h-4 w-4 mr-2' />
										Download
									</Button>
								</div>
							</TabsContent>

							<TabsContent value='analysis' className='space-y-4'>
								<div className='space-y-4'>
									{/* Size Analysis */}
									<div className='p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/50'>
										<h4 className='font-medium text-sm mb-3'>Size Analysis</h4>
										<div className='space-y-2'>
											<div className='flex justify-between items-center'>
												<span className='text-sm text-muted-foreground'>
													Original
												</span>
												<Badge variant='secondary'>
													{formatBytes(analysis.size.original)}
												</Badge>
											</div>
											<div className='flex justify-between items-center'>
												<span className='text-sm text-muted-foreground'>
													Formatted
												</span>
												<Badge variant='secondary'>
													{formatBytes(analysis.size.formatted)}
												</Badge>
											</div>
											<div className='flex justify-between items-center'>
												<span className='text-sm text-muted-foreground'>
													Minified
												</span>
												<Badge variant='secondary'>
													{formatBytes(analysis.size.minified)}
												</Badge>
											</div>
											<div className='flex justify-between items-center pt-2 border-t'>
												<span className='text-sm font-medium'>Compression</span>
												<Badge className='bg-gradient-to-r from-primary to-accent text-white'>
													{Math.round(
														(1 -
															analysis.size.minified / analysis.size.original) *
															100
													)}
													%
												</Badge>
											</div>
										</div>
									</div>

									{/* Structure Analysis */}
									<div className='p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/50'>
										<h4 className='font-medium text-sm mb-3'>
											Structure Analysis
										</h4>
										<div className='grid grid-cols-2 gap-3'>
											<div className='flex justify-between items-center'>
												<span className='text-sm text-muted-foreground'>
													Objects
												</span>
												<Badge variant='outline'>
													{analysis.structure.objects}
												</Badge>
											</div>
											<div className='flex justify-between items-center'>
												<span className='text-sm text-muted-foreground'>
													Arrays
												</span>
												<Badge variant='outline'>
													{analysis.structure.arrays}
												</Badge>
											</div>
											<div className='flex justify-between items-center'>
												<span className='text-sm text-muted-foreground'>
													Strings
												</span>
												<Badge variant='outline'>
													{analysis.structure.strings}
												</Badge>
											</div>
											<div className='flex justify-between items-center'>
												<span className='text-sm text-muted-foreground'>
													Numbers
												</span>
												<Badge variant='outline'>
													{analysis.structure.numbers}
												</Badge>
											</div>
											<div className='flex justify-between items-center'>
												<span className='text-sm text-muted-foreground'>
													Booleans
												</span>
												<Badge variant='outline'>
													{analysis.structure.booleans}
												</Badge>
											</div>
											<div className='flex justify-between items-center'>
												<span className='text-sm text-muted-foreground'>
													Nulls
												</span>
												<Badge variant='outline'>
													{analysis.structure.nulls}
												</Badge>
											</div>
											<div className='flex justify-between items-center col-span-2 pt-2 border-t'>
												<span className='text-sm text-muted-foreground'>
													Total Keys
												</span>
												<Badge variant='outline'>
													{analysis.structure.totalKeys}
												</Badge>
											</div>
											<div className='flex justify-between items-center col-span-2'>
												<span className='text-sm text-muted-foreground'>
													Max Depth
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
						<div className='flex items-center justify-center h-[400px] text-muted-foreground'>
							<div className='text-center space-y-3'>
								<Braces className='h-12 w-12 mx-auto opacity-20' />
								<p className='text-sm'>
									{analysis?.error
										? 'Fix JSON errors to see output'
										: 'Enter JSON to see output'}
								</p>
							</div>
						</div>
					)}
				</WidgetSection>
			</div>

			{/* Settings Section */}
			<WidgetSection
				icon={Settings2}
				title={t('sections.settings')}
				className='mt-6'
			>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
					<WidgetInput label='Indent Size'>
						<Select value={indentSize} onValueChange={setIndentSize}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='2'>2 spaces</SelectItem>
								<SelectItem value='4'>4 spaces</SelectItem>
								<SelectItem value='\t'>Tab</SelectItem>
							</SelectContent>
						</Select>
					</WidgetInput>
				</div>
			</WidgetSection>
		</WidgetLayout>
	)
}
