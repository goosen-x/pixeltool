'use client'

import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { DatePicker } from '@/components/ui/date-picker'
import { toolBar, toolFooterBar } from '@/lib/ui/tool-pill'
import {
	birthdayNumber,
	lifePathNumber,
	personalYearNumber,
	LIFE_PATH_MEANINGS,
	PERSONAL_YEAR_MEANINGS
} from '@/lib/utils/numerology'
import { NumerologyStepBreakdown } from './NumerologyStepBreakdown'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { NumerologyCalculatorSeo } from './NumerologyCalculatorSeo'

function parseIso(
	value: string
): { day: number; month: number; year: number } | null {
	if (!value) return null
	const [year, month, day] = value.split('-').map(Number)
	if (!year || !month || !day) return null
	return { day, month, year }
}

export default function NumerologyCalculatorPage() {
	const widget = getWidgetById('numerology-calculator')!

	const [birthDate, setBirthDate] = useState('1990-04-15')

	const currentYear = useMemo(() => new Date().getFullYear(), [])

	const result = useMemo(() => {
		const parsed = parseIso(birthDate)
		if (!parsed) return null

		const lifePath = lifePathNumber(parsed.day, parsed.month, parsed.year)
		return {
			lifePath,
			birthday: birthdayNumber(parsed.day),
			meaning: LIFE_PATH_MEANINGS[lifePath],
			personalYear: personalYearNumber(parsed.day, parsed.month, currentYear),
			day: parsed.day,
			month: parsed.month,
			year: parsed.year
		}
	}, [birthDate, currentYear])

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<span className='text-sm text-muted-foreground'>
						Дата рождения — число жизненного пути считается по всем её цифрам
					</span>
				</div>

				<div className='border-b px-5 py-6 sm:px-6'>
					<label className='mx-auto block max-w-sm'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Дата рождения
						</span>
						<DatePicker
							value={birthDate}
							onChange={setBirthDate}
							ariaLabel='Дата рождения'
							className='w-full cursor-pointer rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						/>
					</label>
				</div>

				{result ? (
					<>
						<div className='px-5 py-8 text-center sm:px-6'>
							<span className='block font-mono text-6xl font-bold tracking-tight text-foreground sm:text-7xl'>
								{result.lifePath}
							</span>
							<span className='mt-2 block text-base font-medium text-muted-foreground'>
								число жизненного пути, оно же число судьбы
							</span>
						</div>

						<div className='border-t px-5 py-6 sm:px-6'>
							<h2 className='text-lg font-semibold text-foreground'>
								{result.meaning.title}
							</h2>
							<p className='mt-2 text-sm text-muted-foreground'>
								{result.meaning.text}
							</p>
						</div>

						<div className='grid grid-cols-2 gap-4 border-t px-5 py-6 text-center sm:px-6'>
							<div>
								<span className='block font-mono text-xl font-semibold text-foreground'>
									{result.lifePath}
								</span>
								<span className='mt-1 block text-sm text-muted-foreground'>
									жизненный путь
								</span>
							</div>
							<div>
								<span className='block font-mono text-xl font-semibold text-foreground'>
									{result.birthday}
								</span>
								<span className='mt-1 block text-sm text-muted-foreground'>
									число дня рождения
								</span>
							</div>
						</div>

						<div className='border-t px-5 py-6 sm:px-6'>
							<div className='mx-auto max-w-lg rounded-xl border border-primary bg-primary/5 p-5 text-center'>
								<span className='block font-mono text-3xl font-bold tracking-tight text-primary'>
									{result.personalYear}
								</span>
								<span className='mt-1 block text-sm font-medium text-foreground'>
									Персональный год {currentYear}
								</span>
								<p className='mt-2 text-sm text-muted-foreground'>
									{PERSONAL_YEAR_MEANINGS[result.personalYear]}
								</p>
							</div>

							<NumerologyStepBreakdown
								day={result.day}
								month={result.month}
								year={result.year}
								currentYear={currentYear}
							/>
						</div>
					</>
				) : (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						Укажите дату рождения
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						Нумерология — традиция толкования чисел, а не наука. Расчёт
						детерминированный, трактовка — фольклор
					</span>
				</div>
			</Card>

			<NumerologyCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
