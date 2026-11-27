'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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
import { MoonDisc } from '@/components/tools/MoonDisc'
import {
	getMoonState,
	moonMonth,
	nextFullMoon,
	nextNewMoon,
	phaseOfDay,
	MOON_SIGNS,
	type MoonDay
} from '@/lib/utils/moon'
import { MoonCalendarSeo } from './MoonCalendarSeo'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'

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
	return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
}

function formatTime(date: Date): string {
	return date.toLocaleTimeString('ru-RU', {
		hour: '2-digit',
		minute: '2-digit'
	})
}

function formatDateTime(date: Date): string {
	return `${formatDate(date)} в ${formatTime(date)}`
}

function sameDay(a: Date, b: Date): boolean {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	)
}

export default function MoonCalendarPage() {
	const widget = getWidgetById('moon-calendar')!

	// Сегодняшняя дата берётся в браузере: на сервере это было бы время
	// сборки, и статическая страница показывала бы луну месячной давности.
	const [now, setNow] = useState<Date | null>(null)
	const [cursor, setCursor] = useState<{ year: number; month: number } | null>(
		null
	)
	const [selected, setSelected] = useState<Date | null>(null)

	useEffect(() => {
		const current = new Date()
		setNow(current)
		setSelected(current)
		setCursor({ year: current.getFullYear(), month: current.getMonth() + 1 })
	}, [])

	const days = useMemo(
		() => (cursor ? moonMonth(cursor.year, cursor.month) : []),
		[cursor]
	)

	const isTodaySelected = !!(now && selected && sameDay(now, selected))

	// Для сегодняшнего дня — Луна прямо сейчас, для другого — в полдень.
	// Фаза и события дня берутся из сетки, чтобы панель и календарь не
	// расходились в названии фазы
	const selectedDay: MoonDay | undefined = selected
		? days.find(day => sameDay(day.date, selected))
		: undefined
	const state = selected
		? getMoonState(isTodaySelected && now ? now : selected)
		: null
	const dayPhase = selected ? phaseOfDay(selected) : null
	const phase = dayPhase?.phase
	const event = dayPhase?.event

	const shift = (delta: number) =>
		setCursor(current => {
			if (!current) return current
			const date = new Date(current.year, current.month - 1 + delta, 1)
			return { year: date.getFullYear(), month: date.getMonth() + 1 }
		})

	const goToday = () => {
		const current = new Date()
		setNow(current)
		setSelected(current)
		setCursor({ year: current.getFullYear(), month: current.getMonth() + 1 })
	}

	const showsCurrentMonth =
		!!cursor &&
		!!now &&
		cursor.year === now.getFullYear() &&
		cursor.month === now.getMonth() + 1

	const offset = days.length ? (days[0].date.getDay() + 6) % 7 : 0
	const from = selected ?? now
	const sign = state ? MOON_SIGNS[state.sign] : null

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={`${toolBar} justify-between`}>
					<span className='flex items-center gap-1'>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => shift(-1)}
							title='Предыдущий месяц'
							aria-label='Предыдущий месяц'
							className={toolIconButton}
						>
							<ChevronLeft className='h-4 w-4' />
						</Button>
						<span className='min-w-32 text-center text-sm sm:min-w-40'>
							{cursor ? `${MONTHS[cursor.month - 1]} ${cursor.year}` : '…'}
						</span>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => shift(1)}
							title='Следующий месяц'
							aria-label='Следующий месяц'
							className={toolIconButton}
						>
							<ChevronRight className='h-4 w-4' />
						</Button>
					</span>
					<button
						type='button'
						onClick={goToday}
						className={toolPill(isTodaySelected && showsCurrentMonth)}
					>
						Сегодня
					</button>
				</div>

				{state && selected && phase && (
					<div className='flex flex-col items-center gap-3 border-b px-5 py-8 text-center sm:px-6'>
						<span className='text-sm text-muted-foreground'>
							{isTodaySelected
								? `Сегодня, ${formatDate(selected)}`
								: selected.toLocaleDateString('ru-RU', {
										weekday: 'long',
										day: 'numeric',
										month: 'long',
										year: 'numeric'
									})}
						</span>
						<MoonDisc
							illumination={state.illumination}
							waxing={state.fraction < 0.5}
							size={140}
						/>
						<span className='text-2xl font-bold tracking-tight'>
							{phase.name}
							{event && (
								<span className='font-normal text-muted-foreground'>
									{' '}
									в {formatTime(event.date)}
								</span>
							)}
						</span>
						<span className='text-sm text-muted-foreground'>
							{state.fraction < 0.5 ? 'Растущая' : 'Убывающая'} · освещено{' '}
							{Math.round(state.illumination * 100)}%
							{sign && (
								<>
									{' '}
									· Луна в {sign.prepositional} {sign.symbol}
								</>
							)}
						</span>

						<div className='mt-1 text-base'>
							<span className='font-semibold'>
								{state.lunarDay}-й лунный день
							</span>
							<span className='text-muted-foreground'>
								{' '}
								{isTodaySelected ? 'идёт' : 'в полдень'}, начался{' '}
								{formatDateTime(state.lunarDayStart)}
							</span>
						</div>
						{selectedDay && selectedDay.lunarDayStarts.length > 0 && (
							<div className='text-sm text-muted-foreground'>
								{selectedDay.lunarDayStarts
									.map(
										day =>
											`${day.number}-й начинается в ${formatTime(day.start)}`
									)
									.join(' · ')}
							</div>
						)}

						{from && (
							<div className='mt-2 flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm text-muted-foreground'>
								<span>
									Следующее новолуние{' '}
									<span className='text-foreground'>
										{formatDateTime(nextNewMoon(from))}
									</span>
								</span>
								<span>
									полнолуние{' '}
									<span className='text-foreground'>
										{formatDateTime(nextFullMoon(from))}
									</span>
								</span>
							</div>
						)}
					</div>
				)}

				<div className='px-2 py-5 sm:px-5'>
					<p className='mb-3 text-center text-xs text-muted-foreground'>
						Нажмите на число, чтобы увидеть Луну в этот день. Под диском номер
						лунного дня в полдень
					</p>
					<div className='grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground'>
						{WEEKDAYS.map(day => (
							<span key={day} className='py-1'>
								{day}
							</span>
						))}
						{Array.from({ length: offset }, (_, i) => (
							<span key={`empty-${i}`} />
						))}
						{days.map(({ date, state: dayState, event }) => {
							const isToday = !!now && sameDay(date, now)
							const isSelected = !!selected && sameDay(date, selected)
							const major =
								event?.phase.id === 'new' || event?.phase.id === 'full'

							return (
								<button
									type='button'
									key={date.getDate()}
									onClick={() => setSelected(date)}
									title={`${dayState.phase.name}${event ? ` в ${formatTime(event.date)}` : ''}, ${dayState.lunarDay}-й лунный день`}
									aria-label={`${formatDate(date)}: ${dayState.phase.name}, ${dayState.lunarDay}-й лунный день`}
									aria-pressed={isSelected}
									className={`flex cursor-pointer flex-col items-center gap-0.5 rounded-lg py-1.5 transition-colors hover:bg-muted ${
										isSelected
											? 'bg-primary/10 ring-1 ring-primary'
											: isToday
												? 'ring-1 ring-border'
												: ''
									}`}
								>
									<span
										className={`text-sm ${isToday ? 'font-bold text-primary' : 'text-foreground'}`}
									>
										{date.getDate()}
									</span>
									<MoonDisc
										illumination={dayState.illumination}
										waxing={dayState.fraction < 0.5}
										size={22}
									/>
									<span
										className={`text-[0.65rem] ${major ? 'font-semibold text-amber-600 dark:text-amber-300' : 'text-muted-foreground'}`}
									>
										{event
											? event.phase.id === 'new'
												? 'новол.'
												: event.phase.id === 'full'
													? 'полн.'
													: `${dayState.lunarDay} · ¼`
											: dayState.lunarDay}
									</span>
								</button>
							)
						})}
					</div>
				</div>

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						Фазы считаются по положению Луны и Солнца, точность до пары минут.
						Лунный день начинается с восходом Луны в Москве. Время показано по
						часовому поясу вашего устройства
					</span>
				</div>
			</Card>

			<ToolScreenshot slug='moon-calendar' />
			<MoonCalendarSeo />
		</WidgetSEOWrapper>
	)
}
