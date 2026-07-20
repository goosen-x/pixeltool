'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Copy, Trash2 } from 'lucide-react'
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

	// Чистый разбор: результат — производное от ввода, а не состояние.
	// Кнопка «Анализировать» не нужна — считаем на лету.
	const extractSelectors = (source: string): string[] => {
		const lines = source.split('\n')
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

		return [...new Set(selectors.filter(sel => sel.length > 0))]
	}

	const results = useMemo(() => {
		if (!input.trim()) return []

		const parsed = extractSelectors(input).map(selector =>
			calculateSpecificity(selector)
		)

		return sortBy === 'weight'
			? [...parsed].sort((a, b) => b.weight - a.weight)
			: parsed
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [input, sortBy])

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
		<div className='max-w-7xl mx-auto space-y-6'>
			<Card className='space-y-8 p-6 sm:p-8'>
				<div className='grid gap-10 lg:grid-cols-2'>
					{/* Ввод */}
					<div className='space-y-4'>
						<div className='flex items-center justify-between'>
							<h3 className='text-sm font-semibold tracking-wide text-muted-foreground uppercase'>
								Селекторы
							</h3>
							<div className='flex gap-1'>
								<Button
									variant='outline'
									size='sm'
									onClick={loadExample}
									className='cursor-pointer'
								>
									Пример
								</Button>
								<Button
									variant='ghost'
									size='sm'
									onClick={() => setInput('')}
									disabled={!input}
									className='cursor-pointer'
									aria-label='Очистить'
								>
									<Trash2 className='h-4 w-4' />
								</Button>
							</div>
						</div>

						<Textarea
							placeholder={`body\n.header#main-content\nnav ul li a\n.btn.btn-primary\ninput[type="text"]\na:hover`}
							value={input}
							onChange={e => setInput(e.target.value)}
							rows={14}
							className='resize-none font-mono text-sm'
						/>
						<p className='text-xs text-muted-foreground'>
							По одному селектору на строку. Вес считается на лету.
						</p>
					</div>

					{/* Результат */}
					<div className='space-y-4'>
						<div className='flex items-center justify-between'>
							<h3 className='text-sm font-semibold tracking-wide text-muted-foreground uppercase'>
								Вес селекторов
								{results.length > 0 && (
									<span className='ml-2 font-mono normal-case'>
										{results.length}
									</span>
								)}
							</h3>
							{results.length > 0 && (
								<div className='flex gap-1'>
									<Button
										variant='ghost'
										size='sm'
										className='cursor-pointer text-xs'
										onClick={() =>
											setSortBy(sortBy === 'order' ? 'weight' : 'order')
										}
									>
										{sortBy === 'order' ? 'По весу' : 'По порядку'}
									</Button>
									<Button
										variant='ghost'
										size='sm'
										onClick={copyResults}
										className='cursor-pointer'
										aria-label='Скопировать результаты'
									>
										<Copy className='h-4 w-4' />
									</Button>
								</div>
							)}
						</div>

						{results.length === 0 ? (
							<div className='flex h-[320px] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground'>
								Вставьте селекторы — вес посчитается сам
							</div>
						) : (
							<div className='max-h-[320px] space-y-2 overflow-y-auto pr-1'>
								{results.map((result, index) => (
									<div
										key={index}
										className='space-y-2 rounded-lg border p-3 transition-colors hover:border-primary/50'
									>
										<div className='flex items-start justify-between gap-3'>
											<code className='flex-1 font-mono text-sm break-all'>
												{result.selector}
											</code>
											<div className='flex shrink-0 items-center gap-2'>
												<span
													className={cn(
														'font-mono text-sm font-semibold',
														getSpecificityColor(result.weight)
													)}
												>
													{result.specificityString}
												</span>
												<span className='text-xs text-muted-foreground'>
													вес {result.weight}
												</span>
											</div>
										</div>

										{/* Разбор: раньше каждый тип части красился в свой цвет —
										    шесть палитр в одном списке. Теперь нейтрально */}
										<div className='flex flex-wrap gap-1.5'>
											{result.parts.inline > 0 && (
												<Badge variant='secondary' className='text-xs'>
													inline style
												</Badge>
											)}
											{[
												...result.parts.ids,
												...result.parts.classes,
												...result.parts.attributes,
												...result.parts.pseudoClasses,
												...result.parts.elements,
												...result.parts.pseudoElements
											].map((part, i) => (
												<Badge
													key={i}
													variant='secondary'
													className='font-mono text-xs'
												>
													{part}
												</Badge>
											))}
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</Card>

			{/* Справка — секцией под тулом, как обучающие блоки в остальных инструментах */}
			<section className='mx-auto mt-12 max-w-3xl text-left text-foreground'>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как считается вес селектора
				</h2>
				<p className='mt-3 leading-relaxed'>
					Когда на один элемент претендуют несколько правил, побеждает не то,
					что ниже в файле, а то, у которого больше вес. Порядок в файле
					вступает в силу только при равном весе.
				</p>
				<p className='mt-3 leading-relaxed'>
					Вес записывают четвёркой чисел и сравнивают слева направо. Любой
					селектор с одним id перебьёт селектор хоть с сотней классов — разряды
					не переполняются.
				</p>

				<div className='mt-4 overflow-x-auto'>
					<table className='w-full border-collapse text-sm'>
						<thead>
							<tr className='border-b text-left'>
								<th className='py-2 pr-4 font-semibold'>Вес</th>
								<th className='py-2 font-semibold'>Что его даёт</th>
							</tr>
						</thead>
						<tbody>
							{[
								['1-0-0-0', 'Инлайн-стиль в атрибуте style'],
								['0-1-0-0', 'Идентификатор — #main'],
								[
									'0-0-1-0',
									'Класс, атрибут, псевдокласс — .btn, [type], :hover'
								],
								['0-0-0-1', 'Тег и псевдоэлемент — div, ::before']
							].map(([weight, desc]) => (
								<tr key={weight} className='border-b align-top last:border-0'>
									<td className='py-2 pr-4'>
										<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-xs'>
											{weight}
										</code>
									</td>
									<td className='py-2'>{desc}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<h2 className='mt-10 text-2xl font-bold tracking-tight'>
					Почему не применяются стили
				</h2>
				<p className='mt-3 leading-relaxed'>
					Самая частая причина — как раз специфичность: где-то лежит более
					тяжёлый селектор, и он перебивает ваш, даже если ваш написан ниже.
					Вставьте оба в калькулятор и сравните вес. Если веса равны, а стиль
					всё равно не виден — ищите опечатку в имени класса, чужой{' '}
					<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
						!important
					</code>{' '}
					или свойство, которое просто не наследуется.
				</p>
				<p className='mt-3 leading-relaxed'>
					Перебивать чужой стиль лучше аккуратно: добавьте класс родителя или
					продублируйте свой класс —{' '}
					<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
						.btn.btn
					</code>{' '}
					вполне легальный приём, вес растёт, разметка не меняется.{' '}
					<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
						!important
					</code>{' '}
					оставьте на крайний случай: перебить его потом можно будет только
					другим{' '}
					<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
						!important
					</code>
					, и так рождается война, из которой нет выхода.
				</p>
				<p className='mt-3 leading-relaxed'>
					Когда конфликт разобран и лишние переопределения убраны, готовый CSS
					удобно сжать{' '}
					<Link
						href='/tools/css-minifier'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						минификатором
					</Link>{' '}
					перед тем как отправить в продакшен.
				</p>
			</section>
		</div>
	)
}
