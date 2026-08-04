'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'

import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
	Copy,
	Check,
	FileJson,
	FileText,
	Lightbulb,
	Star,
	Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import {
	caseConfigs,
	categories,
	convertCase,
	getTextStats,
	type CaseType
} from '@/components/tools/text-case-converter'

/** Русские подписи к группам: в constants они на английском. */
const CATEGORY_LABELS: Record<keyof typeof categories, string> = {
	basic: 'Обычные',
	programming: 'Для кода',
	special: 'Игровые'
}

export default function TextCaseConverterPage() {
	const [input, setInput] = useState('')
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
	const [favorites, setFavorites] = useState<Set<CaseType>>(new Set())
	const [copiedCase, setCopiedCase] = useState<string | null>(null)
	const [copiedAll, setCopiedAll] = useState(false)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
		// Load favorites from localStorage
		const savedFavorites = localStorage.getItem('textCaseConverterFavorites')
		if (savedFavorites) {
			try {
				setFavorites(new Set(JSON.parse(savedFavorites)))
			} catch (error) {
				console.error('Failed to load favorites:', error)
			}
		}
	}, [])

	const toggleFavorite = useCallback((caseType: CaseType) => {
		setFavorites(prev => {
			const newFavorites = new Set(prev)
			if (newFavorites.has(caseType)) {
				newFavorites.delete(caseType)
			} else {
				newFavorites.add(caseType)
			}
			// Save to localStorage
			localStorage.setItem(
				'textCaseConverterFavorites',
				JSON.stringify(Array.from(newFavorites))
			)
			return newFavorites
		})
	}, [])

	const sortedCases = useMemo(() => {
		return Object.entries(caseConfigs)
			.filter(
				([, config]) =>
					!selectedCategory || config.category === selectedCategory
			)
			.sort(([aType], [bType]) => {
				const aIsFavorite = favorites.has(aType as CaseType)
				const bIsFavorite = favorites.has(bType as CaseType)

				if (aIsFavorite && !bIsFavorite) return -1
				if (!aIsFavorite && bIsFavorite) return 1

				return 0
			})
	}, [selectedCategory, favorites])

	const textStats = useMemo(() => getTextStats(input), [input])

	const loadExample = useCallback(() => {
		const examples = [
			'Съешь ещё этих мягких французских булок',
			'The Quick Brown Fox Jumps Over The Lazy Dog',
			'Название нового компонента интерфейса',
			'Transform Your Text in Multiple Formats',
			'Web Development Made Easy'
		]
		const randomExample = examples[Math.floor(Math.random() * examples.length)]
		setInput(randomExample)
	}, [])

	const exportAsJSON = useCallback(() => {
		const results: Record<string, string> = {}
		Object.keys(caseConfigs).forEach(caseType => {
			results[caseType] = convertCase(input, caseType as CaseType)
		})

		const dataStr = JSON.stringify(results, null, 2)
		const dataUri =
			'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)

		const linkElement = document.createElement('a')
		linkElement.setAttribute('href', dataUri)
		linkElement.setAttribute('download', 'text-case-conversions.json')
		linkElement.click()
	}, [input])

	const exportAsCSV = useCallback(() => {
		let csv = 'Case Type,Result\n'
		Object.entries(caseConfigs).forEach(([caseType]) => {
			const result = convertCase(input, caseType as CaseType)
			csv += `"${caseType}","${result.replace(/"/g, '""')}"\n`
		})

		const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)

		const linkElement = document.createElement('a')
		linkElement.setAttribute('href', dataUri)
		linkElement.setAttribute('download', 'text-case-conversions.csv')
		linkElement.click()
	}, [input])

	const copyAllResults = useCallback(() => {
		const results = Object.entries(caseConfigs)
			.map(
				([caseType]) =>
					`${caseType}: ${convertCase(input, caseType as CaseType)}`
			)
			.join('\n')

		navigator.clipboard.writeText(results)
		setCopiedAll(true)
		setTimeout(() => setCopiedAll(false), 2000)
	}, [input])

	const copyOne = (caseType: string, value: string) => {
		navigator.clipboard.writeText(value)
		setCopiedCase(caseType)
		setTimeout(() => setCopiedCase(null), 2000)
	}

	// Избранное лежит в localStorage: до гидратации порядок регистров на
	// сервере и клиенте разный, поэтому список ждёт монтирования.
	if (!mounted) {
		return (
			<Card className='overflow-hidden p-0'>
				<div className='h-14 border-b bg-muted/30' />
				<div className='h-40 animate-pulse bg-muted/20' />
			</Card>
		)
	}

	return (
		<Card className='overflow-hidden p-0'>
			{/* Верхняя полоса: группы регистров. Раньше это был ряд бейджей под
			    карточкой ввода — выглядел как подпись, а был фильтром. */}
			<div className={toolBar}>
				<div className='flex flex-wrap items-center gap-1.5'>
					<button
						type='button'
						onClick={() => setSelectedCategory(null)}
						aria-pressed={selectedCategory === null}
						className={toolPill(selectedCategory === null)}
					>
						Все
					</button>
					{Object.keys(categories).map(key => (
						<button
							key={key}
							type='button'
							onClick={() => setSelectedCategory(key)}
							aria-pressed={selectedCategory === key}
							className={toolPill(selectedCategory === key)}
						>
							{CATEGORY_LABELS[key as keyof typeof categories]}
						</button>
					))}
				</div>

				<div className='flex items-center gap-0.5 sm:ml-auto'>
					<Button
						size='icon'
						variant='ghost'
						onClick={loadExample}
						title='Подставить пример'
						className={toolIconButton}
					>
						<Lightbulb className='h-4 w-4' />
					</Button>
					<Button
						size='icon'
						variant='ghost'
						onClick={copyAllResults}
						disabled={!input}
						title='Скопировать все варианты'
						className={toolIconButton}
					>
						{copiedAll ? (
							<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
						) : (
							<Copy className='h-4 w-4' />
						)}
					</Button>
					<Button
						size='icon'
						variant='ghost'
						onClick={exportAsJSON}
						disabled={!input}
						title='Скачать JSON'
						className={toolIconButton}
					>
						<FileJson className='h-4 w-4' />
					</Button>
					<Button
						size='icon'
						variant='ghost'
						onClick={exportAsCSV}
						disabled={!input}
						title='Скачать CSV'
						className={toolIconButton}
					>
						<FileText className='h-4 w-4' />
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

			<Textarea
				value={input}
				onChange={e => setInput(e.target.value)}
				placeholder='Введите текст — все регистры пересчитаются сразу'
				autoFocus
				spellCheck={false}
				aria-label='Текст для преобразования'
				className='min-h-[7.5rem] resize-none rounded-none border-0 px-5 py-6 text-base focus-visible:ring-0 sm:px-6 md:text-sm'
			/>

			{/* Полоса статистики: те же цифры, что и в счётчике текста, но здесь
			    они попутные — за ними в этот тул не приходят. */}
			<div className={toolFooterBar}>
				{[
					['символов', textStats.characters],
					['без пробелов', textStats.charactersNoSpaces],
					['слов', textStats.words],
					['строк', textStats.lines],
					['предложений', textStats.sentences]
				].map(([label, value]) => (
					<span
						key={label as string}
						className='flex items-center gap-2 text-sm text-muted-foreground'
					>
						<span className='font-mono text-foreground tabular-nums'>
							{value}
						</span>
						{label}
					</span>
				))}
			</div>

			<div className='grid gap-px bg-border sm:grid-cols-2'>
				{sortedCases.map(([caseType]) => {
					const result = convertCase(input, caseType as CaseType)
					const isFavorite = favorites.has(caseType as CaseType)

					return (
						<div
							key={caseType}
							className='group flex items-start justify-between gap-3 bg-background px-5 py-3 sm:px-6'
						>
							<button
								type='button'
								onClick={() => copyOne(caseType, result)}
								disabled={!result}
								title='Скопировать'
								className='min-w-0 flex-1 cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
							>
								<span className='block font-mono text-xs text-muted-foreground'>
									{caseType}
								</span>
								<span className='mt-0.5 block font-mono text-sm break-all'>
									{result || (
										<span className='text-muted-foreground/60'>—</span>
									)}
								</span>
							</button>

							<span className='flex shrink-0 items-center gap-0.5'>
								<Button
									size='icon'
									variant='ghost'
									onClick={() => toggleFavorite(caseType as CaseType)}
									title={isFavorite ? 'Убрать из избранного' : 'В избранное'}
									className={cn(
										toolIconButton,
										'h-7 w-7',
										!isFavorite &&
											'opacity-0 group-hover:opacity-100 focus-visible:opacity-100'
									)}
								>
									<Star
										className={cn(
											'h-3.5 w-3.5',
											isFavorite && 'fill-current text-primary'
										)}
									/>
								</Button>
								{copiedCase === caseType ? (
									<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
								) : (
									<Copy className='h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100' />
								)}
							</span>
						</div>
					)
				})}
			</div>
		</Card>
	)
}
