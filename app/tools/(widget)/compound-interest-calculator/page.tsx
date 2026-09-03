'use client'

import { useMemo, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { CompoundInterestChart } from '@/components/tools/CompoundInterestChart'
import { CompoundInterestTable } from '@/components/tools/CompoundInterestTable'
import {
	simulate,
	toYearRows,
	type Capitalization
} from '@/lib/utils/compound-interest'
import { CompoundInterestCalculatorSeo } from './CompoundInterestCalculatorSeo'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'

const CAPITALIZATIONS: [Capitalization, string][] = [
	[365, 'Ежедневно'],
	[12, 'Ежемесячно'],
	[4, 'Ежеквартально'],
	[1, 'Раз в год']
]

const STEPS: ['month' | 'year', string][] = [
	['month', 'По месяцам'],
	['year', 'По годам']
]

function toNumber(value: string): number | null {
	const parsed = parseFloat(value.replace(',', '.'))
	return Number.isFinite(parsed) ? parsed : null
}

function formatMoney(value: number): string {
	return value.toLocaleString('ru-RU', { maximumFractionDigits: 0 })
}

export default function CompoundInterestCalculatorPage() {
	const widget = getWidgetById('compound-interest-calculator')!

	const [principal, setPrincipal] = useState('100000')
	const [rate, setRate] = useState('18')
	const [years, setYears] = useState('5')
	const [monthlyContribution, setMonthlyContribution] = useState('10000')
	const [capitalization, setCapitalization] = useState<Capitalization>(12)
	const [step, setStep] = useState<'month' | 'year'>('month')
	const [copied, setCopied] = useState(false)

	const result = useMemo(() => {
		const p = toNumber(principal)
		const r = toNumber(rate)
		const y = toNumber(years)
		const c = toNumber(monthlyContribution) ?? 0
		if (p === null || r === null || y === null) return null
		return simulate({
			principal: p,
			annualRatePercent: r,
			years: y,
			monthlyContribution: c,
			capitalizationsPerYear: capitalization
		})
	}, [principal, rate, years, monthlyContribution, capitalization])

	const rows = useMemo(() => {
		if (!result) return []
		return step === 'month' ? result.months : toYearRows(result.months)
	}, [result, step])

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
					<div className='mx-auto grid max-w-3xl grid-cols-1 gap-3 px-5 py-8 text-center sm:grid-cols-3 sm:px-6'>
						<div className='rounded-xl border p-4'>
							<span className='block font-mono text-xl font-bold tracking-tight whitespace-nowrap text-foreground sm:text-2xl'>
								{formatMoney(result.finalAmount)}
								<span className='ml-1 text-base text-muted-foreground'>₽</span>
							</span>
							<span className='mt-1 block text-sm text-muted-foreground'>
								Итоговая сумма
							</span>
						</div>
						<div className='rounded-xl border p-4'>
							<span className='block font-mono text-xl font-bold tracking-tight whitespace-nowrap text-foreground sm:text-2xl'>
								{formatMoney(result.totalContributed)}
								<span className='ml-1 text-base text-muted-foreground'>₽</span>
							</span>
							<span className='mt-1 block text-sm text-muted-foreground'>
								Внесено
							</span>
						</div>
						<div className='rounded-xl border p-4'>
							<span className='block font-mono text-xl font-bold tracking-tight whitespace-nowrap text-green-600 dark:text-green-400 sm:text-2xl'>
								+{formatMoney(result.interestEarned)}
								<span className='ml-1 text-base text-muted-foreground'>₽</span>
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

				{result && result.months.length > 1 && (
					<div className='border-t px-2 py-6 sm:px-4'>
						<CompoundInterestChart months={result.months} />
					</div>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						Проценты начисляются на остаток ежедневно и добавляются к сумме
						вклада в дату капитализации — до этого сами на себя не растут
					</span>
				</div>
			</Card>

			{result && rows.length > 0 && (
				<section className='mt-8'>
					<div className='flex flex-wrap items-center gap-x-6 gap-y-3'>
						<h2 className='text-lg font-semibold'>Расчёт по периодам</h2>
						<div className='flex items-center gap-1.5 sm:ml-auto'>
							{STEPS.map(([value, label]) => (
								<button
									key={value}
									type='button'
									onClick={() => setStep(value)}
									aria-pressed={step === value}
									className={toolPill(step === value)}
								>
									{label}
								</button>
							))}
						</div>
					</div>

					<p className='mt-2 text-sm text-muted-foreground'>
						Те же данные, что на графике, но числами: сколько внесено и сколько
						начислено в каждом периоде и что из этого выросло на счёте.
					</p>

					<div className='mt-4'>
						<CompoundInterestTable rows={rows} step={step} />
					</div>
				</section>
			)}

			<ToolScreenshot slug='compound-interest-calculator' />
			<CompoundInterestCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
