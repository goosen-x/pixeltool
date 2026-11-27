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

import { calculateCtr, type CtrMode as Mode } from '@/lib/ctr-calculator'

function fmt(value: number, digits = 2): string {
	return value.toLocaleString('ru-RU', { maximumFractionDigits: digits })
}

function plural(n: number): string {
	const mod10 = n % 10
	const mod100 = n % 100
	if (mod10 === 1 && mod100 !== 11) return 'показ'
	if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'показа'
	return 'показов'
}

const inputClass =
	'w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'

export default function CtrCalculatorPage() {
	const widget = getWidgetById('ctr-calculator')!

	const [mode, setMode] = useState<Mode>('ctr')
	const [impressions, setImpressions] = useState('5000')
	const [clicks, setClicks] = useState('75')
	const [ctr, setCtr] = useState('1,5')
	const [spend, setSpend] = useState('')
	const [copied, setCopied] = useState(false)

	const outcome = useMemo(
		() => calculateCtr({ mode, impressions, clicks, ctr, spend }),
		[mode, impressions, clicks, ctr, spend]
	)
	const result = outcome.ok ? outcome.result : null
	const error = outcome.ok ? null : outcome.error

	const clicksDigits = result && result.clicks < 10 ? 1 : 0
	const mainValue = result
		? mode === 'ctr'
			? `${fmt(result.ctr)}%`
			: `≈ ${fmt(result.clicks, clicksDigits)}`
		: ''

	const summary = result
		? [
				mode === 'ctr'
					? `CTR ${fmt(result.ctr)}%`
					: `≈ ${fmt(result.clicks, clicksDigits)} кликов при CTR ${fmt(result.ctr)}%`,
				result.cpc !== null ? `CPC ${fmt(result.cpc)} ₽` : null,
				result.cpm !== null ? `CPM ${fmt(result.cpm)} ₽` : null
			]
				.filter(Boolean)
				.join(', ')
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

				<div className='grid gap-4 border-b px-5 py-6 sm:grid-cols-3 sm:px-6'>
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
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Расход, ₽{' '}
							<span className='text-muted-foreground/70'>(необязательно)</span>
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={spend}
							onChange={e => setSpend(e.target.value)}
							placeholder='для CPC и CPM'
							aria-label='Расход на рекламу'
							className={inputClass}
						/>
					</label>
				</div>

				{result ? (
					<div className='px-5 py-8 text-center sm:px-6' aria-live='polite'>
						<span className='block font-mono text-5xl font-bold tracking-tight text-foreground sm:text-6xl'>
							{mainValue}
						</span>
						<span className='mt-1 block text-sm text-muted-foreground'>
							{mode === 'ctr' ? 'кликабельность (CTR)' : 'ожидаемых кликов'}
						</span>
						{result.impressionsPerClick !== null && (
							<span className='mt-3 block text-sm text-muted-foreground'>
								В среднем {fmt(result.impressionsPerClick, 0)}{' '}
								{plural(Math.round(result.impressionsPerClick))} на один клик
							</span>
						)}
						{(result.cpc !== null || result.cpm !== null) && (
							<div className='mx-auto mt-6 grid max-w-sm grid-cols-2 gap-3'>
								<div className='rounded-md border px-3 py-2'>
									<span className='block font-mono text-xl font-semibold'>
										{result.cpc !== null ? `${fmt(result.cpc)} ₽` : '—'}
									</span>
									<span className='block text-xs text-muted-foreground'>
										CPC, цена клика
									</span>
								</div>
								<div className='rounded-md border px-3 py-2'>
									<span className='block font-mono text-xl font-semibold'>
										{result.cpm !== null ? `${fmt(result.cpm)} ₽` : '—'}
									</span>
									<span className='block text-xs text-muted-foreground'>
										CPM, за 1000 показов
									</span>
								</div>
							</div>
						)}
						{result.warning && (
							<p className='mt-4 text-sm text-amber-600 dark:text-amber-400'>
								{result.warning}
							</p>
						)}
					</div>
				) : (
					<p
						className={
							error
								? 'px-5 py-16 text-center text-sm text-destructive sm:px-6'
								: 'px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'
						}
						aria-live='polite'
					>
						{error ??
							(mode === 'ctr'
								? 'Введите показы и клики'
								: 'Введите показы и ожидаемый CTR')}
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						CTR = клики ÷ показы × 100%. Высокий CTR ещё не значит продажи,
						смотрите его вместе с конверсией
					</span>
				</div>
			</Card>

			<ToolScreenshot slug='ctr-calculator' />
			<CtrCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
