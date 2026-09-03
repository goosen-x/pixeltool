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
import { ConversionRateCalculatorSeo } from './ConversionRateCalculatorSeo'

type Mode = 'cr' | 'traffic'

function toNumber(value: string): number | null {
	const parsed = parseFloat(value.replace(/\s/g, '').replace(',', '.'))
	return Number.isFinite(parsed) ? parsed : null
}

function fmt(value: number, digits = 2): string {
	return value.toLocaleString('ru-RU', { maximumFractionDigits: digits })
}

const inputClass =
	'w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'

export default function ConversionRateCalculatorPage() {
	const widget = getWidgetById('conversion-rate-calculator')!

	const [mode, setMode] = useState<Mode>('cr')
	const [visits, setVisits] = useState('1500')
	const [conversions, setConversions] = useState('30')
	const [cr, setCr] = useState('2')
	const [target, setTarget] = useState('100')
	const [copied, setCopied] = useState(false)

	const result = useMemo(() => {
		if (mode === 'cr') {
			const v = toNumber(visits)
			const c = toNumber(conversions)
			if (v === null || c === null || v <= 0) return null
			return { kind: 'cr' as const, value: (c / v) * 100 }
		}
		const t = toNumber(target)
		const c = toNumber(cr)
		if (t === null || c === null || c <= 0) return null
		return { kind: 'traffic' as const, value: (t / c) * 100 }
	}, [mode, visits, conversions, cr, target])

	const summary = result
		? result.kind === 'cr'
			? `Конверсия ${fmt(result.value)}%`
			: `Нужно ${fmt(result.value, 0)} визитов`
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
								['cr', 'Посчитать конверсию'],
								['traffic', 'Посчитать трафик']
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
					{mode === 'cr' ? (
						<>
							<label className='block'>
								<span className='mb-1.5 block text-sm text-muted-foreground'>
									Визиты
								</span>
								<input
									type='text'
									inputMode='decimal'
									value={visits}
									onChange={e => setVisits(e.target.value)}
									aria-label='Визиты'
									className={inputClass}
								/>
							</label>
							<label className='block'>
								<span className='mb-1.5 block text-sm text-muted-foreground'>
									Целевые действия
								</span>
								<input
									type='text'
									inputMode='decimal'
									value={conversions}
									onChange={e => setConversions(e.target.value)}
									aria-label='Целевые действия'
									className={inputClass}
								/>
							</label>
						</>
					) : (
						<>
							<label className='block'>
								<span className='mb-1.5 block text-sm text-muted-foreground'>
									Нужно целевых действий
								</span>
								<input
									type='text'
									inputMode='decimal'
									value={target}
									onChange={e => setTarget(e.target.value)}
									aria-label='Нужно целевых действий'
									className={inputClass}
								/>
							</label>
							<label className='block'>
								<span className='mb-1.5 block text-sm text-muted-foreground'>
									Ожидаемая конверсия, %
								</span>
								<input
									type='text'
									inputMode='decimal'
									value={cr}
									onChange={e => setCr(e.target.value)}
									aria-label='Ожидаемая конверсия'
									className={inputClass}
								/>
							</label>
						</>
					)}
				</div>

				{result ? (
					<div className='px-5 py-8 text-center sm:px-6'>
						<span className='block font-mono text-5xl font-bold tracking-tight text-foreground sm:text-6xl'>
							{result.kind === 'cr'
								? `${fmt(result.value)}%`
								: fmt(result.value, 0)}
						</span>
						<span className='mt-1 block text-sm text-muted-foreground'>
							{result.kind === 'cr' ? 'конверсия' : 'визитов под план'}
						</span>
					</div>
				) : (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						Заполните оба поля
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						База должна быть одна на весь отчёт: от визитов конверсия ниже, от
						уникальных посетителей выше
					</span>
				</div>
			</Card>

			<ToolScreenshot slug='conversion-rate-calculator' />
			<ConversionRateCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
