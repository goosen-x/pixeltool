'use client'

import { useMemo, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toolBar, toolFooterBar, toolIconButton } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'
import { BreakevenCalculatorSeo } from './BreakevenCalculatorSeo'

function toNumber(value: string): number | null {
	const parsed = parseFloat(value.replace(/\s/g, '').replace(',', '.'))
	return Number.isFinite(parsed) ? parsed : null
}

function formatNumber(value: number, digits = 2): string {
	return value.toLocaleString('ru-RU', { maximumFractionDigits: digits })
}

const inputClass =
	'w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'

export default function BreakevenCalculatorPage() {
	const widget = getWidgetById('breakeven-calculator')!

	const [fixed, setFixed] = useState('300000')
	const [price, setPrice] = useState('1500')
	const [variable, setVariable] = useState('600')
	const [copied, setCopied] = useState(false)

	const result = useMemo(() => {
		const f = toNumber(fixed)
		const p = toNumber(price)
		const v = toNumber(variable)
		if (f === null || p === null || v === null) return null

		const margin = p - v
		if (margin <= 0) return { margin, invalid: true as const }

		const units = f / margin
		return {
			margin,
			marginPct: (margin / p) * 100,
			units,
			revenue: units * p,
			invalid: false as const
		}
	}, [fixed, price, variable])

	const summary =
		result && !result.invalid
			? `Точка безубыточности: ${formatNumber(result.units, 0)} шт. или ${formatNumber(result.revenue, 0)} в деньгах`
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
						Затраты и цена за единицу
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
							Постоянные затраты в месяц
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={fixed}
							onChange={e => setFixed(e.target.value)}
							aria-label='Постоянные затраты'
							className={inputClass}
						/>
					</label>
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Цена за единицу
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={price}
							onChange={e => setPrice(e.target.value)}
							aria-label='Цена за единицу'
							className={inputClass}
						/>
					</label>
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Переменные затраты на единицу
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={variable}
							onChange={e => setVariable(e.target.value)}
							aria-label='Переменные затраты на единицу'
							className={inputClass}
						/>
					</label>
				</div>

				{result === null ? (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						Заполните все три поля
					</p>
				) : result.invalid ? (
					<p className='px-5 py-12 text-center text-sm text-red-600 dark:text-red-400 sm:px-6'>
						Переменные затраты не ниже цены — каждая продажа в убыток, точки
						безубыточности не существует
					</p>
				) : (
					<div className='px-5 py-8 text-center sm:px-6'>
						<span className='block font-mono text-5xl font-bold tracking-tight text-foreground sm:text-6xl'>
							{formatNumber(result.units, 0)}
						</span>
						<span className='mt-1 block text-sm text-muted-foreground'>
							единиц в месяц · {formatNumber(result.revenue, 0)} в деньгах
						</span>
						<span className='mt-3 block text-sm text-muted-foreground'>
							Маржинальность с единицы: {formatNumber(result.margin)} (
							{formatNumber(result.marginPct)}%)
						</span>
					</div>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						Знаменатель формулы — маржинальная прибыль с одной продажи; если она
						нулевая или отрицательная, объём не спасёт
					</span>
				</div>
			</Card>

			<ToolScreenshot slug='breakeven-calculator' />
			<BreakevenCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
