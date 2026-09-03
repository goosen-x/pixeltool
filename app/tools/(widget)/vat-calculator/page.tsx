'use client'

import { useMemo, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill,
	toolToggleOption,
	toolToggleTrack
} from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { useCopyToClipboard } from '@/lib/hooks/useCopyToClipboard'
import {
	addVat,
	extractVat,
	RATES_VALID_FROM,
	VAT_RATES
} from '@/lib/utils/tax'
import { moneyToWords } from '@/lib/utils/number-to-words'
import { VatCalculatorSeo } from './VatCalculatorSeo'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'

type Mode = 'add' | 'extract'

const MODES: [Mode, string][] = [
	['add', 'Начислить сверху'],
	['extract', 'Выделить из суммы']
]

function money(value: number): string {
	return value.toLocaleString('ru-RU', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	})
}

export default function VatCalculatorPage() {
	const widget = getWidgetById('vat-calculator')!

	const [mode, setMode] = useState<Mode>('extract')
	const [rate, setRate] = useState(22)
	const [amount, setAmount] = useState('120000')

	const { copyToClipboard, copiedItem } = useCopyToClipboard()

	const result = useMemo(() => {
		const value = parseFloat(amount.replace(/\s/g, '').replace(',', '.'))
		if (!Number.isFinite(value) || value < 0) return null
		return mode === 'add' ? addVat(value, rate) : extractVat(value, rate)
	}, [amount, rate, mode])

	const summary = result
		? `Сумма без НДС: ${money(result.net)} ₽, НДС ${rate}%: ${money(result.vat)} ₽, сумма с НДС: ${money(result.gross)} ₽`
		: ''

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<div className={toolToggleTrack}>
						{MODES.map(([value, label]) => (
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
							onClick={() => copyToClipboard(summary, 'summary')}
							disabled={!summary}
							title='Скопировать расчёт'
							className={toolIconButton}
						>
							{copiedItem === 'summary' ? (
								<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
							) : (
								<Copy className='h-4 w-4' />
							)}
						</Button>
					</div>
				</div>

				<div className='space-y-5 px-5 py-6 sm:px-6'>
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							{mode === 'add' ? 'Сумма без НДС, ₽' : 'Сумма с НДС, ₽'}
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={amount}
							onChange={event => setAmount(event.target.value)}
							aria-label='Сумма'
							className='w-full rounded-md border bg-background px-3 py-2 font-mono text-lg text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						/>
					</label>

					<div className='flex flex-wrap items-center gap-1.5'>
						<span className='mr-1 text-sm text-muted-foreground'>Ставка</span>
						{VAT_RATES.map(item => (
							<button
								key={item.value}
								type='button'
								onClick={() => setRate(item.value)}
								aria-pressed={rate === item.value}
								title={item.hint}
								className={toolPill(rate === item.value)}
							>
								{item.label}
							</button>
						))}
					</div>
					<p className='text-sm text-muted-foreground'>
						{VAT_RATES.find(item => item.value === rate)?.hint}
					</p>
				</div>

				{result ? (
					<>
						<div className='grid gap-3 border-t px-5 py-6 text-center sm:grid-cols-3 sm:px-6'>
							<div className='rounded-xl border p-4'>
								<span className='block font-mono text-xl font-bold whitespace-nowrap tabular-nums sm:text-2xl'>
									{money(result.net)}
									<span className='ml-1 text-base text-muted-foreground'>
										₽
									</span>
								</span>
								<span className='mt-1 block text-sm text-muted-foreground'>
									Без НДС
								</span>
							</div>
							<div className='rounded-xl border p-4'>
								<span className='block font-mono text-xl font-bold whitespace-nowrap text-primary tabular-nums sm:text-2xl'>
									{money(result.vat)}
									<span className='ml-1 text-base text-muted-foreground'>
										₽
									</span>
								</span>
								<span className='mt-1 block text-sm text-muted-foreground'>
									НДС {rate}%
								</span>
							</div>
							<div className='rounded-xl border p-4'>
								<span className='block font-mono text-xl font-bold whitespace-nowrap tabular-nums sm:text-2xl'>
									{money(result.gross)}
									<span className='ml-1 text-base text-muted-foreground'>
										₽
									</span>
								</span>
								<span className='mt-1 block text-sm text-muted-foreground'>
									С НДС
								</span>
							</div>
						</div>

						<div className='border-t px-5 py-4 sm:px-6'>
							<span className='block text-sm text-muted-foreground'>
								Сумма с НДС прописью — для счёта и договора
							</span>
							<span className='mt-1 block text-sm'>
								{moneyToWords(result.gross)}
							</span>
						</div>
					</>
				) : (
					<p className='border-t px-5 py-12 text-center text-sm text-muted-foreground sm:px-6'>
						Введите сумму
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						Ставки действуют с {RATES_VALID_FROM}. Налоговое законодательство
						меняется — сверяйтесь с актуальной редакцией НК РФ
					</span>
				</div>
			</Card>

			<ToolScreenshot slug='vat-calculator' />
			<VatCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
