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
import {
	GitBranch,
	Copy,
	RefreshCw,
	Download,
	ArrowRightLeft,
	FileText,
	Eye,
	EyeOff,
	Settings,
	Info
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type DiffType = 'unified' | 'side-by-side' | 'inline'
type ChangeType = 'add' | 'delete' | 'modify' | 'equal'

interface DiffLine {
	type: ChangeType
	oldLine?: number
	newLine?: number
	content: string
	isHighlighted?: boolean
}

interface DiffResult {
	lines: DiffLine[]
	stats: {
		additions: number
		deletions: number
		modifications: number
		total: number
	}
}

export default function TextDiffToolPage() {
	const [originalText, setOriginalText] = useState('')
	const [modifiedText, setModifiedText] = useState('')
	const [diffType, setDiffType] = useState<DiffType>('side-by-side')
	const [diffResult, setDiffResult] = useState<DiffResult | null>(null)
	const [ignoreWhitespace, setIgnoreWhitespace] = useState(false)
	const [ignoreCase, setIgnoreCase] = useState(false)
	const [showLineNumbers, setShowLineNumbers] = useState(true)
	const [isProcessing, setIsProcessing] = useState(false)

	// Auto-diff when text changes
	useEffect(() => {
		if (originalText || modifiedText) {
			const timer = setTimeout(() => {
				calculateDiff()
			}, 500)
			return () => clearTimeout(timer)
		} else {
			setDiffResult(null)
		}
	}, [originalText, modifiedText, ignoreWhitespace, ignoreCase])

	const calculateDiff = async () => {
		setIsProcessing(true)

		setTimeout(() => {
			try {
				const result = computeDiff(originalText, modifiedText)
				setDiffResult(result)
			} catch (error) {
				toast.error('Ошибка при сравнении текстов')
				console.error('Diff calculation error:', error)
			} finally {
				setIsProcessing(false)
			}
		}, 100)
	}

	const computeDiff = (original: string, modified: string): DiffResult => {
		let originalLines = original.split('\n')
		let modifiedLines = modified.split('\n')

		// Apply filters
		if (ignoreWhitespace) {
			originalLines = originalLines.map(line => line.trim())
			modifiedLines = modifiedLines.map(line => line.trim())
		}

		if (ignoreCase) {
			originalLines = originalLines.map(line => line.toLowerCase())
			modifiedLines = modifiedLines.map(line => line.toLowerCase())
		}

		const diffLines: DiffLine[] = []
		let additions = 0
		let deletions = 0
		let modifications = 0

		// Simple diff algorithm (Myers algorithm would be better but more complex)
		const maxLines = Math.max(originalLines.length, modifiedLines.length)

		for (let i = 0; i < maxLines; i++) {
			const originalLine = originalLines[i]
			const modifiedLine = modifiedLines[i]

			if (originalLine === undefined) {
				// Addition
				diffLines.push({
					type: 'add',
					newLine: i + 1,
					content: modifiedLine
				})
				additions++
			} else if (modifiedLine === undefined) {
				// Deletion
				diffLines.push({
					type: 'delete',
					oldLine: i + 1,
					content: originalLine
				})
				deletions++
			} else if (originalLine === modifiedLine) {
				// Equal
				diffLines.push({
					type: 'equal',
					oldLine: i + 1,
					newLine: i + 1,
					content: originalLine
				})
			} else {
				// Modification
				diffLines.push({
					type: 'delete',
					oldLine: i + 1,
					content: originalLine
				})
				diffLines.push({
					type: 'add',
					newLine: i + 1,
					content: modifiedLine
				})
				modifications++
			}
		}

		return {
			lines: diffLines,
			stats: {
				additions,
				deletions,
				modifications,
				total: additions + deletions + modifications
			}
		}
	}

	const copyDiffToClipboard = () => {
		if (!diffResult) return

		const unifiedDiff = generateUnifiedDiff(diffResult.lines)
		navigator.clipboard.writeText(unifiedDiff)
		toast.success('Diff скопирован в буфер обмена!')
	}

	const generateUnifiedDiff = (lines: DiffLine[]): string => {
		const result = ['--- Исходный текст', '+++ Измененный текст', '']

		lines.forEach(line => {
			switch (line.type) {
				case 'add':
					result.push(`+${line.content}`)
					break
				case 'delete':
					result.push(`-${line.content}`)
					break
				case 'equal':
					result.push(` ${line.content}`)
					break
			}
		})

		return result.join('\n')
	}

	const downloadDiff = () => {
		if (!diffResult) return

		const unifiedDiff = generateUnifiedDiff(diffResult.lines)
		const blob = new Blob([unifiedDiff], { type: 'text/plain' })
		const url = URL.createObjectURL(blob)

		const a = document.createElement('a')
		a.href = url
		a.download = 'diff.patch'
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		URL.revokeObjectURL(url)

		toast.success('Diff сохранен как файл')
	}

	const swapTexts = () => {
		const temp = originalText
		setOriginalText(modifiedText)
		setModifiedText(temp)
		toast.success('Тексты поменяны местами')
	}

	const clearAll = () => {
		setOriginalText('')
		setModifiedText('')
		setDiffResult(null)
		toast.success('Все очищено')
	}

	const loadSampleTexts = () => {
		const sample1 = `function hello() {
    console.log("Hello World");
    return true;
}`

		const sample2 = `function hello(name) {
    console.log("Hello " + name);
    console.log("Welcome!");
    return false;
}`

		setOriginalText(sample1)
		setModifiedText(sample2)
		toast.success('Загружены примеры текстов')
	}

	const getDiffLineClass = (type: ChangeType): string => {
		switch (type) {
			case 'add':
				return 'bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500'
			case 'delete':
				return 'bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500'
			case 'modify':
				return 'bg-yellow-50 dark:bg-yellow-950/20 border-l-4 border-yellow-500'
			default:
				return 'bg-background'
		}
	}

	const getDiffTextClass = (type: ChangeType): string => {
		switch (type) {
			case 'add':
				return 'text-green-800 dark:text-green-200'
			case 'delete':
				return 'text-red-800 dark:text-red-200'
			case 'modify':
				return 'text-yellow-800 dark:text-yellow-200'
			default:
				return 'text-foreground'
		}
	}

	const renderUnifiedDiff = () => {
		if (!diffResult) return null

		return (
			<div className='space-y-1 font-mono text-sm'>
				{diffResult.lines.map((line, index) => (
					<div
						key={index}
						className={cn('p-2 rounded', getDiffLineClass(line.type))}
					>
						{showLineNumbers && (
							<span className='inline-block w-16 text-muted-foreground mr-4'>
								{line.oldLine || line.newLine || ''}
							</span>
						)}
						<span className={getDiffTextClass(line.type)}>
							{line.type === 'add' && '+ '}
							{line.type === 'delete' && '- '}
							{line.type === 'equal' && '  '}
							{line.content}
						</span>
					</div>
				))}
			</div>
		)
	}

	const renderSideBySideDiff = () => {
		if (!diffResult) return null

		return (
			<div className='grid grid-cols-2 gap-4'>
				<div>
					<h4 className='font-medium mb-2 text-red-600 dark:text-red-400'>
						Исходный текст
					</h4>
					<div className='space-y-1 font-mono text-sm'>
						{originalText.split('\n').map((line, index) => (
							<div key={index} className='p-2 bg-muted/30 rounded'>
								{showLineNumbers && (
									<span className='inline-block w-12 text-muted-foreground mr-4'>
										{index + 1}
									</span>
								)}
								<span>{line}</span>
							</div>
						))}
					</div>
				</div>

				<div>
					<h4 className='font-medium mb-2 text-green-600 dark:text-green-400'>
						Измененный текст
					</h4>
					<div className='space-y-1 font-mono text-sm'>
						{modifiedText.split('\n').map((line, index) => (
							<div key={index} className='p-2 bg-muted/30 rounded'>
								{showLineNumbers && (
									<span className='inline-block w-12 text-muted-foreground mr-4'>
										{index + 1}
									</span>
								)}
								<span>{line}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='max-w-7xl mx-auto space-y-6'>
			{/* Input Section */}
			<Card className='p-6'>
				<div className='grid lg:grid-cols-2 gap-6'>
					<div>
						<Label htmlFor='original-text' className='mb-2 block'>
							Исходный текст
						</Label>
						<Textarea
							id='original-text'
							value={originalText}
							onChange={e => setOriginalText(e.target.value)}
							placeholder='Вставьте исходный текст здесь...'
							className='min-h-64 font-mono'
						/>
					</div>

					<div>
						<Label htmlFor='modified-text' className='mb-2 block'>
							Измененный текст
						</Label>
						<Textarea
							id='modified-text'
							value={modifiedText}
							onChange={e => setModifiedText(e.target.value)}
							placeholder='Вставьте измененный текст здесь...'
							className='min-h-64 font-mono'
						/>
					</div>
				</div>

				{/* Controls */}
				<div className='flex items-center gap-4 mt-6 flex-wrap'>
					<div className='flex items-center gap-2'>
						<Settings className='w-4 h-4' />
						<span className='text-sm font-medium'>Настройки:</span>
					</div>

					<Button
						onClick={() => setIgnoreWhitespace(!ignoreWhitespace)}
						variant={ignoreWhitespace ? 'default' : 'outline'}
						size='sm'
					>
						Игнорировать пробелы
					</Button>

					<Button
						onClick={() => setIgnoreCase(!ignoreCase)}
						variant={ignoreCase ? 'default' : 'outline'}
						size='sm'
					>
						Игнорировать регистр
					</Button>

					<Button
						onClick={() => setShowLineNumbers(!showLineNumbers)}
						variant='outline'
						size='sm'
					>
						{showLineNumbers ? (
							<EyeOff className='w-4 h-4 mr-1' />
						) : (
							<Eye className='w-4 h-4 mr-1' />
						)}
						Номера строк
					</Button>

					<div className='flex flex-wrap items-center gap-2 ml-auto'>
						<Button onClick={loadSampleTexts} variant='outline' size='sm'>
							<FileText className='w-4 h-4 mr-2' />
							Пример
						</Button>
						<Button onClick={swapTexts} variant='outline' size='sm'>
							<ArrowRightLeft className='w-4 h-4 mr-2' />
							Поменять
						</Button>
						<Button onClick={clearAll} variant='outline' size='sm'>
							<RefreshCw className='w-4 h-4 mr-2' />
							Очистить
						</Button>
					</div>
				</div>
			</Card>

			{/* Stats */}
			{diffResult && (
				<Card className='p-4'>
					<div className='flex flex-wrap gap-2 items-center justify-between'>
						<div className='flex flex-wrap items-center gap-4'>
							<Badge variant='outline' className='text-green-600'>
								+{diffResult.stats.additions} добавлений
							</Badge>
							<Badge variant='outline' className='text-red-600'>
								-{diffResult.stats.deletions} удалений
							</Badge>
							<Badge variant='outline' className='text-yellow-600'>
								{diffResult.stats.modifications} изменений
							</Badge>
							<Badge variant='outline'>
								Всего: {diffResult.stats.total} изменений
							</Badge>
						</div>

						<div className='flex flex-wrap items-center gap-2'>
							<Select
								value={diffType}
								onValueChange={(value: DiffType) => setDiffType(value)}
							>
								<SelectTrigger className='w-48'>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='unified'>Унифицированный</SelectItem>
									<SelectItem value='side-by-side'>Бок о бок</SelectItem>
									<SelectItem value='inline'>Встроенный</SelectItem>
								</SelectContent>
							</Select>

							<Button onClick={copyDiffToClipboard} variant='outline' size='sm'>
								<Copy className='w-4 h-4 mr-2' />
								Копировать
							</Button>

							<Button onClick={downloadDiff} variant='outline' size='sm'>
								<Download className='w-4 h-4 mr-2' />
								Скачать
							</Button>
						</div>
					</div>
				</Card>
			)}

			{/* Results */}
			{diffResult && (
				<Card className='p-6'>
					<h3 className='font-semibold mb-4 flex items-center gap-2'>
						<GitBranch className='w-5 h-5' />
						Результат сравнения ({diffType})
					</h3>

					<div className='max-h-96 overflow-auto border rounded-lg p-4'>
						{diffType === 'side-by-side' && renderSideBySideDiff()}
						{(diffType === 'unified' || diffType === 'inline') &&
							renderUnifiedDiff()}
					</div>
				</Card>
			)}

			{!diffResult && !isProcessing && (
				<Card className='p-6'>
					<div className='flex items-center justify-center h-40 text-muted-foreground'>
						<div className='text-center'>
							<GitBranch className='w-12 h-12 mx-auto mb-3 opacity-50' />
							<p>Введите тексты для сравнения</p>
							<p className='text-sm mt-2'>
								Результат будет показан автоматически
							</p>
						</div>
					</div>
				</Card>
			)}

			{/* Info */}
			<Card className='p-6 bg-muted/50'>
				<h3 className='font-semibold mb-4 flex items-center gap-2'>
					<Info className='w-4 h-4' />О инструменте сравнения
				</h3>
				<div className='grid md:grid-cols-3 gap-6 text-sm'>
					<div>
						<h4 className='font-medium mb-2'>Возможности</h4>
						<ul className='text-muted-foreground space-y-1'>
							<li>• Три режима отображения различий</li>
							<li>• Игнорирование пробелов и регистра</li>
							<li>• Статистика изменений</li>
							<li>• Экспорт в формате patch</li>
						</ul>
					</div>
					<div>
						<h4 className='font-medium mb-2'>Форматы вывода</h4>
						<ul className='text-muted-foreground space-y-1'>
							<li>
								• <strong>Унифицированный</strong> - классический diff формат
							</li>
							<li>
								• <strong>Бок о бок</strong> - параллельное сравнение
							</li>
							<li>
								• <strong>Встроенный</strong> - изменения в одном потоке
							</li>
						</ul>
					</div>
					<div>
						<h4 className='font-medium mb-2'>Применение</h4>
						<ul className='text-muted-foreground space-y-1'>
							<li>• Сравнение версий кода</li>
							<li>• Проверка изменений в документах</li>
							<li>• Анализ различий в конфигурациях</li>
							<li>• Генерация патчей</li>
						</ul>
					</div>
				</div>
			</Card>
		</div>
	)
}
