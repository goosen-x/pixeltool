'use client'

import { useMemo, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toolBar, toolFooterBar, toolIconButton } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'
import { TeamCapacityCalculatorSeo } from './TeamCapacityCalculatorSeo'

function toNumber(value: string): number | null {
	const parsed = parseFloat(value.replace(/\s/g, '').replace(',', '.'))
	return Number.isFinite(parsed) ? parsed : null
}

function fmt(value: number, digits = 0): string {
	return value.toLocaleString('ru-RU', { maximumFractionDigits: digits })
}

const inputClass =
	'w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'

export default function TeamCapacityCalculatorPage() {
	const widget = getWidgetById('team-capacity-calculator')!

	const [people, setPeople] = useState('5')
	const [hoursPerDay, setHoursPerDay] = useState('8')
	const [days, setDays] = useState('10')
	const [meetingsPerWeek, setMeetingsPerWeek] = useState('5')
	const [pto, setPto] = useState('16')
	const [buffer, setBuffer] = useState('20')
	const [copied, setCopied] = useState(false)

	const result = useMemo(() => {
		const p = toNumber(people)
		const h = toNumber(hoursPerDay)
		const d = toNumber(days)
		const mw = toNumber(meetingsPerWeek)
		const pt = toNumber(pto)
		const b = toNumber(buffer)
		if ([p, h, d, mw, pt, b].some(x => x === null)) return null
		if (p! <= 0 || h! <= 0 || d! <= 0) return null

		const gross = p! * h! * d!
		const meetingHours = mw! * (d! / 5) * p!
		const afterMeetings = Math.max(0, gross - meetingHours - Math.max(0, pt!))
		const available = afterMeetings * (1 - Math.min(100, Math.max(0, b!)) / 100)
		return {
			gross,
			meetingHours,
			pto: Math.max(0, pt!),
			bufferHours: afterMeetings - available,
			available,
			utilisation: gross > 0 ? (available / gross) * 100 : 0
		}
	}, [people, hoursPerDay, days, meetingsPerWeek, pto, buffer])

	const summary = result
		? `Доступно ${fmt(result.available)} ч из ${fmt(result.gross)} ч (${fmt(result.utilisation)}%)`
		: ''

	const copy = async () => {
		if (!summary) return
		await navigator.clipboard.writeText(summary)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<span className='text-sm text-muted-foreground'>
						Команда и спринт
					</span>
					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={copy}
							disabled={!summary}
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

				<div className='grid gap-4 border-b px-5 py-6 sm:grid-cols-3 sm:px-6'>
					{[
						['Человек в команде', people, setPeople, 'Человек в команде'],
						[
							'Рабочих часов в день',
							hoursPerDay,
							setHoursPerDay,
							'Рабочих часов в день'
						],
						['Рабочих дней в спринте', days, setDays, 'Рабочих дней в спринте'],
						[
							'Часов на встречи в неделю (на человека)',
							meetingsPerWeek,
							setMeetingsPerWeek,
							'Часов на встречи в неделю на человека'
						],
						[
							'Отгулы и отпуска, часов (вся команда)',
							pto,
							setPto,
							'Отгулы и отпуска в часах'
						],
						[
							'Буфер на непредвиденное, %',
							buffer,
							setBuffer,
							'Буфер в процентах'
						]
					].map(([label, value, setter, aria]) => (
						<label key={label as string} className='block'>
							<span className='mb-1.5 block text-sm text-muted-foreground'>
								{label as string}
							</span>
							<input
								type='text'
								inputMode='decimal'
								value={value as string}
								onChange={e => (setter as (v: string) => void)(e.target.value)}
								aria-label={aria as string}
								className={inputClass}
							/>
						</label>
					))}
				</div>

				{result ? (
					<>
						<div className='px-5 py-8 text-center sm:px-6'>
							<span className='block font-mono text-5xl font-bold tracking-tight text-foreground sm:text-6xl'>
								{fmt(result.available)} ч
							</span>
							<span className='mt-1 block text-sm text-muted-foreground'>
								реально доступно на задачи · {fmt(result.utilisation)}% от
								номинала
							</span>
						</div>
						<div className='grid grid-cols-2 gap-x-6 gap-y-2 border-t px-5 py-4 text-sm sm:grid-cols-4 sm:px-6'>
							<span className='text-muted-foreground'>
								Номинал:{' '}
								<span className='text-foreground'>{fmt(result.gross)} ч</span>
							</span>
							<span className='text-muted-foreground'>
								Встречи:{' '}
								<span className='text-foreground'>
									−{fmt(result.meetingHours)} ч
								</span>
							</span>
							<span className='text-muted-foreground'>
								Отпуска:{' '}
								<span className='text-foreground'>−{fmt(result.pto)} ч</span>
							</span>
							<span className='text-muted-foreground'>
								Буфер:{' '}
								<span className='text-foreground'>
									−{fmt(result.bufferHours)} ч
								</span>
							</span>
						</div>
					</>
				) : (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						Заполните все поля
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						Планировать на 100% номинала нельзя: продуктивных часов обычно 5–6
						из 8, буфер ниже 15% почти всегда срывает спринт
					</span>
				</div>
			</Card>

			<ToolScreenshot slug='team-capacity-calculator' />
			<TeamCapacityCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
