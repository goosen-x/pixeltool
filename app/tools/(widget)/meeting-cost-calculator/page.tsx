'use client'

import { useMemo, useState } from 'react'
import { Check, Copy } from 'lucide-react'
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
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'
import { MeetingCostCalculatorSeo } from './MeetingCostCalculatorSeo'

type Recurrence = 'once' | 'weekly' | 'biweekly' | 'monthly'

const RECUR: { id: Recurrence; label: string; perYear: number }[] = [
	{ id: 'once', label: 'разовая', perYear: 0 },
	{ id: 'weekly', label: 'еженедельно', perYear: 52 },
	{ id: 'biweekly', label: 'раз в 2 недели', perYear: 26 },
	{ id: 'monthly', label: 'ежемесячно', perYear: 12 }
]

function toNumber(value: string): number | null {
	const parsed = parseFloat(value.replace(/\s/g, '').replace(',', '.'))
	return Number.isFinite(parsed) ? parsed : null
}

function fmt(value: number, digits = 0): string {
	return value.toLocaleString('ru-RU', { maximumFractionDigits: digits })
}

const inputClass =
	'w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'

export default function MeetingCostCalculatorPage() {
	const widget = getWidgetById('meeting-cost-calculator')!

	const [people, setPeople] = useState('8')
	const [rate, setRate] = useState('1500')
	const [minutes, setMinutes] = useState('45')
	const [recur, setRecur] = useState<Recurrence>('weekly')
	const [copied, setCopied] = useState(false)

	const result = useMemo(() => {
		const p = toNumber(people)
		const r = toNumber(rate)
		const m = toNumber(minutes)
		if (p === null || r === null || m === null || m <= 0) return null
		const perMeeting = p * r * (m / 60)
		const perYear = perMeeting * (RECUR.find(x => x.id === recur)!.perYear || 0)
		return { perMeeting, perYear }
	}, [people, rate, minutes, recur])

	const summary = result
		? `Одна встреча: ${fmt(result.perMeeting)}` +
			(result.perYear ? `, за год: ${fmt(result.perYear)}` : '')
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
						Параметры встречи
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
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Участников
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={people}
							onChange={e => setPeople(e.target.value)}
							aria-label='Участников'
							className={inputClass}
						/>
					</label>
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Средняя ставка, в час
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={rate}
							onChange={e => setRate(e.target.value)}
							aria-label='Средняя ставка в час'
							className={inputClass}
						/>
					</label>
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Длительность, мин.
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={minutes}
							onChange={e => setMinutes(e.target.value)}
							aria-label='Длительность в минутах'
							className={inputClass}
						/>
					</label>
				</div>

				<div className='flex flex-wrap items-center gap-1.5 border-b px-5 py-3 sm:px-6'>
					<span className='mr-1 text-sm text-muted-foreground'>
						Периодичность:
					</span>
					{RECUR.map(r => (
						<button
							key={r.id}
							type='button'
							onClick={() => setRecur(r.id)}
							aria-pressed={recur === r.id}
							className={toolPill(recur === r.id)}
						>
							{r.label}
						</button>
					))}
				</div>

				{result ? (
					<div className='px-5 py-8 text-center sm:px-6'>
						<span className='block font-mono text-5xl font-bold tracking-tight text-foreground sm:text-6xl'>
							{fmt(result.perMeeting)}
						</span>
						<span className='mt-1 block text-sm text-muted-foreground'>
							стоит одна такая встреча
							{result.perYear > 0 && <> · {fmt(result.perYear)} в год</>}
						</span>
					</div>
				) : (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						Заполните все поля
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						Часовую ставку берут из оклада: делят на ≈165 рабочих часов в
						месяце; с налогами и накладными она выше в полтора-два раза
					</span>
				</div>
			</Card>

			<ToolScreenshot slug='meeting-cost-calculator' />
			<MeetingCostCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
