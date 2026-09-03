'use client'

import { useMemo, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toolBar, toolFooterBar, toolIconButton } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'
import { RoasCalculatorSeo } from './RoasCalculatorSeo'

function toNumber(value: string): number | null {
	const parsed = parseFloat(value.replace(/\s/g, '').replace(',', '.'))
	return Number.isFinite(parsed) ? parsed : null
}

function fmt(value: number, digits = 2): string {
	return value.toLocaleString('ru-RU', { maximumFractionDigits: digits })
}

const inputClass =
	'w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'

export default function RoasCalculatorPage() {
	const widget = getWidgetById('roas-calculator')!

	const [revenue, setRevenue] = useState('200000')
	const [spend, setSpend] = useState('50000')
	const [copied, setCopied] = useState(false)

	const result = useMemo(() => {
		const r = toNumber(revenue)
		const s = toNumber(spend)
		if (r === null || s === null || s <= 0) return null
		const roas = (r / s) * 100
		return { roas, ratio: r / s, drr: (s / r) * 100 }
	}, [revenue, spend])

	const summary = result
		? `ROAS ${fmt(result.roas)}% (×${fmt(result.ratio)}), ДРР ${fmt(result.drr)}%`
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
						Выручка и расходы на рекламу
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

				<div className='grid gap-4 border-b px-5 py-6 sm:grid-cols-2 sm:px-6'>
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Выручка от рекламы
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={revenue}
							onChange={e => setRevenue(e.target.value)}
							aria-label='Выручка от рекламы'
							className={inputClass}
						/>
					</label>
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Расходы на рекламу
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={spend}
							onChange={e => setSpend(e.target.value)}
							aria-label='Расходы на рекламу'
							className={inputClass}
						/>
					</label>
				</div>

				{result ? (
					<div className='px-5 py-8 text-center sm:px-6'>
						<span className='block font-mono text-5xl font-bold tracking-tight text-foreground sm:text-6xl'>
							{fmt(result.roas)}%
						</span>
						<span className='mt-1 block text-sm text-muted-foreground'>
							{fmt(result.ratio)} выручки на рубль рекламы · ДРР{' '}
							{fmt(result.drr)}%
						</span>
					</div>
				) : (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						Заполните выручку и расходы
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						ROAS не вычитает себестоимость: окупаемость по прибыли всегда ниже.
						Точка окупаемости ≈ 100% ÷ маржа
					</span>
				</div>
			</Card>

			<ToolScreenshot slug='roas-calculator' />
			<RoasCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
