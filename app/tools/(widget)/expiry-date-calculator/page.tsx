'use client'

import { useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ToolSelect } from '@/components/ui/tool-select'
import { TextRoll } from '@/components/core/text-roll'
import { cn } from '@/lib/utils'
import { toolBar, toolFooterBar, toolIconButton } from '@/lib/ui/tool-pill'
import {
	addPeriod,
	signedDaysBetween,
	type PeriodUnit
} from '@/lib/utils/date-difference'
import { pluralizeRu } from '@/lib/utils/pluralize'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { ExpiryDateCalculatorSeo } from './ExpiryDateCalculatorSeo'

const UNITS: { value: PeriodUnit; label: string }[] = [
	{ value: 'days', label: 'Дни' },
	{ value: 'months', label: 'Месяцы' },
	{ value: 'years', label: 'Годы' }
]

function todayIso(): string {
	const now = new Date()
	const offset = now.getTimezoneOffset() * 60000
	return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}

function parseIso(value: string): Date | null {
	if (!value) return null
	const [year, month, day] = value.split('-').map(Number)
	if (!year || !month || !day) return null
	return new Date(year, month - 1, day)
}

function formatDate(date: Date): string {
	return date.toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	})
}

export default function ExpiryDateCalculatorPage() {
	const widget = getWidgetById('expiry-date-calculator')!

	const [productionDate, setProductionDate] = useState(todayIso())
	const [amount, setAmount] = useState('6')
	const [unit, setUnit] = useState<PeriodUnit>('months')

	const result = useMemo(() => {
		const produced = parseIso(productionDate)
		const parsedAmount = Number(amount)
		if (!produced || !Number.isFinite(parsedAmount) || parsedAmount < 0) {
			return null
		}

		const expiresAt = addPeriod(produced, parsedAmount, unit)
		const daysLeft = signedDaysBetween(new Date(), expiresAt)

		return { expiresAt, daysLeft }
	}, [productionDate, amount, unit])

	const reset = () => {
		setProductionDate(todayIso())
		setAmount('6')
		setUnit('months')
	}

	const status =
		result === null
			? null
			: result.daysLeft < 0
				? ('expired' as const)
				: result.daysLeft <= 7
					? ('soon' as const)
					: ('valid' as const)

	const statusStyles = {
		valid:
			'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400',
		soon: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
		expired: 'border-destructive/30 bg-destructive/10 text-destructive'
	}

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<span className='text-sm text-muted-foreground'>
						Дата производства и срок хранения
					</span>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={reset}
							title='Сбросить'
							className={toolIconButton}
						>
							<RotateCcw className='h-4 w-4' />
						</Button>
					</div>
				</div>

				<div className='grid gap-4 border-b px-5 py-6 sm:grid-cols-2 sm:px-6'>
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Дата производства
						</span>
						<input
							type='date'
							value={productionDate}
							onChange={event => setProductionDate(event.target.value)}
							aria-label='Дата производства'
							className='w-full cursor-pointer rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						/>
					</label>

					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Срок хранения
						</span>
						<div className='flex gap-2'>
							<input
								type='number'
								min={0}
								step='any'
								value={amount}
								onChange={event => setAmount(event.target.value)}
								aria-label='Срок хранения, число'
								className='w-full min-w-0 rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
							/>
							<ToolSelect
								value={unit}
								onChange={event => setUnit(event.target.value as PeriodUnit)}
								aria-label='Единица срока хранения'
								className='w-32 flex-shrink-0 py-2'
							>
								{UNITS.map(item => (
									<option key={item.value} value={item.value}>
										{item.label}
									</option>
								))}
							</ToolSelect>
						</div>
					</label>
				</div>

				{result && status ? (
					<div className='px-5 py-8 text-center sm:px-6'>
						<TextRoll
							key={formatDate(result.expiresAt)}
							className='inline-block font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl'
							duration={0.4}
							getEnterDelay={i => i * 0.02}
							getExitDelay={i => i * 0.02}
						>
							{formatDate(result.expiresAt)}
						</TextRoll>
						<span className='mt-1 block text-sm text-muted-foreground'>
							дата истечения срока годности
						</span>

						<div
							className={cn(
								'mx-auto mt-6 inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium',
								statusStyles[status]
							)}
						>
							{status === 'expired' &&
								`Просрочен ${Math.abs(result.daysLeft)} ${pluralizeRu(Math.abs(result.daysLeft), ['день', 'дня', 'дней'])} назад`}
							{status === 'soon' &&
								(result.daysLeft === 0
									? 'Истекает сегодня'
									: `Осталось ${result.daysLeft} ${pluralizeRu(result.daysLeft, ['день', 'дня', 'дней'])}`)}
							{status === 'valid' &&
								`Осталось ${result.daysLeft} ${pluralizeRu(result.daysLeft, ['день', 'дня', 'дней'])}`}
						</div>
					</div>
				) : (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						Укажите дату производства и срок хранения
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						Месяцы и годы прибавляются календарно — 31 января плюс месяц даёт 28
						или 29 февраля, а не переезжает в март
					</span>
				</div>
			</Card>

			<ExpiryDateCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
