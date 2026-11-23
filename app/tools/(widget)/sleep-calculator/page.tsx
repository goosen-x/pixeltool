'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { toolBar, toolFooterBar, toolPill } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { cn } from '@/lib/utils'
import { pluralizeRu } from '@/lib/utils/pluralize'
import {
	bedtimesForWake,
	formatDuration,
	formatTime,
	parseTime,
	wakeTimesForBedtime,
	type SleepOption
} from '@/lib/sleep-calculator'
import { SleepCalculatorSeo } from './SleepCalculatorSeo'

type Mode = 'wake' | 'bed' | 'now'

const MODES: { value: Mode; label: string }[] = [
	{ value: 'wake', label: 'Встать в…' },
	{ value: 'bed', label: 'Лечь в…' },
	{ value: 'now', label: 'Лечь сейчас' }
]

const QUICK: Record<'wake' | 'bed', string[]> = {
	wake: ['6:00', '6:30', '7:00', '7:30', '8:00'],
	bed: ['22:00', '22:30', '23:00', '23:30', '00:00']
}

const FALL_ASLEEP = [5, 10, 15, 20, 30]
const CYCLES = [80, 90, 100]

const inputClass =
	'w-full rounded-md border bg-background px-3 py-2 font-mono text-2xl text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'

function nowMinutes() {
	const d = new Date()
	return d.getHours() * 60 + d.getMinutes()
}

function OptionCard({
	option,
	mode,
	fallAsleep
}: {
	option: SleepOption
	mode: Mode
	fallAsleep: number
}) {
	const main = mode === 'wake' ? option.bedtime : option.wake
	const cycles = `${option.cycles} ${pluralizeRu(option.cycles, ['цикл', 'цикла', 'циклов'])}`
	return (
		<div
			className={cn(
				'rounded-lg border px-4 py-5 text-center',
				option.recommended && 'border-primary bg-primary/5'
			)}
		>
			<span className='block font-mono text-3xl font-bold text-foreground'>
				{formatTime(main)}
			</span>
			<span className='mt-1 block text-sm text-muted-foreground'>
				{formatDuration(option.sleepMinutes)} сна, {cycles}
			</span>
			{mode === 'wake' && fallAsleep > 0 && (
				<span className='mt-1 block text-xs text-muted-foreground'>
					уснуть в {formatTime(option.asleepAt)}
				</span>
			)}
			{option.recommended && (
				<span className='mt-2 block text-xs font-medium text-primary'>
					норма 7–9 часов
				</span>
			)}
		</div>
	)
}

export default function SleepCalculatorPage() {
	const widget = getWidgetById('sleep-calculator')!

	const [mode, setMode] = useState<Mode>('wake')
	const [wakeInput, setWakeInput] = useState('7:00')
	const [bedInput, setBedInput] = useState('23:00')
	const [fallAsleep, setFallAsleep] = useState(15)
	const [cycle, setCycle] = useState(90)
	// текущее время только на клиенте: на сервере оно другое и сломает гидрацию
	const [now, setNow] = useState<number | null>(null)

	useEffect(() => {
		if (mode !== 'now') return
		setNow(nowMinutes())
		const timer = setInterval(() => setNow(nowMinutes()), 15_000)
		return () => clearInterval(timer)
	}, [mode])

	const input = mode === 'wake' ? wakeInput : bedInput
	const setInput = mode === 'wake' ? setWakeInput : setBedInput

	const start = mode === 'now' ? now : parseTime(input)

	const options = useMemo(() => {
		if (start === null) return null
		const settings = { cycle, fallAsleep }
		return mode === 'wake'
			? bedtimesForWake(start, settings)
			: wakeTimesForBedtime(start, settings)
	}, [start, mode, cycle, fallAsleep])

	const heading =
		mode === 'wake'
			? 'Лечь в постель в'
			: mode === 'bed'
				? 'Поставить будильник на'
				: 'Если лечь сейчас, будильник на'

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<div className='flex flex-wrap gap-1.5'>
						{MODES.map(option => (
							<button
								key={option.value}
								type='button'
								onClick={() => setMode(option.value)}
								aria-pressed={mode === option.value}
								className={toolPill(mode === option.value)}
							>
								{option.label}
							</button>
						))}
					</div>
				</div>

				<div className='border-b px-5 py-6 sm:px-6'>
					{mode === 'now' ? (
						<div className='text-center'>
							<span className='block text-sm text-muted-foreground'>
								Сейчас
							</span>
							<span className='mt-1 block font-mono text-4xl font-bold text-foreground'>
								{now === null ? '--:--' : formatTime(now)}
							</span>
						</div>
					) : (
						<div className='mx-auto max-w-md'>
							<label className='block'>
								<span className='mb-1.5 block text-sm text-muted-foreground'>
									{mode === 'wake'
										? 'Во сколько нужно встать'
										: 'Во сколько ляжете'}
								</span>
								<input
									type='text'
									inputMode='text'
									value={input}
									onChange={event => setInput(event.target.value)}
									placeholder='7:00'
									aria-label={
										mode === 'wake' ? 'Время подъёма' : 'Время отхода ко сну'
									}
									className={inputClass}
								/>
							</label>
							<div className='mt-3 flex flex-wrap gap-1.5'>
								{QUICK[mode].map(value => (
									<button
										key={value}
										type='button'
										onClick={() => setInput(value)}
										aria-pressed={parseTime(input) === parseTime(value)}
										className={toolPill(parseTime(input) === parseTime(value))}
									>
										{value}
									</button>
								))}
							</div>
						</div>
					)}
				</div>

				{options ? (
					<div className='px-5 py-6 sm:px-6'>
						<p className='mb-4 text-center text-sm text-muted-foreground'>
							{heading}
						</p>
						<div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
							{options.map(option => (
								<OptionCard
									key={option.cycles}
									option={option}
									mode={mode}
									fallAsleep={fallAsleep}
								/>
							))}
						</div>
					</div>
				) : (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						{mode === 'now'
							? 'Смотрим на часы…'
							: 'Введите время в формате 7:00 или 23:30'}
					</p>
				)}

				<div className={toolFooterBar}>
					<div className='flex flex-wrap items-center gap-x-3 gap-y-2'>
						<span className='text-sm text-muted-foreground'>
							Засыпаю за, мин
						</span>
						<div className='flex flex-wrap gap-1.5'>
							{FALL_ASLEEP.map(value => (
								<button
									key={value}
									type='button'
									onClick={() => setFallAsleep(value)}
									aria-pressed={fallAsleep === value}
									className={toolPill(fallAsleep === value)}
								>
									{value}
								</button>
							))}
						</div>
					</div>
					<div className='flex flex-wrap items-center gap-x-3 gap-y-2'>
						<span className='text-sm text-muted-foreground'>Цикл, мин</span>
						<div className='flex flex-wrap gap-1.5'>
							{CYCLES.map(value => (
								<button
									key={value}
									type='button'
									onClick={() => setCycle(value)}
									aria-pressed={cycle === value}
									className={toolPill(cycle === value)}
								>
									{value}
								</button>
							))}
						</div>
					</div>
				</div>
				<div className='border-t px-5 py-3 text-sm text-muted-foreground sm:px-6'>
					Время подобрано так, чтобы будильник попал на конец цикла сна, а не на
					середину глубокого сна. Выделены варианты с 7–9 часами сна.
				</div>
			</Card>

			<SleepCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
