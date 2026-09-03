'use client'

import { useMemo, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toolBar, toolFooterBar, toolIconButton } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'
import { RoiCalculatorSeo } from './RoiCalculatorSeo'

function toNumber(value: string): number | null {
	const parsed = parseFloat(value.replace(/\s/g, '').replace(',', '.'))
	return Number.isFinite(parsed) ? parsed : null
}

function formatNumber(value: number, digits = 2): string {
	return value.toLocaleString('ru-RU', { maximumFractionDigits: digits })
}

const inputClass =
	'w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'

export default function RoiCalculatorPage() {
	const widget = getWidgetById('roi-calculator')!

	const [investment, setInvestment] = useState('100000')
	const [returned, setReturned] = useState('130000')
	const [months, setMonths] = useState('')
	const [copied, setCopied] = useState(false)

	const result = useMemo(() => {
		const inv = toNumber(investment)
		const ret = toNumber(returned)
		if (inv === null || ret === null || inv === 0) return null

		const profit = ret - inv
		const roi = (profit / inv) * 100

		const m = toNumber(months)
		let annualRoi: number | null = null
		if (m !== null && m > 0) {
			annualRoi = ((1 + roi / 100) ** (12 / m) - 1) * 100
		}

		return { profit, roi, annualRoi }
	}, [investment, returned, months])

	const summary = result
		? `ROI ${formatNumber(result.roi)}%, прибыль ${formatNumber(result.profit)}` +
			(result.annualRoi !== null
				? `, годовой ROI ${formatNumber(result.annualRoi)}%`
				: '')
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
						Вложения и возврат
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
							Сумма вложений
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={investment}
							onChange={e => setInvestment(e.target.value)}
							aria-label='Сумма вложений'
							className={inputClass}
						/>
					</label>
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Возврат (доход)
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={returned}
							onChange={e => setReturned(e.target.value)}
							aria-label='Возврат'
							className={inputClass}
						/>
					</label>
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Срок, мес. (необязательно)
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={months}
							onChange={e => setMonths(e.target.value)}
							aria-label='Срок в месяцах'
							className={inputClass}
						/>
					</label>
				</div>

				{result ? (
					<div className='px-5 py-8 text-center sm:px-6'>
						<span
							className={cn(
								'block font-mono text-5xl font-bold tracking-tight sm:text-6xl',
								result.roi >= 0
									? 'text-green-600 dark:text-green-400'
									: 'text-red-600 dark:text-red-400'
							)}
						>
							{result.roi >= 0 ? '+' : '−'}
							{formatNumber(Math.abs(result.roi))}%
						</span>
						<span className='mt-2 block text-sm text-muted-foreground'>
							Чистая прибыль {formatNumber(result.profit)}
							{result.annualRoi !== null && (
								<> · Годовой ROI {formatNumber(result.annualRoi)}%</>
							)}
						</span>
					</div>
				) : (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						Заполните сумму вложений и возврат
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						ROI считается от суммы вложений; годовой ROI приводит доходность к
						одному году для сравнения проектов с разным сроком
					</span>
				</div>
			</Card>

			<ToolScreenshot slug='roi-calculator' />
			<RoiCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
