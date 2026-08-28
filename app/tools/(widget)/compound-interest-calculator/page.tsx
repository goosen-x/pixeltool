'use client'

import { useMemo, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toolBar, toolFooterBar, toolIconButton, toolPill } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { CompoundInterestCalculatorSeo } from './CompoundInterestCalculatorSeo'

type Capitalization = 365 | 12 | 4 | 1

const CAPITALIZATIONS: [Capitalization, string][] = [
	[365, 'Ежедневно'],
	[12, 'Ежемесячно'],
	[4, 'Ежеквартально'],
	[1, 'Раз в год']
]

interface SimulationResult {
	finalAmount: number
	totalContributed: number
	interestEarned: number
}

function toNumber(value: string): number | null {
	const parsed = parseFloat(value.replace(',', '.'))
	return Number.isFinite(parsed) ? parsed : null
}

function formatMoney(value: number): string {
	return value.toLocaleString('ru-RU', { maximumFractionDigits: 0 })
}

/**
 * Дневная симуляция, а не готовая формула аннуитета: пополнение всегда
 * ежемесячное (так его чаще всего ищут), а капитализация может быть
 * ежедневной, ежемесячной, ежеквартальной или годовой — эти два периода не
 * совпадают, и формула сложных процентов одним выражением такую комбинацию
 * не считает. Проценты копятся каждый день на текущий остаток и добавляются
 * к нему только в дату капитализации — до этого момента сами на себя не
 * начисляются, ровно как в банковском вкладе.
 */
function simulate(
	principal: number,
	annualRatePercent: number,
	years: number,
	monthlyContribution: number,
	capitalizationsPerYear: Capitalization
): SimulationResult | null {
	const totalDays = Math.round(years * 365)
	if (totalDays <= 0 || principal < 0 || monthlyContribution < 0) return null

	const dailyRate = annualRatePercent / 100 / 365

	let balance = principal
	let pendingInterest = 0
	let totalContributed = principal

	let capIndex = 1
	let nextCapDay = Math.round(365 / capitalizationsPerYear)
	let contribIndex = 1
	let nextContribDay = Math.round(365 / 12)

	for (let day = 1; day <= totalDays; day++) {
		pendingInterest += balance * dailyRate

		if (monthlyContribution > 0 && day === nextContribDay) {
			balance += monthlyContribution
			totalContributed += monthlyContribution
			contribIndex++
			nextContribDay = Math.round((contribIndex * 365) / 12)
		}

		if (day === nextCapDay) {
			balance += pendingInterest
			pendingInterest = 0
			capIndex++
			nextCapDay = Math.round((capIndex * 365) / capitalizationsPerYear)
		}
	}

	const finalAmount = balance + pendingInterest
	return {
		finalAmount,
		totalContributed,
		interestEarned: finalAmount - totalContributed
	}
}

export default function CompoundInterestCalculatorPage() {
	const widget = getWidgetById('compound-interest-calculator')!

	const [principal, setPrincipal] = useState('100000')
	const [rate, setRate] = useState('18')
	const [years, setYears] = useState('5')
	const [monthlyContribution, setMonthlyContribution] = useState('10000')
	const [capitalization, setCapitalization] = useState<Capitalization>(12)
	const [copied, setCopied] = useState(false)

	const result = useMemo(() => {
		const p = toNumber(principal)
		const r = toNumber(rate)
		const y = toNumber(years)
		const c = toNumber(monthlyContribution) ?? 0
		if (p === null || r === null || y === null) return null
		return simulate(p, r, y, c, capitalization)
	}, [principal, rate, years, monthlyContribution, capitalization])

	const summaryText = useMemo(() => {
		if (!result) return ''
		return `Итоговая сумма: ${formatMoney(result.finalAmount)} ₽ (внесено ${formatMoney(result.totalContributed)} ₽, начислено процентов ${formatMoney(result.interestEarned)} ₽)`
	}, [result])

	const copyResult = async () => {
		if (!summaryText) return
		await navigator.clipboard.writeText(summaryText)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	const numberInputClass =
		'w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						{CAPITALIZATIONS.map(([value, label]) => (
							<button
								key={value}
								type='button'
								onClick={() => setCapitalization(value)}
								aria-pressed={capitalization === value}
								className={toolPill(capitalization === value)}
							>
								{label}
							</button>
						))}
					</div>

					<div className='flex w-full items-center justify-end gap-0.5 sm:w-auto sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={copyResult}
							disabled={!summaryText}
							title='Скопировать результат'
							className={toolIconButton}
						>
							{copied ? (
								<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
							) : (
								<Copy className='h-4 w-4' />
							)}
						</Button>
					</div>
				</div>

				<div className='grid gap-4 border-b px-5 py-6 sm:grid-cols-2 sm:px-6'>
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Начальная сумма, ₽
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={principal}
							onChange={event => setPrincipal(event.target.value)}
							aria-label='Начальная сумма'
							className={numberInputClass}
						/>
					</label>
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Ставка, % годовых
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={rate}
							onChange={event => setRate(event.target.value)}
							aria-label='Ставка, % годовых'
							className={numberInputClass}
						/>
					</label>
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Срок, лет
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={years}
							onChange={event => setYears(event.target.value)}
							aria-label='Срок в годах'
							className={numberInputClass}
						/>
					</label>
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Пополнение в месяц, ₽
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={monthlyContribution}
							onChange={event => setMonthlyContribution(event.target.value)}
							aria-label='Ежемесячное пополнение'
							className={numberInputClass}
						/>
					</label>
				</div>

				{result ? (
					<div className='mx-auto grid max-w-2xl grid-cols-1 gap-3 px-5 py-8 text-center sm:grid-cols-3 sm:px-6'>
						<div className='rounded-xl border p-4'>
							<span className='block font-mono text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
								{formatMoney(result.finalAmount)} ₽
							</span>
							<span className='mt-1 block text-sm text-muted-foreground'>
								Итоговая сумма
							</span>
						</div>
						<div className='rounded-xl border p-4'>
							<span className='block font-mono text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
								{formatMoney(result.totalContributed)} ₽
							</span>
							<span className='mt-1 block text-sm text-muted-foreground'>
								Внесено
							</span>
						</div>
						<div className='rounded-xl border p-4'>
							<span className='block font-mono text-2xl font-bold tracking-tight text-green-600 dark:text-green-400 sm:text-3xl'>
								+{formatMoney(result.interestEarned)} ₽
							</span>
							<span className='mt-1 block text-sm text-muted-foreground'>
								Начислено процентов
							</span>
						</div>
					</div>
				) : (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						Заполните начальную сумму, ставку и срок
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						Проценты начисляются на остаток ежедневно и добавляются к сумме
						вклада в дату капитализации — до этого сами на себя не растут
					</span>
				</div>
			</Card>

			<CompoundInterestCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
