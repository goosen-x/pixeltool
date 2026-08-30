'use client'

import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { DatePicker } from '@/components/ui/date-picker'
import { toolBar, toolFooterBar } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { calculateAge, weekdayNameRu } from '@/lib/utils/age-calculator'
import { pluralizeRu } from '@/lib/utils/pluralize'
import { AgeCalculatorSeo } from './AgeCalculatorSeo'

function todayInputValue(): string {
	const now = new Date()
	const offset = now.getTimezoneOffset()
	return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10)
}

function parseInputDate(value: string): Date | null {
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

const inputClass =
	'w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'

export default function AgeCalculatorPage() {
	const widget = getWidgetById('age-calculator')!

	const [birthValue, setBirthValue] = useState('1995-06-15')
	const [onValue, setOnValue] = useState(todayInputValue())

	const birth = parseInputDate(birthValue)
	const on = parseInputDate(onValue)

	const result = useMemo(() => {
		if (!birth || !on || birth.getTime() > on.getTime()) return null
		return calculateAge(birth, on)
	}, [birth, on])

	const errorMessage =
		birth && on && birth.getTime() > on.getTime()
			? 'Дата рождения не может быть позже даты расчёта'
			: null

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<label className='flex flex-1 items-center gap-3'>
						<span className='shrink-0 text-sm text-muted-foreground'>
							Дата рождения
						</span>
						<DatePicker
							value={birthValue}
							onChange={setBirthValue}
							max={onValue}
							ariaLabel='Дата рождения'
							className={inputClass}
						/>
					</label>

					<label className='flex flex-1 items-center gap-3'>
						<span className='shrink-0 text-sm text-muted-foreground'>
							На дату
						</span>
						<DatePicker
							value={onValue}
							onChange={setOnValue}
							ariaLabel='Дата, на которую считать возраст'
							className={inputClass}
						/>
					</label>
				</div>

				{result ? (
					<>
						<div className='flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 px-5 py-10 text-center sm:px-6'>
							<span className='font-mono text-5xl font-bold tracking-tight text-foreground sm:text-6xl'>
								{result.years}
							</span>
							<span className='text-lg text-muted-foreground'>
								{pluralizeRu(result.years, ['год', 'года', 'лет'])}
							</span>
							<span className='font-mono text-5xl font-bold tracking-tight text-foreground sm:text-6xl'>
								{result.months}
							</span>
							<span className='text-lg text-muted-foreground'>
								{pluralizeRu(result.months, ['месяц', 'месяца', 'месяцев'])}
							</span>
							<span className='font-mono text-5xl font-bold tracking-tight text-foreground sm:text-6xl'>
								{result.days}
							</span>
							<span className='text-lg text-muted-foreground'>
								{pluralizeRu(result.days, ['день', 'дня', 'дней'])}
							</span>
						</div>

						<div className='grid grid-cols-2 gap-4 border-t px-5 py-6 text-center sm:grid-cols-4 sm:px-6'>
							<div>
								<span className='block font-mono text-xl font-semibold text-foreground'>
									{result.totalDays.toLocaleString('ru-RU')}
								</span>
								<span className='mt-1 block text-sm text-muted-foreground'>
									дней всего
								</span>
							</div>
							<div>
								<span className='block font-mono text-xl font-semibold text-foreground'>
									{result.totalWeeks.toLocaleString('ru-RU')}
								</span>
								<span className='mt-1 block text-sm text-muted-foreground'>
									недель
								</span>
							</div>
							<div>
								<span className='block font-mono text-xl font-semibold text-foreground'>
									{result.totalMonths.toLocaleString('ru-RU')}
								</span>
								<span className='mt-1 block text-sm text-muted-foreground'>
									месяцев
								</span>
							</div>
							<div>
								<span className='block font-mono text-xl font-semibold text-foreground'>
									{result.daysUntilNextBirthday === 0
										? 'сегодня'
										: result.daysUntilNextBirthday.toLocaleString('ru-RU')}
								</span>
								<span className='mt-1 block text-sm text-muted-foreground'>
									{result.daysUntilNextBirthday === 0
										? 'день рождения'
										: 'дней до дня рождения'}
								</span>
							</div>
						</div>
					</>
				) : (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						{errorMessage || 'Укажите дату рождения'}
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						{birth
							? `Родились в ${formatDate(birth)}, это ${weekdayNameRu(birth)}`
							: 'Формула — календарная разница дат, без округления по 365 дням в году'}
					</span>
				</div>
			</Card>

			<AgeCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
