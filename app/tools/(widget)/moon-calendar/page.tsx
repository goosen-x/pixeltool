'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toolBar, toolFooterBar, toolIconButton } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { MoonDisc } from '@/components/tools/MoonDisc'
import {
	getMoonState,
	moonMonth,
	nextFullMoon,
	nextNewMoon
} from '@/lib/utils/moon'
import { MoonCalendarSeo } from './MoonCalendarSeo'

const MONTHS = [
	'январь',
	'февраль',
	'март',
	'апрель',
	'май',
	'июнь',
	'июль',
	'август',
	'сентябрь',
	'октябрь',
	'ноябрь',
	'декабрь'
]
const WEEKDAYS = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']

function formatDate(date: Date): string {
	return date.toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'long'
	})
}

export default function MoonCalendarPage() {
	const widget = getWidgetById('moon-calendar')!

	// Сегодняшняя дата берётся в браузере: на сервере это было бы время
	// сборки, и статическая страница показывала бы луну месячной давности.
	const [today, setToday] = useState<Date | null>(null)
	const [cursor, setCursor] = useState<{ year: number; month: number } | null>(
		null
	)

	useEffect(() => {
		const now = new Date()
		setToday(now)
		setCursor({ year: now.getFullYear(), month: now.getMonth() + 1 })
	}, [])

	const days = useMemo(
		() => (cursor ? moonMonth(cursor.year, cursor.month) : []),
		[cursor]
	)

	const state = today ? getMoonState(today) : null

	const shift = (delta: number) =>
		setCursor(current => {
			if (!current) return current
			const date = new Date(current.year, current.month - 1 + delta, 1)
			return { year: date.getFullYear(), month: date.getMonth() + 1 }
		})

	// Пустые клетки перед первым числом, чтобы месяц лёг на дни недели
	const offset = days.length ? (days[0].date.getDay() + 6) % 7 : 0

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<span className='flex items-center gap-1'>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => shift(-1)}
							title='Предыдущий месяц'
							className={toolIconButton}
						>
							<ChevronLeft className='h-4 w-4' />
						</Button>
						<span className='min-w-40 text-center text-sm'>
							{cursor ? `${MONTHS[cursor.month - 1]} ${cursor.year}` : '…'}
						</span>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => shift(1)}
							title='Следующий месяц'
							className={toolIconButton}
						>
							<ChevronRight className='h-4 w-4' />
						</Button>
					</span>
				</div>

				{state && today && (
					<div className='flex flex-col items-center gap-3 border-b px-5 py-8 sm:px-6'>
						<MoonDisc
							illumination={state.illumination}
							waxing={state.phase.waxing}
							size={140}
						/>
						<span className='text-2xl font-bold tracking-tight'>
							{state.phase.name}
						</span>
						<span className='text-sm text-muted-foreground'>
							{state.lunarDay}-й лунный день · освещено{' '}
							{Math.round(state.illumination * 100)}%
						</span>
						<div className='mt-2 flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm text-muted-foreground'>
							<span>
								Новолуние{' '}
								<span className='text-foreground'>
									{formatDate(nextNewMoon(today))}
								</span>
							</span>
							<span>
								Полнолуние{' '}
								<span className='text-foreground'>
									{formatDate(nextFullMoon(today))}
								</span>
							</span>
						</div>
					</div>
				)}

				<div className='px-3 py-5 sm:px-5'>
					<div className='grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground'>
						{WEEKDAYS.map(day => (
							<span key={day} className='py-1'>
								{day}
							</span>
						))}
						{Array.from({ length: offset }, (_, i) => (
							<span key={`empty-${i}`} />
						))}
						{days.map(({ date, state: dayState }) => {
							const isToday =
								today &&
								date.getFullYear() === today.getFullYear() &&
								date.getMonth() === today.getMonth() &&
								date.getDate() === today.getDate()

							return (
								<span
									key={date.getDate()}
									title={`${dayState.phase.name}, ${dayState.lunarDay}-й лунный день`}
									className={`flex flex-col items-center gap-0.5 rounded-lg py-1.5 ${
										isToday ? 'bg-primary/10 ring-1 ring-primary' : ''
									}`}
								>
									<span className='text-sm text-foreground'>
										{date.getDate()}
									</span>
									<MoonDisc
										illumination={dayState.illumination}
										waxing={dayState.phase.waxing}
										size={22}
									/>
									<span className='text-[0.65rem] text-muted-foreground'>
										{dayState.lunarDay}
									</span>
								</span>
							)
						})}
					</div>
				</div>

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						Расчёт по среднему синодическому месяцу — точность до нескольких
						часов. Для затмений и астрологической карты нужны эфемериды, не это
						приближение
					</span>
				</div>
			</Card>

			<MoonCalendarSeo />
		</WidgetSEOWrapper>
	)
}
