'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { toolBar, toolFooterBar, toolPill } from '@/lib/ui/tool-pill'
import {
	countdownTo,
	nextOccurrence,
	RECURRING_TARGETS,
	startOfDay
} from '@/lib/utils/days-until'
import { pluralizeRu } from '@/lib/utils/pluralize'

function toInputValue(date: Date): string {
	const pad = (n: number) => String(n).padStart(2, '0')
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

interface DaysUntilWidgetProps {
	/** Слаг повторяющейся даты — на подстранице она подставлена сразу. */
	initialSlug?: string
}

export function DaysUntilWidget({ initialSlug }: DaysUntilWidgetProps) {
	// Дата вычисляется на клиенте: на сервере «сегодня» было бы временем
	// сборки, и статическая страница показывала бы вчерашний ответ.
	const [now, setNow] = useState<Date | null>(null)
	const [value, setValue] = useState('')
	const [activeSlug, setActiveSlug] = useState(initialSlug ?? '')

	useEffect(() => {
		const today = new Date()
		setNow(today)
		const target = RECURRING_TARGETS.find(t => t.slug === (initialSlug ?? ''))
		setValue(
			toInputValue(
				target
					? nextOccurrence(target, today)
					: nextOccurrence(RECURRING_TARGETS[0], today)
			)
		)
		if (!initialSlug) setActiveSlug(RECURRING_TARGETS[0].slug)
	}, [initialSlug])

	// Обновляем раз в минуту: в полночь ответ должен меняться сам, без
	// перезагрузки страницы.
	useEffect(() => {
		const timer = setInterval(() => setNow(new Date()), 60_000)
		return () => clearInterval(timer)
	}, [])

	const result = useMemo(() => {
		if (!now || !value) return null
		const [y, m, d] = value.split('-').map(Number)
		if (!y || !m || !d) return null
		return {
			target: new Date(y, m - 1, d),
			countdown: countdownTo(new Date(y, m - 1, d), now)
		}
	}, [value, now])

	const pick = (slug: string) => {
		const target = RECURRING_TARGETS.find(t => t.slug === slug)
		if (!target || !now) return
		setActiveSlug(slug)
		setValue(toInputValue(nextOccurrence(target, now)))
	}

	return (
		<Card className='overflow-hidden p-0'>
			<div className={toolBar}>
				<div className='flex flex-wrap items-center gap-1.5'>
					{RECURRING_TARGETS.map(target => (
						<button
							key={target.slug}
							type='button'
							onClick={() => pick(target.slug)}
							aria-pressed={activeSlug === target.slug}
							className={toolPill(activeSlug === target.slug)}
						>
							{target.name}
						</button>
					))}
				</div>

				<label className='flex items-center gap-2 text-sm text-muted-foreground sm:ml-auto'>
					или своя дата
					<input
						type='date'
						value={value}
						onChange={event => {
							setValue(event.target.value)
							setActiveSlug('')
						}}
						aria-label='Дата, до которой считаем'
						className='rounded-md border bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
					/>
				</label>
			</div>

			<div className='px-5 py-10 text-center sm:px-6'>
				{!result ? (
					<p className='text-sm text-muted-foreground'>Считаем…</p>
				) : result.countdown.isToday ? (
					<p className='text-3xl font-bold tracking-tight'>Сегодня!</p>
				) : result.countdown.passed ? (
					<>
						<span className='block font-mono text-5xl font-bold tracking-tight tabular-nums'>
							{Math.abs(result.countdown.days)}
						</span>
						<span className='mt-2 block text-muted-foreground'>
							{pluralizeRu(Math.abs(result.countdown.days), [
								'день',
								'дня',
								'дней'
							])}{' '}
							назад
						</span>
					</>
				) : (
					<>
						<span className='block font-mono text-5xl font-bold tracking-tight tabular-nums sm:text-6xl'>
							{result.countdown.days}
						</span>
						<span className='mt-2 block text-lg text-muted-foreground'>
							{pluralizeRu(result.countdown.days, ['день', 'дня', 'дней'])}
						</span>
						<span className='mt-4 block text-sm text-muted-foreground'>
							это {result.countdown.weeks}{' '}
							{pluralizeRu(result.countdown.weeks, [
								'неделя',
								'недели',
								'недель'
							])}
							{result.countdown.daysAfterWeeks > 0 && (
								<>
									{' '}
									и {result.countdown.daysAfterWeeks}{' '}
									{pluralizeRu(result.countdown.daysAfterWeeks, [
										'день',
										'дня',
										'дней'
									])}
								</>
							)}
							, из них {result.countdown.workdays}{' '}
							{pluralizeRu(result.countdown.workdays, [
								'рабочий',
								'рабочих',
								'рабочих'
							])}
						</span>
					</>
				)}
			</div>

			<div className={toolFooterBar}>
				<span className='text-sm text-muted-foreground'>
					Рабочие дни считаются вычетом суббот и воскресений. Праздники не
					учитываются: их переносы устанавливаются на каждый год отдельным
					постановлением
				</span>
			</div>
		</Card>
	)
}
