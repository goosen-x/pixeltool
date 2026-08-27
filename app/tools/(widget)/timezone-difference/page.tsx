'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowLeftRight, Check, Copy } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toolBar, toolIconButton } from '@/lib/ui/tool-pill'
import { TIMEZONE_CITIES, getTimezoneCity } from '@/lib/data/timezones'
import {
	dayShift,
	formatZonedNow,
	formatZonedTime,
	offsetDifferenceMinutes,
	wallTimeToUtc
} from '@/lib/utils/timezone'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { pluralizeRu } from '@/lib/utils/pluralize'
import { TimezoneDifferenceSeo } from './TimezoneDifferenceSeo'

function nowHHMM(date: Date): string {
	return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

export default function TimezoneDifferencePage() {
	const widget = getWidgetById('timezone-difference')!

	const [fromZone, setFromZone] = useState('Europe/Moscow')
	const [toZone, setToZone] = useState('America/New_York')
	const [now, setNow] = useState<Date | null>(null)
	const [customTime, setCustomTime] = useState('')
	const [copied, setCopied] = useState(false)

	// now остаётся null до монтирования на клиенте, время сервера и
	// браузера отличается на секунды-минуты, рендерить его при SSR означало
	// бы почти гарантированный hydration mismatch.
	useEffect(() => {
		const update = () => setNow(new Date())
		update()
		const id = setInterval(update, 30000)
		return () => clearInterval(id)
	}, [])

	useEffect(() => {
		if (now) setCustomTime(nowHHMM(now))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fromZone])

	const swapZones = () => {
		setFromZone(toZone)
		setToZone(fromZone)
	}

	const diffMinutes = now ? offsetDifferenceMinutes(fromZone, toZone, now) : 0
	const fromCity = getTimezoneCity(fromZone)
	const toCity = getTimezoneCity(toZone)

	const converted = useMemo(() => {
		if (!now || !customTime) return null
		const [h, m] = customTime.split(':').map(Number)
		if (Number.isNaN(h) || Number.isNaN(m)) return null

		const instant = wallTimeToUtc(h, m, fromZone, now)
		return {
			time: formatZonedTime(toZone, instant),
			shift: dayShift(instant, fromZone, toZone)
		}
	}, [customTime, fromZone, toZone, now])

	const diffHours = Math.floor(Math.abs(diffMinutes) / 60)
	const diffRemainderMinutes = Math.abs(diffMinutes) % 60
	const diffLabel =
		diffRemainderMinutes === 0
			? `${diffHours} ${pluralizeRu(diffHours, ['час', 'часа', 'часов'])}`
			: `${diffHours} ч ${diffRemainderMinutes} мин`

	const diffText =
		diffMinutes === 0
			? 'В этих городах сейчас одно и то же время'
			: `${toCity?.nameRu ?? toZone} ${diffMinutes > 0 ? 'впереди' : 'позади'} ${fromCity?.nameRu ?? fromZone} на ${diffLabel}`

	const summaryText = now
		? `${fromCity?.nameRu ?? fromZone}: ${formatZonedNow(fromZone, now)} · ${toCity?.nameRu ?? toZone}: ${formatZonedNow(toZone, now)}. ${diffText}.`
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
					<span className='text-sm text-muted-foreground'>
						{now ? diffText : 'Считаем разницу…'}
					</span>

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

				<div className='grid items-end gap-4 border-b px-5 py-6 sm:grid-cols-[1fr_auto_1fr] sm:px-6'>
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Откуда
						</span>
						<select
							value={fromZone}
							onChange={event => setFromZone(event.target.value)}
							aria-label='Часовой пояс отправления'
							className='w-full cursor-pointer rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						>
							{TIMEZONE_CITIES.map(city => (
								<option key={city.id} value={city.id}>
									{city.nameRu}
								</option>
							))}
						</select>
					</label>

					<Button
						size='icon'
						variant='ghost'
						onClick={swapZones}
						title='Поменять местами'
						className={cn(toolIconButton, 'mx-auto')}
					>
						<ArrowLeftRight className='h-4 w-4' />
					</Button>

					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Куда
						</span>
						<select
							value={toZone}
							onChange={event => setToZone(event.target.value)}
							aria-label='Часовой пояс назначения'
							className='w-full cursor-pointer rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						>
							{TIMEZONE_CITIES.map(city => (
								<option key={city.id} value={city.id}>
									{city.nameRu}
								</option>
							))}
						</select>
					</label>
				</div>

				<div className='grid gap-6 px-5 py-8 text-center sm:grid-cols-2 sm:px-6'>
					<div>
						<span className='block font-mono text-4xl font-bold tracking-tight text-foreground sm:text-5xl'>
							{now ? formatZonedTime(fromZone, now) : '--:--'}
						</span>
						<span className='mt-1 block text-sm text-muted-foreground'>
							{fromCity?.nameRu ?? fromZone}
						</span>
					</div>
					<div>
						<span className='block font-mono text-4xl font-bold tracking-tight text-foreground sm:text-5xl'>
							{now ? formatZonedTime(toZone, now) : '--:--'}
						</span>
						<span className='mt-1 block text-sm text-muted-foreground'>
							{toCity?.nameRu ?? toZone}
						</span>
					</div>
				</div>

				{/* Перевод конкретного времени, не только «сейчас», но и подбор
				    времени созвона на любой час дня. */}
				<div className='border-t px-5 py-6 sm:px-6'>
					<label className='block max-w-xs'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Время в городе «Откуда»
						</span>
						<input
							type='time'
							value={customTime}
							onChange={event => setCustomTime(event.target.value)}
							aria-label='Время для перевода'
							className='w-full cursor-pointer rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						/>
					</label>

					{converted && (
						<p className='mt-3 text-sm text-muted-foreground'>
							Это{' '}
							<span className='font-mono font-semibold text-foreground'>
								{converted.time}
							</span>{' '}
							в городе «Куда»
							{converted.shift === 1 && ', на следующий день'}
							{converted.shift === -1 && ', днём раньше'}
							{converted.shift !== 0 &&
								Math.abs(converted.shift) > 1 &&
								` (сдвиг на ${Math.abs(converted.shift)} дня)`}
						</p>
					)}
				</div>
			</Card>

			<TimezoneDifferenceSeo />
		</WidgetSEOWrapper>
	)
}
