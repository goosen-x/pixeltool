'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Info, BarChart3, Copy, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'

interface SpecificityResult {
	selector: string
	specificity: [number, number, number, number]
	specificityString: string
	weight: number
	parts: {
		inline: number
		ids: string[]
		classes: string[]
		attributes: string[]
		pseudoClasses: string[]
		elements: string[]
		pseudoElements: string[]
	}
}

export default function CSSSpecificityPage() {
	const [input, setInput] = useState('')
	const [results, setResults] = useState<SpecificityResult[]>([])
	const [sortBy, setSortBy] = useState<'order' | 'weight'>('order')

	const calculateSpecificity = (selector: string): SpecificityResult => {
		const parts = {
			inline: 0,
			ids: [] as string[],
			classes: [] as string[],
			attributes: [] as string[],
			pseudoClasses: [] as string[],
			elements: [] as string[],
			pseudoElements: [] as string[]
		}

		// Remove spaces around combinators
		let cleanSelector = selector
			.trim()
			.replace(/\s*([>+~])\s*/g, ' $1 ')
			.replace(/\s+/g, ' ')

		// Count inline styles (for display purposes only)
		if (cleanSelector.includes('style=')) {
			parts.inline = 1
		}

		// Remove pseudo-elements (they don't affect specificity calculation but we'll track them)
		const pseudoElementRegex = /::([\w-]+)/g
		let match
		while ((match = pseudoElementRegex.exec(cleanSelector)) !== null) {
			parts.pseudoElements.push(`::${match[1]}`)
		}
		cleanSelector = cleanSelector.replace(pseudoElementRegex, '')

		// Handle special pseudo-classes with their own specificity rules
		const additionalSpecificity = [0, 0, 0, 0]

		// Extract and handle :is(), :not(), :has(), :where()
		const functionalPseudoRegex =
			/:(is|not|has|where)\(([^()]+(?:\([^()]*\))*)\)/g
		const functionalPseudos: Array<{ type: string; content: string }> = []

		while ((match = functionalPseudoRegex.exec(cleanSelector)) !== null) {
			functionalPseudos.push({
				type: match[1],
				content: match[2]
			})
		}

		// Process each functional pseudo-class
		functionalPseudos.forEach(({ type, content }) => {
			if (type === 'where') {
				// :where() always has zero specificity
				parts.pseudoClasses.push(`:${type}`)
			} else if (type === 'is' || type === 'not') {
				// :is() and :not() take the specificity of their most specific argument
				parts.pseudoClasses.push(`:${type}`)
				const selectors = content.split(',').map(s => s.trim())
				let maxSpecificity = [0, 0, 0, 0]

				selectors.forEach(sel => {
					const subSpec = calculateSpecificity(sel)
					if (
						subSpec.weight >
						maxSpecificity[0] * 1000000 +
							maxSpecificity[1] * 10000 +
							maxSpecificity[2] * 100 +
							maxSpecificity[3]
					) {
						maxSpecificity = subSpec.specificity.slice() as [
							number,
							number,
							number,
							number
						]
					}
				})

				// Add the specificity of the most specific argument
				additionalSpecificity[1] += maxSpecificity[1]
				additionalSpecificity[2] += maxSpecificity[2]
				additionalSpecificity[3] += maxSpecificity[3]
			} else if (type === 'has') {
				// :has() counts as a pseudo-class
				parts.pseudoClasses.push(`:${type}`)
			}
		})

		// Remove functional pseudo-classes from the selector for further processing
		cleanSelector = cleanSelector.replace(functionalPseudoRegex, '')

		// Count IDs
		const idRegex = /#([\w-]+)/g
		while ((match = idRegex.exec(cleanSelector)) !== null) {
			parts.ids.push(`#${match[1]}`)
		}

		// Count classes
		const classRegex = /\.([\w-]+)/g
		while ((match = classRegex.exec(cleanSelector)) !== null) {
			parts.classes.push(`.${match[1]}`)
		}

		// Count attributes
		const attrRegex = /\[([^\]]+)\]/g
		while ((match = attrRegex.exec(cleanSelector)) !== null) {
			parts.attributes.push(`[${match[1]}]`)
		}

		// Count other pseudo-classes
		const pseudoClassRegex = /:([\w-]+)(?:\([^)]*\))?/g
		while ((match = pseudoClassRegex.exec(cleanSelector)) !== null) {
			// Skip functional pseudo-classes already handled
			if (!['not', 'is', 'has', 'where'].includes(match[1])) {
				parts.pseudoClasses.push(`:${match[1]}`)
			}
		}

		// Remove all the above to count remaining elements
		const elementsOnly = cleanSelector
			.replace(idRegex, '')
			.replace(classRegex, '')
			.replace(attrRegex, '')
			.replace(pseudoClassRegex, '')
			.replace(/[>+~]/g, '') // Remove combinators
			.trim()

		// Count elements
		if (elementsOnly) {
			const elementNames = elementsOnly.split(/\s+/).filter(Boolean)
			parts.elements.push(...elementNames)
		}

		// Calculate specificity [inline, IDs, classes/attributes/pseudo-classes, elements]
		const specificity: [number, number, number, number] = [
			parts.inline,
			parts.ids.length + additionalSpecificity[1],
			parts.classes.length +
				parts.attributes.length +
				parts.pseudoClasses.length +
				additionalSpecificity[2] -
				functionalPseudos.filter(p => p.type === 'where').length,
			parts.elements.length +
				parts.pseudoElements.length +
				additionalSpecificity[3]
		]

		// Calculate weight for sorting
		const weight =
			specificity[0] * 1000000 +
			specificity[1] * 10000 +
			specificity[2] * 100 +
			specificity[3]

		return {
			selector: selector.trim(),
			specificity,
			specificityString: specificity.join('-'),
			weight,
			parts
		}
	}

	const analyzeSelectors = () => {
		if (!input.trim()) {
			toast.error('Введите CSS селекторы для анализа')
			return
		}

		// Parse CSS to extract only selectors
		const lines = input.split('\n')
		const selectors: string[] = []
		let inRule = false
		let currentSelector = ''

		for (const line of lines) {
			const trimmed = line.trim()

			// Skip empty lines
			if (!trimmed) {
				continue
			}

			// Skip comments
			if (
				trimmed.startsWith('//') ||
				trimmed.startsWith('/*') ||
				trimmed.includes('*/')
			) {
				continue
			}

			// Check if we're entering a rule block
			if (trimmed.includes('{')) {
				inRule = true
				// Extract selector before the opening brace
				const selectorPart = trimmed.split('{')[0].trim()
				if (selectorPart) {
					selectors.push(selectorPart)
				}
			} else if (trimmed === '}' || trimmed.includes('}')) {
				// Exiting a rule block
				inRule = false
				currentSelector = ''
			} else if (!inRule) {
				// This is potentially a selector or part of a selector
				if (trimmed.endsWith(',')) {
					// Multi-line selector with comma
					selectors.push(trimmed.slice(0, -1).trim())
				} else {
					// Check if this line looks like a CSS property
					const looksLikeProperty =
						trimmed.includes(': ') ||
						trimmed.match(/^\d/) ||
						trimmed.match(
							/^(margin|padding|border|background|color|font|width|height|display|position|top|left|right|bottom)/i
						) ||
						trimmed.endsWith(';')

					if (!looksLikeProperty) {
						// This is a selector on its own line
						selectors.push(trimmed)
					}
				}
			}
		}

		// Remove duplicates and empty selectors
		const uniqueSelectors = [
			...new Set(selectors.filter(sel => sel.length > 0))
		]

		if (uniqueSelectors.length === 0) {
			toast.error('Селекторы не найдены')
			return
		}

		const newResults = uniqueSelectors.map(selector =>
			calculateSpecificity(selector)
		)

		// Sort results
		if (sortBy === 'weight') {
			newResults.sort((a, b) => b.weight - a.weight)
		}

		setResults(newResults)
		toast.success(`Проанализировано ${newResults.length} селекторов`)
	}

	const copyResults = () => {
		const text = results
			.map(
				r =>
					`${r.selector} - Specificity: ${r.specificityString} (Weight: ${r.weight})`
			)
			.join('\n')

		navigator.clipboard.writeText(text)
		toast.success('Скопировано в буфер обмена!')
	}

	const loadExample = () => {
		const example = `/* Example CSS selectors */
body
.header
#main-content
nav ul li a
.btn.btn-primary
input[type="text"]
a:hover
.card:nth-child(3)
#sidebar .widget h3
div.container > p::first-line
.nav-link:not(.active)
[data-theme="dark"] .header`

		setInput(example)
		toast.success('Пример загружен')
	}

	const getSpecificityColor = (weight: number) => {
		if (weight >= 10000) return 'text-red-600 dark:text-red-400'
		if (weight >= 100) return 'text-orange-600 dark:text-orange-400'
		if (weight >= 10) return 'text-yellow-600 dark:text-yellow-400'
		return 'text-green-600 dark:text-green-400'
	}

	return (
		<div className='space-y-6'>
			{/* Input Section */}
			<Card>
				<CardHeader className='pb-4'>
					<div className='flex items-center justify-between'>
						<CardTitle>Ввод CSS селекторов</CardTitle>
						<Button variant='outline' size='sm' onClick={loadExample}>
							Загрузить пример
						</Button>
					</div>
				</CardHeader>
				<CardContent className='space-y-4'>
					<Textarea
						placeholder={`Введите CSS селекторы или правила:\n\nbody\n.header#main-content\nnav ul li a\n.btn.btn-primary\ninput[type="text"]\na:hover\n.card:nth-child(3)\n#sidebar .widget h3`}
						value={input}
						onChange={e => setInput(e.target.value)}
						rows={8}
						className='font-mono text-sm resize-none'
					/>
					<div className='flex gap-3'>
						<Button onClick={analyzeSelectors} className='flex-1' size='lg'>
							<BarChart3 className='w-4 h-4 mr-2' />
							Анализировать специфичность
						</Button>
						<Button
							variant='outline'
							size='lg'
							onClick={() => {
								setInput('')
								setResults([])
								toast.success('Очищено')
							}}
						>
							<Trash2 className='w-4 h-4' />
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Results Section */}
			{results.length > 0 && (
				<Card>
					<CardHeader className='pb-4'>
						<div className='flex items-center justify-between'>
							<div>
								<CardTitle>Результаты анализа</CardTitle>
								<p className='text-sm text-muted-foreground mt-1'>
									Найдено селекторов: {results.length}
								</p>
							</div>
							<div className='flex gap-2'>
								<Button
									variant={sortBy === 'weight' ? 'default' : 'outline'}
									size='sm'
									onClick={() => {
										const newSort = sortBy === 'order' ? 'weight' : 'order'
										setSortBy(newSort)
										const sorted = [...results]
										if (newSort === 'weight') {
											sorted.sort((a, b) => b.weight - a.weight)
										}
										setResults(sorted)
										toast.success(
											newSort === 'weight'
												? 'Сортировка по весу'
												: 'Сортировка по порядку'
										)
									}}
								>
									{sortBy === 'order' ? 'Сортировать по весу' : 'По порядку'}
								</Button>
								<Button variant='outline' size='sm' onClick={copyResults}>
									<Copy className='w-4 h-4 mr-2' />
									Копировать
								</Button>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className='space-y-3 max-h-[600px] overflow-y-auto pr-2'>
							{results.map((result, index) => (
								<div
									key={index}
									className='p-4 border rounded-lg hover:border-primary/50 transition-colors space-y-3 bg-card'
								>
									{/* Selector and Specificity */}
									<div className='flex items-start justify-between gap-4'>
										<code className='text-sm font-mono break-all flex-1 pt-1'>
											{result.selector}
										</code>
										<div className='flex flex-col items-end gap-2 shrink-0'>
											<Badge
												variant='outline'
												className={cn(
													'font-mono text-base px-3 py-1',
													getSpecificityColor(result.weight)
												)}
											>
												{result.specificityString}
											</Badge>
											<span className='text-xs text-muted-foreground'>
												Вес: {result.weight}
											</span>
										</div>
									</div>

									{/* Breakdown of selector parts */}
									{(result.parts.inline > 0 ||
										result.parts.ids.length > 0 ||
										result.parts.classes.length > 0 ||
										result.parts.attributes.length > 0 ||
										result.parts.pseudoClasses.length > 0 ||
										result.parts.elements.length > 0 ||
										result.parts.pseudoElements.length > 0) && (
										<div className='flex flex-wrap gap-1.5'>
											{result.parts.inline > 0 && (
												<Badge
													variant='secondary'
													className='bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
												>
													inline style
												</Badge>
											)}
											{result.parts.ids.map((id, i) => (
												<Badge
													key={`id-${i}`}
													variant='secondary'
													className='font-mono bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
												>
													{id}
												</Badge>
											))}
											{result.parts.classes.map((cls, i) => (
												<Badge
													key={`class-${i}`}
													variant='secondary'
													className='font-mono bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
												>
													{cls}
												</Badge>
											))}
											{result.parts.attributes.map((attr, i) => (
												<Badge
													key={`attr-${i}`}
													variant='secondary'
													className='font-mono bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300'
												>
													{attr}
												</Badge>
											))}
											{result.parts.pseudoClasses.map((pc, i) => (
												<Badge
													key={`pc-${i}`}
													variant='secondary'
													className='font-mono bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
												>
													{pc}
												</Badge>
											))}
											{result.parts.elements.map((el, i) => (
												<Badge
													key={`el-${i}`}
													variant='secondary'
													className='font-mono bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
												>
													{el}
												</Badge>
											))}
											{result.parts.pseudoElements.map((pe, i) => (
												<Badge
													key={`pe-${i}`}
													variant='secondary'
													className='font-mono bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
												>
													{pe}
												</Badge>
											))}
										</div>
									)}
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Info Card */}
			<Card>
				<CardHeader className='pb-4'>
					<CardTitle className='flex items-center gap-2'>
						<Info className='w-5 h-5' />
						Как работает специфичность CSS
					</CardTitle>
				</CardHeader>
				<CardContent className='space-y-6'>
					<p className='text-sm text-muted-foreground leading-relaxed'>
						Специфичность определяет, какие CSS правила применяются к элементу,
						когда несколько правил конфликтуют. Более специфичные селекторы
						имеют приоритет.
					</p>

					<div className='grid gap-6 md:grid-cols-2'>
						<div className='space-y-3'>
							<h4 className='font-semibold text-sm'>Уровни специфичности</h4>
							<div className='space-y-2 text-sm'>
								<div className='flex items-center gap-3 p-2 rounded-md bg-muted/50'>
									<Badge className='font-mono shrink-0 bg-red-600'>
										1-0-0-0
									</Badge>
									<span>Инлайн стили (style="")</span>
								</div>
								<div className='flex items-center gap-3 p-2 rounded-md bg-muted/50'>
									<Badge className='font-mono shrink-0 bg-purple-600'>
										0-1-0-0
									</Badge>
									<span>ID селекторы (#example)</span>
								</div>
								<div className='flex items-center gap-3 p-2 rounded-md bg-muted/50'>
									<Badge className='font-mono shrink-0 bg-blue-600'>
										0-0-1-0
									</Badge>
									<span>Классы, атрибуты, псевдоклассы</span>
								</div>
								<div className='flex items-center gap-3 p-2 rounded-md bg-muted/50'>
									<Badge className='font-mono shrink-0 bg-gray-600'>
										0-0-0-1
									</Badge>
									<span>Элементы и псевдоэлементы</span>
								</div>
							</div>
						</div>

						<div className='space-y-3'>
							<h4 className='font-semibold text-sm'>Примеры</h4>
							<div className='space-y-2 text-sm font-mono'>
								<div className='flex items-center justify-between p-2 rounded-md bg-muted/50'>
									<span>body</span>
									<Badge variant='outline' className='font-mono'>
										0-0-0-1
									</Badge>
								</div>
								<div className='flex items-center justify-between p-2 rounded-md bg-muted/50'>
									<span>.header</span>
									<Badge variant='outline' className='font-mono'>
										0-0-1-0
									</Badge>
								</div>
								<div className='flex items-center justify-between p-2 rounded-md bg-muted/50'>
									<span>#main</span>
									<Badge variant='outline' className='font-mono'>
										0-1-0-0
									</Badge>
								</div>
								<div className='flex items-center justify-between p-2 rounded-md bg-muted/50'>
									<span>#nav .active</span>
									<Badge variant='outline' className='font-mono'>
										0-1-1-0
									</Badge>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
