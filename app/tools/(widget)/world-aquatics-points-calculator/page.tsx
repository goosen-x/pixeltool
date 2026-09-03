'use client'

import { useEffect, useMemo, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ToolSelect } from '@/components/ui/tool-select'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill,
	toolToggleOption,
	toolToggleTrack
} from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import {
	DISTANCES,
	STROKE_LABELS,
	COURSE_LABELS,
	getBaseTime,
	type SwimCourse,
	type SwimGender,
	type SwimStroke
} from '@/lib/constants/world-aquatics-points'
import {
	calculatePoints,
	calculateTimeForPoints,
	formatSwimTime,
	parseSwimTime
} from '@/lib/utils/world-aquatics-points'
import { WorldAquaticsPointsCalculatorSeo } from './WorldAquaticsPointsCalculatorSeo'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'

type Mode = 'time-to-points' | 'points-to-time'

const STROKES: SwimStroke[] = [
	'freestyle',
	'backstroke',
	'breaststroke',
	'butterfly',
	'medley'
]

const timeInputClass =
	'w-16 rounded-md border bg-background px-2 py-1.5 text-center font-mono text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'

export default function WorldAquaticsPointsCalculatorPage() {
	const widget = getWidgetById('world-aquatics-points-calculator')!

	const [mode, setMode] = useState<Mode>('time-to-points')
	const [gender, setGender] = useState<SwimGender>('male')
	const [course, setCourse] = useState<SwimCourse>('LCM')
	const [stroke, setStroke] = useState<SwimStroke>('freestyle')
	const [distance, setDistance] = useState(100)

	const [minutes, setMinutes] = useState('')
	const [seconds, setSeconds] = useState('55')
	const [hundredths, setHundredths] = useState('00')
	const [points, setPoints] = useState('850')

	const [copied, setCopied] = useState(false)

	const availableDistances = DISTANCES[course][stroke]

	// Дистанция прошлого стиля может не существовать у нового (например,
	// комплекс на 100 м есть только в короткой воде) — переключаем на первую
	// подходящую, а не оставляем невалидный выбор.
	useEffect(() => {
		if (!availableDistances.includes(distance)) {
			setDistance(availableDistances[0])
		}
	}, [availableDistances, distance])

	const baseTime = getBaseTime(course, gender, stroke, distance)

	const eventLabel = `${gender === 'male' ? 'Мужчины' : 'Женщины'}, ${STROKE_LABELS[stroke].toLowerCase()} ${distance} м, ${COURSE_LABELS[course]}`

	const result = useMemo(() => {
		if (!baseTime) return null

		if (mode === 'time-to-points') {
			const swimTime = parseSwimTime(minutes, seconds, hundredths)
			if (swimTime === null || swimTime <= 0) return null
			return { points: calculatePoints(baseTime, swimTime) }
		}

		const targetPoints = Number(points)
		if (!points.trim() || !Number.isFinite(targetPoints) || targetPoints <= 0)
			return null
		return {
			time: formatSwimTime(calculateTimeForPoints(baseTime, targetPoints))
		}
	}, [baseTime, mode, minutes, seconds, hundredths, points])

	const summaryText = useMemo(() => {
		if (!result) return ''
		if ('points' in result) {
			return `${formatSwimTime(parseSwimTime(minutes, seconds, hundredths) ?? 0)} (${eventLabel}) = ${result.points} очков World Aquatics`
		}
		return `${points} очков World Aquatics (${eventLabel}) = ${result.time}`
	}, [result, minutes, seconds, hundredths, points, eventLabel])

	const copyResult = async () => {
		if (!summaryText) return
		await navigator.clipboard.writeText(summaryText)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<div className={toolToggleTrack}>
						{(
							[
								['time-to-points', 'Время → очки'],
								['points-to-time', 'Очки → время']
							] as [Mode, string][]
						).map(([value, label]) => (
							<button
								key={value}
								type='button'
								onClick={() => setMode(value)}
								aria-pressed={mode === value}
								className={toolToggleOption(mode === value)}
							>
								{label}
							</button>
						))}
					</div>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
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

				<div className='space-y-4 border-b px-5 py-6 sm:px-6'>
					<div className='flex flex-wrap items-center gap-4'>
						<div className={toolToggleTrack}>
							{(
								[
									['male', 'Мужчины'],
									['female', 'Женщины']
								] as [SwimGender, string][]
							).map(([value, label]) => (
								<button
									key={value}
									type='button'
									onClick={() => setGender(value)}
									aria-pressed={gender === value}
									className={toolToggleOption(gender === value)}
								>
									{label}
								</button>
							))}
						</div>

						<div className={toolToggleTrack}>
							{(
								[
									['LCM', '50 м'],
									['SCM', '25 м']
								] as [SwimCourse, string][]
							).map(([value, label]) => (
								<button
									key={value}
									type='button'
									onClick={() => setCourse(value)}
									aria-pressed={course === value}
									className={toolToggleOption(course === value)}
								>
									{label}
								</button>
							))}
						</div>

						<ToolSelect
							value={distance}
							onChange={event => setDistance(Number(event.target.value))}
							aria-label='Дистанция'
						>
							{availableDistances.map(d => (
								<option key={d} value={d}>
									{d} м
								</option>
							))}
						</ToolSelect>
					</div>

					<div className='flex flex-wrap items-center gap-1.5'>
						{STROKES.map(value => (
							<button
								key={value}
								type='button'
								onClick={() => setStroke(value)}
								aria-pressed={stroke === value}
								className={toolPill(stroke === value)}
							>
								{STROKE_LABELS[value]}
							</button>
						))}
					</div>
				</div>

				<div className='border-b px-5 py-6 sm:px-6'>
					{mode === 'time-to-points' ? (
						<label className='block'>
							<span className='mb-1.5 block text-sm text-muted-foreground'>
								Время
							</span>
							<div className='flex items-center gap-1.5'>
								<input
									type='text'
									inputMode='numeric'
									value={minutes}
									onChange={event => setMinutes(event.target.value)}
									placeholder='0'
									aria-label='Минуты'
									className={timeInputClass}
								/>
								<span className='text-muted-foreground'>:</span>
								<input
									type='text'
									inputMode='numeric'
									value={seconds}
									onChange={event => setSeconds(event.target.value)}
									placeholder='00'
									aria-label='Секунды'
									className={timeInputClass}
								/>
								<span className='text-muted-foreground'>.</span>
								<input
									type='text'
									inputMode='numeric'
									value={hundredths}
									onChange={event => setHundredths(event.target.value)}
									placeholder='00'
									aria-label='Сотые секунды'
									className={timeInputClass}
								/>
							</div>
						</label>
					) : (
						<label className='block'>
							<span className='mb-1.5 block text-sm text-muted-foreground'>
								Очки World Aquatics
							</span>
							<input
								type='text'
								inputMode='numeric'
								value={points}
								onChange={event => setPoints(event.target.value)}
								aria-label='Очки World Aquatics'
								className='w-32 rounded-md border bg-background px-3 py-1.5 font-mono text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
							/>
						</label>
					)}
				</div>

				{result ? (
					<div className='px-5 py-8 text-center sm:px-6'>
						<span className='block font-mono text-5xl font-bold tracking-tight text-foreground sm:text-6xl'>
							{'points' in result ? result.points : result.time}
						</span>
						<span className='mt-2 block text-sm text-muted-foreground'>
							{'points' in result ? 'очков World Aquatics' : eventLabel}
						</span>
					</div>
				) : (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						{mode === 'time-to-points'
							? 'Впишите время'
							: 'Впишите число очков'}
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						Базовые времена — официальные таблицы World Aquatics: LCM 2026, SCM
						2025/26. Очки округляются вниз до целого.
					</span>
				</div>
			</Card>

			<ToolScreenshot slug='world-aquatics-points-calculator' />
			<WorldAquaticsPointsCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
