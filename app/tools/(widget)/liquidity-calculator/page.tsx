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
import { LiquidityCalculatorSeo } from './LiquidityCalculatorSeo'

function toNumber(value: string): number | null {
	const parsed = parseFloat(value.replace(/\s/g, '').replace(',', '.'))
	return Number.isFinite(parsed) ? parsed : null
}

function fmt(value: number): string {
	return value.toLocaleString('ru-RU', { maximumFractionDigits: 2 })
}

const inputClass =
	'w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'

type Verdict = { label: string; className: string }

function verdict(value: number, low: number, high: number): Verdict {
	if (value < low)
		return { label: 'ниже нормы', className: 'text-red-600 dark:text-red-400' }
	if (value > high)
		return {
			label: 'выше нормы',
			className: 'text-amber-600 dark:text-amber-400'
		}
	return { label: 'в норме', className: 'text-green-600 dark:text-green-400' }
}

export default function LiquidityCalculatorPage() {
	const widget = getWidgetById('liquidity-calculator')!

	const [assets, setAssets] = useState('1500000')
	const [inventory, setInventory] = useState('600000')
	const [cash, setCash] = useState('300000')
	const [liabilities, setLiabilities] = useState('900000')
	const [copied, setCopied] = useState(false)

	const result = useMemo(() => {
		const a = toNumber(assets)
		const inv = toNumber(inventory)
		const c = toNumber(cash)
		const l = toNumber(liabilities)
		if (a === null || inv === null || c === null || l === null || l === 0)
			return null

		const current = a / l
		const quick = (a - inv) / l
		const cashRatio = c / l
		return {
			current,
			quick,
			cashRatio,
			vCurrent: verdict(current, 1.5, 2.5),
			vQuick: verdict(quick, 0.8, 1),
			vCash: verdict(cashRatio, 0.2, 0.5)
		}
	}, [assets, inventory, cash, liabilities])

	const summary = result
		? `Текущая ${fmt(result.current)}, быстрая ${fmt(result.quick)}, абсолютная ${fmt(result.cashRatio)}`
		: ''

	const copy = async () => {
		if (!summary) return
		await navigator.clipboard.writeText(summary)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	const rows = result
		? [
				{
					name: 'Текущая ликвидность',
					value: result.current,
					v: result.vCurrent,
					norm: '1,5–2,5'
				},
				{
					name: 'Быстрая ликвидность',
					value: result.quick,
					v: result.vQuick,
					norm: '0,8–1'
				},
				{
					name: 'Абсолютная ликвидность',
					value: result.cashRatio,
					v: result.vCash,
					norm: 'от 0,2'
				}
			]
		: []

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<span className='text-sm text-muted-foreground'>Строки баланса</span>
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
							Оборотные активы
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={assets}
							onChange={e => setAssets(e.target.value)}
							aria-label='Оборотные активы'
							className={inputClass}
						/>
					</label>
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Запасы
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={inventory}
							onChange={e => setInventory(e.target.value)}
							aria-label='Запасы'
							className={inputClass}
						/>
					</label>
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Денежные средства и эквиваленты
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={cash}
							onChange={e => setCash(e.target.value)}
							aria-label='Денежные средства'
							className={inputClass}
						/>
					</label>
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Краткосрочные обязательства
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={liabilities}
							onChange={e => setLiabilities(e.target.value)}
							aria-label='Краткосрочные обязательства'
							className={inputClass}
						/>
					</label>
				</div>

				{result ? (
					<div className='divide-y px-5 sm:px-6'>
						{rows.map(row => (
							<div
								key={row.name}
								className='flex items-baseline justify-between gap-4 py-4'
							>
								<div>
									<span className='block text-sm text-foreground'>
										{row.name}
									</span>
									<span className='text-xs text-muted-foreground'>
										норма {row.norm}
									</span>
								</div>
								<div className='text-right'>
									<span className='block font-mono text-2xl font-bold tracking-tight text-foreground'>
										{fmt(row.value)}
									</span>
									<span className={cn('text-xs', row.v.className)}>
										{row.v.label}
									</span>
								</div>
							</div>
						))}
					</div>
				) : (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						Заполните все четыре строки
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						Нормативы ориентировочные и зависят от отрасли; значения намного
						выше нормы означают, что деньги не работают
					</span>
				</div>
			</Card>

			<ToolScreenshot slug='liquidity-calculator' />
			<LiquidityCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
