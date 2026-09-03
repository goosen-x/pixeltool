'use client'

import { useMemo, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'
import { CpaCalculatorSeo } from './CpaCalculatorSeo'

type Mode = 'cpc' | 'cpl' | 'cpa' | 'cpm'

const MODES: { id: Mode; label: string; unit: string }[] = [
	{ id: 'cpc', label: 'CPC — за клик', unit: 'Клики' },
	{ id: 'cpl', label: 'CPL — за лид', unit: 'Лиды' },
	{ id: 'cpa', label: 'CPA — за действие', unit: 'Целевые действия' },
	{ id: 'cpm', label: 'CPM — за 1000 показов', unit: 'Показы' }
]

function toNumber(value: string): number | null {
	const parsed = parseFloat(value.replace(/\s/g, '').replace(',', '.'))
	return Number.isFinite(parsed) ? parsed : null
}

function fmt(value: number, digits = 2): string {
	return value.toLocaleString('ru-RU', { maximumFractionDigits: digits })
}

const inputClass =
	'w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'

export default function CpaCalculatorPage() {
	const widget = getWidgetById('cpa-calculator')!

	const [mode, setMode] = useState<Mode>('cpa')
	const [spend, setSpend] = useState('50000')
	const [count, setCount] = useState('40')
	const [copied, setCopied] = useState(false)

	const active = MODES.find(m => m.id === mode)!

	const result = useMemo(() => {
		const s = toNumber(spend)
		const c = toNumber(count)
		if (s === null || c === null || c <= 0) return null
		return mode === 'cpm' ? (s / c) * 1000 : s / c
	}, [mode, spend, count])

	const summary =
		result !== null ? `${mode.toUpperCase()} = ${fmt(result)}` : ''

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
					<div className='flex flex-wrap items-center gap-1.5'>
						{MODES.map(m => (
							<button
								key={m.id}
								type='button'
								onClick={() => setMode(m.id)}
								aria-pressed={mode === m.id}
								className={toolPill(mode === m.id)}
							>
								{m.id.toUpperCase()}
							</button>
						))}
					</div>
					<div className='flex w-full items-center justify-end gap-0.5 sm:w-auto sm:ml-auto'>
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
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							{active.unit}
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={count}
							onChange={e => setCount(e.target.value)}
							aria-label={active.unit}
							className={inputClass}
						/>
					</label>
				</div>

				{result !== null ? (
					<div className='px-5 py-8 text-center sm:px-6'>
						<span className='block font-mono text-5xl font-bold tracking-tight text-foreground sm:text-6xl'>
							{fmt(result)}
						</span>
						<span className='mt-1 block text-sm text-muted-foreground'>
							{active.label}
						</span>
					</div>
				) : (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						Заполните расходы и количество
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						CPC и CPM оценивают закупку трафика, решение принимают по CPA и его
						отношению к марже
					</span>
				</div>
			</Card>

			<ToolScreenshot slug='cpa-calculator' />
			<CpaCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
