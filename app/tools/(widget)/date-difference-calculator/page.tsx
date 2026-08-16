'use client'

import { useMemo, useState } from 'react'
import { ArrowLeftRight, Check, Copy } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import {
	daysBetween,
	yearsMonthsDaysBetween,
	businessDaysBetween
} from '@/lib/utils/date-difference'
import { pluralizeRu } from '@/lib/utils/pluralize'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { DateDifferenceCalculatorSeo } from './DateDifferenceCalculatorSeo'

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

export default function DateDifferenceCalculatorPage() {
	const widget = getWidgetById('date-difference-calculator')!

	const [date1, setDate1] = useState(todayIso())
	const [date2, setDate2] = useState(todayIso())
	const [copied, setCopied] = useState(false)

	const result = useMemo(() => {
		const a = parseIso(date1)
		const b = parseIso(date2)
		if (!a || !b) return null

		return {
			days: daysBetween(a, b),
			ymd: yearsMonthsDaysBetween(a, b),
			businessDays: businessDaysBetween(a, b)
		}
	}, [date1, date2])

	const setBothToday = () => {
		const today = todayIso()
		setDate1(today)
		setDate2(today)
	}

	const swapDates = () => {
		setDate1(date2)
		setDate2(date1)
	}

	const summaryText = result
		? `${result.days} ${pluralizeRu(result.days, ['день', 'дня', 'дней'])} (${result.ymd.years} ${pluralizeRu(result.ymd.years, ['год', 'года', 'лет'])}, ${result.ymd.months} ${pluralizeRu(result.ymd.months, ['месяц', 'месяца', 'месяцев'])}, ${result.ymd.days} ${pluralizeRu(result.ymd.days, ['день', 'дня', 'дней'])}), из них ${result.businessDays} рабочих`
		: ''

	const copySummary = async () => {
		if (!summaryText) return
		await navigator.clipboard.writeText(summaryText)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<button
						type='button'
						onClick={setBothToday}
						className={toolPill(false)}
					>
						Сегодня
					</button>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={copySummary}
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

				{/* Ввод дат: два поля и переключатель местами между ними. */}
				<div className='grid items-end gap-4 border-b px-5 py-6 sm:grid-cols-[1fr_auto_1fr] sm:px-6'>
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Дата 1
						</span>
						<input
							type='date'
							value={date1}
							onChange={event => setDate1(event.target.value)}
							aria-label='Первая дата'
							className='w-full cursor-pointer rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						/>
					</label>

					<Button
						size='icon'
						variant='ghost'
						onClick={swapDates}
						title='Поменять местами'
						className={cn(toolIconButton, 'mx-auto')}
					>
						<ArrowLeftRight className='h-4 w-4' />
					</Button>

					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Дата 2
						</span>
						<input
							type='date'
							value={date2}
							onChange={event => setDate2(event.target.value)}
							aria-label='Вторая дата'
							className='w-full cursor-pointer rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						/>
					</label>
				</div>

				{/* Результат */}
				{result ? (
					<div className='px-5 py-8 text-center sm:px-6'>
						<span className='block font-mono text-5xl font-bold tracking-tight text-foreground sm:text-6xl'>
							{result.days}
						</span>
						<span className='mt-1 block text-sm text-muted-foreground'>
							{pluralizeRu(result.days, ['день', 'дня', 'дней'])}
						</span>

						<div className='mx-auto mt-6 grid max-w-md grid-cols-2 gap-3 text-sm sm:grid-cols-4'>
							<div className='rounded-xl border p-3'>
								<span className='block font-mono text-lg font-semibold text-foreground'>
									{result.ymd.years}
								</span>
								<span className='text-xs text-muted-foreground'>
									{pluralizeRu(result.ymd.years, ['год', 'года', 'лет'])}
								</span>
							</div>
							<div className='rounded-xl border p-3'>
								<span className='block font-mono text-lg font-semibold text-foreground'>
									{result.ymd.months}
								</span>
								<span className='text-xs text-muted-foreground'>
									{pluralizeRu(result.ymd.months, [
										'месяц',
										'месяца',
										'месяцев'
									])}
								</span>
							</div>
							<div className='rounded-xl border p-3'>
								<span className='block font-mono text-lg font-semibold text-foreground'>
									{result.ymd.days}
								</span>
								<span className='text-xs text-muted-foreground'>
									{pluralizeRu(result.ymd.days, ['день', 'дня', 'дней'])}
								</span>
							</div>
							<div className='rounded-xl border p-3'>
								<span className='block font-mono text-lg font-semibold text-foreground'>
									{result.businessDays}
								</span>
								<span className='text-xs text-muted-foreground'>рабочих</span>
							</div>
						</div>
					</div>
				) : (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						Укажите обе даты
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						Первая группа чисел — точная календарная разбивка (годы, месяцы,
						дни), «рабочих» — дни с понедельника по пятницу
					</span>
				</div>
			</Card>

			<DateDifferenceCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
