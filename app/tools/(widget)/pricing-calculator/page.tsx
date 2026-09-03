'use client'

import { useMemo, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolToggleOption,
	toolToggleTrack
} from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'
import { PricingCalculatorSeo } from './PricingCalculatorSeo'

type Mode = 'markup' | 'margin'

function toNumber(value: string): number | null {
	const parsed = parseFloat(value.replace(/\s/g, '').replace(',', '.'))
	return Number.isFinite(parsed) ? parsed : null
}

function formatNumber(value: number, digits = 2): string {
	return value.toLocaleString('ru-RU', { maximumFractionDigits: digits })
}

const inputClass =
	'w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'

export default function PricingCalculatorPage() {
	const widget = getWidgetById('pricing-calculator')!

	const [mode, setMode] = useState<Mode>('markup')
	const [cost, setCost] = useState('1000')
	const [rate, setRate] = useState('50')
	const [copied, setCopied] = useState(false)

	const result = useMemo(() => {
		const c = toNumber(cost)
		const r = toNumber(rate)
		if (c === null || r === null) return null

		if (mode === 'margin' && r >= 100) return { invalid: true as const }

		const price = mode === 'markup' ? c * (1 + r / 100) : c / (1 - r / 100)
		const profit = price - c
		const markup = (profit / c) * 100
		const margin = (profit / price) * 100

		return { invalid: false as const, price, profit, markup, margin }
	}, [mode, cost, rate])

	const summary =
		result && !result.invalid
			? `Цена ${formatNumber(result.price)}, прибыль с единицы ${formatNumber(result.profit)} (наценка ${formatNumber(result.markup)}%, маржа ${formatNumber(result.margin)}%)`
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
					<div className={toolToggleTrack}>
						{(
							[
								['markup', 'По наценке'],
								['margin', 'По марже']
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
							Себестоимость
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={cost}
							onChange={e => setCost(e.target.value)}
							aria-label='Себестоимость'
							className={inputClass}
						/>
					</label>
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							{mode === 'markup' ? 'Наценка, %' : 'Маржа, %'}
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={rate}
							onChange={e => setRate(e.target.value)}
							aria-label={mode === 'markup' ? 'Наценка' : 'Маржа'}
							className={inputClass}
						/>
					</label>
				</div>

				{result === null ? (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						Заполните себестоимость и процент
					</p>
				) : result.invalid ? (
					<p className='px-5 py-12 text-center text-sm text-red-600 dark:text-red-400 sm:px-6'>
						Маржа не может быть 100% и больше — это цена без себестоимости
					</p>
				) : (
					<div className='px-5 py-8 text-center sm:px-6'>
						<span className='block font-mono text-5xl font-bold tracking-tight text-foreground sm:text-6xl'>
							{formatNumber(result.price)}
						</span>
						<span className='mt-2 block text-sm text-muted-foreground'>
							Прибыль с единицы {formatNumber(result.profit)} · наценка{' '}
							{formatNumber(result.markup)}% · маржа{' '}
							{formatNumber(result.margin)}%
						</span>
					</div>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						Наценка считается от себестоимости, маржа — от цены; это всегда
						разные числа
					</span>
				</div>
			</Card>

			<ToolScreenshot slug='pricing-calculator' />
			<PricingCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
