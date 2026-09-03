'use client'

import { useMemo, useState } from 'react'
import { Check, Copy, Minus, Plus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { toolBar, toolIconButton } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { pickVerdict, wilsonInterval } from '@/lib/utils/ab-test'
import { AbTestCalculatorSeo } from './AbTestCalculatorSeo'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'

interface Row {
	id: string
	conversions: string
	visitors: string
}

const MIN_VARIANTS = 2
const MAX_VARIANTS = 8
const MIN_CONFIDENCE = 80
const MAX_CONFIDENCE = 99

/** Буквенная метка варианта: A, B, ... Z, AA, AB, ... — как в таблицах. */
function variantLabel(index: number): string {
	let n = index
	let label = ''
	do {
		label = String.fromCharCode(65 + (n % 26)) + label
		n = Math.floor(n / 26) - 1
	} while (n >= 0)
	return label
}

function parsePositiveInt(value: string): number | null {
	if (!/^\d+$/.test(value.trim())) return null
	return Number(value)
}

function formatPercent(rate: number, digits = 1): string {
	return `${(rate * 100).toFixed(digits)}%`
}

function newRow(id: string, conversions: string, visitors: string): Row {
	return { id, conversions, visitors }
}

let nextId = 0

export default function AbTestCalculatorPage() {
	const widget = getWidgetById('ab-test-calculator')!

	const [confidenceLevel, setConfidenceLevel] = useState(95)
	const [rows, setRows] = useState<Row[]>(() => [
		newRow(`r-${nextId++}`, '100', '1000'),
		newRow(`r-${nextId++}`, '130', '1000')
	])
	const [copied, setCopied] = useState(false)

	const setVariantCount = (count: number) => {
		setRows(prev => {
			if (count > prev.length) {
				const additions = Array.from({ length: count - prev.length }, () =>
					newRow(`r-${nextId++}`, '', '')
				)
				return [...prev, ...additions]
			}
			if (count < prev.length) return prev.slice(0, count)
			return prev
		})
	}

	const clearAll = () => {
		setRows(prev => prev.map(row => newRow(row.id, '', '')))
	}

	const updateRow = (id: string, patch: Partial<Row>) => {
		setRows(prev =>
			prev.map(row => (row.id === id ? { ...row, ...patch } : row))
		)
	}

	const computed = useMemo(() => {
		const parseRow = (row: Row) => {
			const conversions = parsePositiveInt(row.conversions)
			const visitors = parsePositiveInt(row.visitors)
			if (!visitors || conversions === null || conversions > visitors)
				return null
			return { visitors, conversions }
		}

		return rows.map((row, index) => {
			const parsed = parseRow(row)
			const interval = parsed
				? wilsonInterval(parsed.conversions, parsed.visitors, confidenceLevel)
				: null
			return { row, label: variantLabel(index), input: parsed, interval }
		})
	}, [rows, confidenceLevel])

	/** Общий верхний предел шкалы для баров ДИ — чтобы бары всех строк были сопоставимы. */
	const scaleMax = useMemo(() => {
		const upperBounds = computed
			.map(({ interval }) => interval?.upper)
			.filter((upper): upper is number => upper !== undefined)
		const max = Math.max(0, ...upperBounds)
		return max > 0 ? max * 1.15 : 1
	}, [computed])

	const verdict = useMemo(
		() =>
			pickVerdict(
				computed.map(({ label, input }) => ({ label, input })),
				confidenceLevel
			),
		[computed, confidenceLevel]
	)

	/** Одна строка вывода на каждого «победителя» — со всеми, кого он значимо обгоняет. */
	const verdictLines = useMemo(() => {
		if (verdict.kind === 'incomplete') {
			return ['Заполните данные хотя бы двух вариантов, чтобы увидеть вывод.']
		}
		if (verdict.kind === 'no-difference') {
			return ['Значимых различий пока не видно — нужно больше данных.']
		}

		return verdict.lines.map(({ winnerLabel, loserLabels }) => {
			const base = `Вариант ${winnerLabel} лучше варианта ${loserLabels.join(', ')}`
			if (loserLabels.length !== 1) return base

			const winnerRate = computed.find(c => c.label === winnerLabel)?.interval
				?.rate
			const loserRate = computed.find(c => c.label === loserLabels[0])?.interval
				?.rate
			if (winnerRate === undefined || loserRate === undefined) return base

			if (loserRate === 0) {
				return `${base} — у него не было конверсий, а у ${winnerLabel} уже есть`
			}
			return `${base} — конверсия выше на ${formatPercent(winnerRate / loserRate - 1, 0)}`
		})
	}, [verdict, computed])

	const summaryText = useMemo(() => {
		return computed
			.filter(({ interval }) => interval !== null)
			.map(({ label, interval }) => {
				const ci = interval!
				return `${label}: ${formatPercent(ci.rate)} (${confidenceLevel}% ДИ ${formatPercent(ci.lower)}–${formatPercent(ci.upper)})`
			})
			.concat(verdictLines)
			.join('\n')
	}, [computed, confidenceLevel, verdictLines])

	const copyResult = async () => {
		await navigator.clipboard.writeText(summaryText)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	const numberInputClass =
		'w-full rounded-md border bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<div className='flex items-center gap-3'>
						<span className='text-sm text-muted-foreground'>
							Количество вариантов
						</span>
						<div className='inline-flex items-center gap-1 rounded-full border bg-background px-1 py-1'>
							<Button
								size='icon'
								variant='ghost'
								onClick={() => setVariantCount(rows.length - 1)}
								disabled={rows.length <= MIN_VARIANTS}
								title='Убрать вариант'
								className={cn(toolIconButton, 'h-6 w-6')}
							>
								<Minus className='h-3.5 w-3.5' />
							</Button>
							<span className='w-5 text-center text-sm font-medium tabular-nums'>
								{rows.length}
							</span>
							<Button
								size='icon'
								variant='ghost'
								onClick={() => setVariantCount(rows.length + 1)}
								disabled={rows.length >= MAX_VARIANTS}
								title='Добавить вариант'
								className={cn(toolIconButton, 'h-6 w-6')}
							>
								<Plus className='h-3.5 w-3.5' />
							</Button>
						</div>
					</div>

					<div className='flex items-center gap-2'>
						<span className='text-sm text-muted-foreground'>Достоверность</span>
						<Slider
							value={[confidenceLevel]}
							min={MIN_CONFIDENCE}
							max={MAX_CONFIDENCE}
							step={1}
							onValueChange={([value]) => setConfidenceLevel(value)}
							className='w-28 sm:w-36'
						/>
						<span className='w-10 text-sm font-medium tabular-nums'>
							{confidenceLevel}%
						</span>
					</div>

					<Button
						size='sm'
						variant='ghost'
						onClick={clearAll}
						className='cursor-pointer text-muted-foreground sm:ml-auto'
					>
						Очистить
					</Button>
				</div>

				<div className='p-5 sm:p-6'>
					<div className='hidden border-b pb-2 text-xs text-muted-foreground sm:grid sm:grid-cols-[2.5rem_10rem_10rem_6rem_1fr] sm:items-center sm:gap-4'>
						<span />
						<span>Число конверсий</span>
						<span>Размер выборки</span>
						<span>Конверсия</span>
						<span>Доверительный интервал</span>
					</div>

					<div className='divide-y'>
						{computed.map(({ row, label, interval }) => (
							<div
								key={row.id}
								className='grid gap-3 py-3 sm:grid-cols-[2.5rem_10rem_10rem_6rem_1fr] sm:items-center sm:gap-4'
							>
								<span
									className={cn(
										'inline-flex h-7 w-fit items-center rounded-full px-3 text-sm font-medium',
										label === 'A' ? 'bg-muted' : 'border'
									)}
								>
									{label}
								</span>
								<label className='block'>
									<span className='mb-1 block text-xs text-muted-foreground sm:hidden'>
										Число конверсий
									</span>
									<input
										type='text'
										inputMode='numeric'
										value={row.conversions}
										onChange={event =>
											updateRow(row.id, { conversions: event.target.value })
										}
										aria-label={`Число конверсий варианта ${label}`}
										placeholder='Конверсии'
										className={numberInputClass}
									/>
								</label>
								<label className='block'>
									<span className='mb-1 block text-xs text-muted-foreground sm:hidden'>
										Размер выборки
									</span>
									<input
										type='text'
										inputMode='numeric'
										value={row.visitors}
										onChange={event =>
											updateRow(row.id, { visitors: event.target.value })
										}
										aria-label={`Размер выборки варианта ${label}`}
										placeholder='Посетители'
										className={numberInputClass}
									/>
								</label>
								<div className='text-sm'>
									{interval ? (
										<span className='font-mono font-semibold text-foreground'>
											{formatPercent(interval.rate)}
										</span>
									) : (
										<span className='text-muted-foreground'>—</span>
									)}
								</div>
								<div className='flex items-center gap-3'>
									{interval ? (
										<>
											<div className='relative h-2 flex-1 overflow-hidden rounded-full bg-muted'>
												<div
													className='absolute inset-y-0 left-0 rounded-full bg-primary/30'
													style={{
														width: `${(interval.upper / scaleMax) * 100}%`
													}}
												/>
												<div
													className='absolute inset-y-0 left-0 rounded-full bg-primary'
													style={{
														width: `${(interval.lower / scaleMax) * 100}%`
													}}
												/>
											</div>
											<span className='shrink-0 text-sm text-muted-foreground'>
												{formatPercent(interval.lower)}–
												{formatPercent(interval.upper)}
											</span>
										</>
									) : (
										<span className='text-sm text-muted-foreground'>—</span>
									)}
								</div>
							</div>
						))}
					</div>
				</div>

				<div className='flex items-start justify-between gap-2 border-t bg-muted/30 px-5 py-4 sm:px-6'>
					{verdictLines.length === 1 ? (
						<p className='text-sm'>
							<span className='font-semibold'>Вывод: </span>
							<span
								className={cn(
									verdict.kind === 'results'
										? 'font-medium text-green-600 dark:text-green-400'
										: 'text-muted-foreground'
								)}
							>
								{verdictLines[0]}
							</span>
						</p>
					) : (
						<div className='text-sm'>
							<p className='font-semibold'>Вывод</p>
							<ul className='mt-1 space-y-0.5'>
								{verdictLines.map(line => (
									<li
										key={line}
										className='font-medium text-green-600 dark:text-green-400'
									>
										{line}
									</li>
								))}
							</ul>
						</div>
					)}
					<Button
						size='icon'
						variant='ghost'
						onClick={copyResult}
						title='Скопировать результат'
						className={cn(toolIconButton, 'h-7 w-7 shrink-0')}
					>
						{copied ? (
							<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
						) : (
							<Copy className='h-4 w-4' />
						)}
					</Button>
				</div>
			</Card>

			<ToolScreenshot slug='ab-test-calculator' />
			<AbTestCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
