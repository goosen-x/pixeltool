'use client'

import { useMemo, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toolBar, toolFooterBar, toolIconButton } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'
import { CycleTimeCalculatorSeo } from './CycleTimeCalculatorSeo'

function toNumber(value: string): number | null {
	if (value.trim() === '') return null
	const parsed = parseFloat(value.replace(/\s/g, '').replace(',', '.'))
	return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

function fmt(value: number, digits = 2): string {
	return value.toLocaleString('ru-RU', { maximumFractionDigits: digits })
}

const inputClass =
	'w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'

export default function CycleTimeCalculatorPage() {
	const widget = getWidgetById('cycle-time-calculator')!

	// WIP = throughput × cycleTime
	const [wip, setWip] = useState('12')
	const [throughput, setThroughput] = useState('3')
	const [cycle, setCycle] = useState('')
	const [copied, setCopied] = useState(false)

	const result = useMemo(() => {
		const w = toNumber(wip)
		const t = toNumber(throughput)
		const c = toNumber(cycle)
		const filled = [w, t, c].filter(x => x !== null).length
		if (filled !== 2) return null

		if (w === null) return { field: 'wip' as const, value: t! * c! }
		if (t === null) return { field: 'throughput' as const, value: w! / c! }
		return { field: 'cycle' as const, value: w! / t! }
	}, [wip, throughput, cycle])

	const label =
		result?.field === 'wip'
			? 'задач в работе'
			: result?.field === 'throughput'
				? 'задач закрывается в неделю'
				: 'недель на задачу'

	const summary = result ? `${fmt(result.value)} ${label}` : ''

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
						Закон Литтла — заполните два поля из трёх
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
							Задач в работе одновременно
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={wip}
							onChange={e => setWip(e.target.value)}
							aria-label='Задач в работе одновременно'
							placeholder='—'
							className={inputClass}
						/>
					</label>
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Закрывается задач в неделю
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={throughput}
							onChange={e => setThroughput(e.target.value)}
							aria-label='Закрывается задач в неделю'
							placeholder='—'
							className={inputClass}
						/>
					</label>
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Cycle time, недель на задачу
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={cycle}
							onChange={e => setCycle(e.target.value)}
							aria-label='Cycle time в неделях'
							placeholder='—'
							className={inputClass}
						/>
					</label>
				</div>

				{result ? (
					<div className='px-5 py-8 text-center sm:px-6'>
						<span className='block font-mono text-5xl font-bold tracking-tight text-foreground sm:text-6xl'>
							{fmt(result.value)}
						</span>
						<span className='mt-1 block text-sm text-muted-foreground'>
							{label}
						</span>
					</div>
				) : (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						Оставьте одно поле пустым, два других заполните
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						Формула верна для устойчивого потока без всплесков. Меньше задач в
						работе одновременно — короче cycle time
					</span>
				</div>
			</Card>

			<ToolScreenshot slug='cycle-time-calculator' />
			<CycleTimeCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
