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
import { CtrCalculatorSeo } from './CtrCalculatorSeo'

type Mode = 'ctr' | 'clicks'

function toNumber(value: string): number | null {
	const parsed = parseFloat(value.replace(/\s/g, '').replace(',', '.'))
	return Number.isFinite(parsed) ? parsed : null
}

function fmt(value: number, digits = 2): string {
	return value.toLocaleString('ru-RU', { maximumFractionDigits: digits })
}

const inputClass =
	'w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'

export default function CtrCalculatorPage() {
	const widget = getWidgetById('ctr-calculator')!

	const [mode, setMode] = useState<Mode>('ctr')
	const [impressions, setImpressions] = useState('5000')
	const [clicks, setClicks] = useState('75')
	const [ctr, setCtr] = useState('1.5')
	const [copied, setCopied] = useState(false)

	const result = useMemo(() => {
		const imp = toNumber(impressions)
		if (imp === null || imp <= 0) return null
		if (mode === 'ctr') {
			const cl = toNumber(clicks)
			if (cl === null) return null
			return { kind: 'ctr' as const, value: (cl / imp) * 100 }
		}
		const c = toNumber(ctr)
		if (c === null) return null
		return { kind: 'clicks' as const, value: (imp * c) / 100 }
	}, [mode, impressions, clicks, ctr])

	const summary = result
		? result.kind === 'ctr'
			? `CTR ${fmt(result.value)}%`
			: `${fmt(result.value, 0)} кликов`
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
								['ctr', 'Посчитать CTR'],
								['clicks', 'Посчитать клики']
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
							Показы
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={impressions}
							onChange={e => setImpressions(e.target.value)}
							aria-label='Показы'
							className={inputClass}
						/>
					</label>
					{mode === 'ctr' ? (
						<label className='block'>
							<span className='mb-1.5 block text-sm text-muted-foreground'>
								Клики
							</span>
							<input
								type='text'
								inputMode='decimal'
								value={clicks}
								onChange={e => setClicks(e.target.value)}
								aria-label='Клики'
								className={inputClass}
							/>
						</label>
					) : (
						<label className='block'>
							<span className='mb-1.5 block text-sm text-muted-foreground'>
								CTR, %
							</span>
							<input
								type='text'
								inputMode='decimal'
								value={ctr}
								onChange={e => setCtr(e.target.value)}
								aria-label='CTR'
								className={inputClass}
							/>
						</label>
					)}
				</div>

				{result ? (
					<div className='px-5 py-8 text-center sm:px-6'>
						<span className='block font-mono text-5xl font-bold tracking-tight text-foreground sm:text-6xl'>
							{result.kind === 'ctr'
								? `${fmt(result.value)}%`
								: fmt(result.value, 0)}
						</span>
						<span className='mt-1 block text-sm text-muted-foreground'>
							{result.kind === 'ctr' ? 'кликабельность' : 'ожидаемых кликов'}
						</span>
					</div>
				) : (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						Заполните оба поля
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						CTR = клики ÷ показы × 100%. Высокий CTR не гарантирует продаж —
						смотрите его вместе с конверсией
					</span>
				</div>
			</Card>

			<ToolScreenshot slug='ctr-calculator' />
			<CtrCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
