'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
	Copy,
	Check,
	Download,
	ArrowRightLeft,
	Lightbulb,
	Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'

// Режим «встроенный» удалён: он рендерился той же функцией, что и
// «унифицированный», то есть был третьим пунктом списка без своего вида.
type DiffType = 'unified' | 'side-by-side'
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
	const [copied, setCopied] = useState(false)

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
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
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
	}

	const swapTexts = () => {
		const temp = originalText
		setOriginalText(modifiedText)
		setModifiedText(temp)
	}

	const clearAll = () => {
		setOriginalText('')
		setModifiedText('')
		setDiffResult(null)
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
		<>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: как показывать различия и что сделать с
				    результатом. Режим раньше жил в выпадающем списке посреди
				    статистики — рядом с числами, но управлял видом ниже. */}
				<div className={toolBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						{(
							[
								['unified', 'Одним потоком'],
								['side-by-side', 'Бок о бок']
							] as [DiffType, string][]
						).map(([value, label]) => (
							<button
								key={value}
								type='button'
								onClick={() => setDiffType(value)}
								aria-pressed={diffType === value}
								className={toolPill(diffType === value)}
							>
								{label}
							</button>
						))}
					</div>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={loadSampleTexts}
							title='Подставить пример'
							className={toolIconButton}
						>
							<Lightbulb className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={swapTexts}
							title='Поменять тексты местами'
							className={toolIconButton}
						>
							<ArrowRightLeft className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={copyDiffToClipboard}
							disabled={!diffResult}
							title='Скопировать патч'
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
							onClick={downloadDiff}
							disabled={!diffResult}
							title='Скачать патч'
							className={toolIconButton}
						>
							<Download className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={clearAll}
							disabled={!originalText && !modifiedText}
							title='Очистить'
							className={toolIconButton}
						>
							<Trash2 className='h-4 w-4' />
						</Button>
					</div>
				</div>

				<div className='grid lg:grid-cols-2'>
					<Textarea
						value={originalText}
						onChange={e => setOriginalText(e.target.value)}
						placeholder='Исходный текст'
						spellCheck={false}
						aria-label='Исходный текст'
						className='min-h-[16rem] resize-none rounded-none border-0 px-5 py-6 font-mono text-base focus-visible:ring-0 sm:px-6 md:text-sm lg:border-r'
					/>
					<Textarea
						value={modifiedText}
						onChange={e => setModifiedText(e.target.value)}
						placeholder='Изменённый текст'
						spellCheck={false}
						aria-label='Изменённый текст'
						className='min-h-[16rem] resize-none rounded-none border-0 border-t px-5 py-6 font-mono text-base focus-visible:ring-0 sm:px-6 md:text-sm lg:border-t-0'
					/>
				</div>

				{/* Полоса сравнения: чем пренебречь при сличении и что получилось. */}
				<div className={toolFooterBar}>
					<button
						type='button'
						onClick={() => setIgnoreWhitespace(!ignoreWhitespace)}
						aria-pressed={ignoreWhitespace}
						className={toolPill(ignoreWhitespace)}
					>
						без учёта пробелов
					</button>
					<button
						type='button'
						onClick={() => setIgnoreCase(!ignoreCase)}
						aria-pressed={ignoreCase}
						className={toolPill(ignoreCase)}
					>
						без учёта регистра
					</button>
					<button
						type='button'
						onClick={() => setShowLineNumbers(!showLineNumbers)}
						aria-pressed={showLineNumbers}
						className={toolPill(showLineNumbers)}
					>
						номера строк
					</button>

					{diffResult && (
						<div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground sm:ml-auto'>
							<span className='font-mono text-green-600 dark:text-green-400'>
								+{diffResult.stats.additions}
							</span>
							<span className='font-mono text-red-600 dark:text-red-400'>
								−{diffResult.stats.deletions}
							</span>
							<span className='font-mono text-yellow-600 dark:text-yellow-500'>
								~{diffResult.stats.modifications}
							</span>
							<span>всего {diffResult.stats.total}</span>
						</div>
					)}
				</div>

				<div className='max-h-[32rem] overflow-auto border-t px-5 py-6 sm:px-6'>
					{diffResult ? (
						diffType === 'side-by-side' ? (
							renderSideBySideDiff()
						) : (
							renderUnifiedDiff()
						)
					) : (
						<p className='py-10 text-center text-sm text-muted-foreground'>
							{isProcessing
								? 'Сравниваем…'
								: 'Вставьте два текста — различия появятся здесь'}
						</p>
					)}
				</div>
			</Card>

			<div className='mt-6 space-y-3 text-sm text-muted-foreground'>
				<p>
					Сравнение идёт по строкам: строка, которой нет во втором тексте,
					считается удалённой, новая — добавленной, а изменённая подсвечивается
					жёлтым. Всё считается прямо в браузере, тексты никуда не отправляются.
				</p>
				<p>
					«Без учёта пробелов» полезно, когда отличается только форматирование
					(отступы, переносы), а «без учёта регистра» — когда важен смысл, а не
					то, с какой буквы написано слово. Результат можно забрать кнопкой
					скачивания в виде патча.
				</p>
			</div>
		</>
	)
}
