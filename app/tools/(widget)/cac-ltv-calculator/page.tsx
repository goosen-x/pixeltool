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
import { CacLtvCalculatorSeo } from './CacLtvCalculatorSeo'

function toNumber(value: string): number | null {
	const parsed = parseFloat(value.replace(/\s/g, '').replace(',', '.'))
	return Number.isFinite(parsed) ? parsed : null
}

function fmt(value: number, digits = 2): string {
	return value.toLocaleString('ru-RU', { maximumFractionDigits: digits })
}

const inputClass =
	'w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'

export default function CacLtvCalculatorPage() {
	const widget = getWidgetById('cac-ltv-calculator')!

	const [spend, setSpend] = useState('300000')
	const [customers, setCustomers] = useState('100')
	const [check, setCheck] = useState('4000')
	const [purchases, setPurchases] = useState('5')
	const [margin, setMargin] = useState('40')
	const [copied, setCopied] = useState(false)

	const result = useMemo(() => {
		const s = toNumber(spend)
		const n = toNumber(customers)
		const c = toNumber(check)
		const p = toNumber(purchases)
		const m = toNumber(margin)
		if (s === null || n === null || c === null || p === null || m === null)
			return null
		if (n <= 0) return null

		const cac = s / n
		const ltv = c * p * (m / 100)
		const ratio = cac > 0 ? ltv / cac : Infinity
		return { cac, ltv, ratio }
	}, [spend, customers, check, purchases, margin])

	const ratioClass = !result
		? ''
		: result.ratio >= 3
			? 'text-green-600 dark:text-green-400'
			: result.ratio >= 1
				? 'text-amber-600 dark:text-amber-400'
				: 'text-red-600 dark:text-red-400'

	const summary = result
		? `CAC ${fmt(result.cac)}, LTV ${fmt(result.ltv)}, LTV/CAC ${fmt(result.ratio)}`
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
						Привлечение и ценность клиента
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
							Расходы на маркетинг и продажи
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={spend}
							onChange={e => setSpend(e.target.value)}
							aria-label='Расходы на маркетинг и продажи'
							className={inputClass}
						/>
					</label>
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Новых клиентов за период
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={customers}
							onChange={e => setCustomers(e.target.value)}
							aria-label='Новых клиентов'
							className={inputClass}
						/>
					</label>
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Средний чек
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={check}
							onChange={e => setCheck(e.target.value)}
							aria-label='Средний чек'
							className={inputClass}
						/>
					</label>
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Покупок за всё время
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={purchases}
							onChange={e => setPurchases(e.target.value)}
							aria-label='Покупок за всё время'
							className={inputClass}
						/>
					</label>
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Маржа, %
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={margin}
							onChange={e => setMargin(e.target.value)}
							aria-label='Маржа'
							className={inputClass}
						/>
					</label>
				</div>

				{result ? (
					<div className='grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0'>
						<div className='px-5 py-6 text-center'>
							<span className='block font-mono text-3xl font-bold tracking-tight text-foreground'>
								{fmt(result.cac)}
							</span>
							<span className='mt-1 block text-sm text-muted-foreground'>
								CAC
							</span>
						</div>
						<div className='px-5 py-6 text-center'>
							<span className='block font-mono text-3xl font-bold tracking-tight text-foreground'>
								{fmt(result.ltv)}
							</span>
							<span className='mt-1 block text-sm text-muted-foreground'>
								LTV
							</span>
						</div>
						<div className='px-5 py-6 text-center'>
							<span
								className={cn(
									'block font-mono text-3xl font-bold tracking-tight',
									ratioClass
								)}
							>
								{Number.isFinite(result.ratio) ? fmt(result.ratio) : '∞'}
							</span>
							<span className='mt-1 block text-sm text-muted-foreground'>
								LTV / CAC
							</span>
						</div>
					</div>
				) : (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						Заполните все поля
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						Здоровое отношение LTV к CAC — от 3 к 1. LTV считается по марже, а
						не по выручке
					</span>
				</div>
			</Card>

			<ToolScreenshot slug='cac-ltv-calculator' />
			<CacLtvCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
