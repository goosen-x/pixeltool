'use client'

import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import {
	toolBar,
	toolFooterBar,
	toolToggleOption,
	toolToggleTrack
} from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import {
	calculateNdfl,
	grossFromNet,
	NDFL_BRACKETS,
	RATES_VALID_FROM
} from '@/lib/utils/tax'
import { NdflCalculatorSeo } from './NdflCalculatorSeo'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'

type Direction = 'fromGross' | 'fromNet'

const DIRECTIONS: [Direction, string][] = [
	['fromGross', 'От начисленного'],
	['fromNet', 'От суммы на руки']
]

function money(value: number): string {
	return Math.round(value).toLocaleString('ru-RU')
}

export default function NdflCalculatorPage() {
	const widget = getWidgetById('ndfl-calculator')!

	const [direction, setDirection] = useState<Direction>('fromGross')
	const [input, setInput] = useState('3000000')

	const result = useMemo(() => {
		const value = parseFloat(input.replace(/\s/g, '').replace(',', '.'))
		if (!Number.isFinite(value) || value < 0) return null

		const income = direction === 'fromGross' ? value : grossFromNet(value)
		if (income === null) return null
		const computed = calculateNdfl(income)
		return computed ? { income, ...computed } : null
	}, [input, direction])

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<div className={toolToggleTrack}>
						{DIRECTIONS.map(([value, label]) => (
							<button
								key={value}
								type='button'
								onClick={() => setDirection(value)}
								aria-pressed={direction === value}
								className={toolToggleOption(direction === value)}
							>
								{label}
							</button>
						))}
					</div>

					<span className='text-sm text-muted-foreground sm:ml-auto'>
						Доход за год, прогрессивная шкала
					</span>
				</div>

				<div className='px-5 py-6 sm:px-6'>
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							{direction === 'fromGross'
								? 'Начислено за год, ₽'
								: 'Получено на руки за год, ₽'}
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={input}
							onChange={event => setInput(event.target.value)}
							aria-label='Доход за год'
							className='w-full rounded-md border bg-background px-3 py-2 font-mono text-lg text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						/>
					</label>
				</div>

				{result ? (
					<>
						<div className='grid gap-3 border-t px-5 py-6 text-center sm:grid-cols-3 sm:px-6'>
							<div className='rounded-xl border p-4'>
								<span className='block font-mono text-xl font-bold whitespace-nowrap tabular-nums sm:text-2xl'>
									{money(result.income)}
									<span className='ml-1 text-base text-muted-foreground'>
										₽
									</span>
								</span>
								<span className='mt-1 block text-sm text-muted-foreground'>
									Начислено
								</span>
							</div>
							<div className='rounded-xl border p-4'>
								<span className='block font-mono text-xl font-bold whitespace-nowrap text-primary tabular-nums sm:text-2xl'>
									{money(result.tax)}
									<span className='ml-1 text-base text-muted-foreground'>
										₽
									</span>
								</span>
								<span className='mt-1 block text-sm text-muted-foreground'>
									НДФЛ, средняя ставка{' '}
									{result.effectiveRatePercent.toFixed(2).replace('.', ',')}%
								</span>
							</div>
							<div className='rounded-xl border p-4'>
								<span className='block font-mono text-xl font-bold whitespace-nowrap text-green-600 tabular-nums sm:text-2xl dark:text-green-400'>
									{money(result.net)}
									<span className='ml-1 text-base text-muted-foreground'>
										₽
									</span>
								</span>
								<span className='mt-1 block text-sm text-muted-foreground'>
									На руки
								</span>
							</div>
						</div>

						{/* Разбивка по ступеням — ради неё половина смысла: она
						    показывает, что повышенная ставка берётся только с
						    превышения, а не со всего дохода. */}
						<div className='border-t px-5 py-5 sm:px-6'>
							<span className='block text-sm text-muted-foreground'>
								Как разложился доход по ступеням
							</span>
							<ul className='mt-3 space-y-1.5'>
								{result.parts.map(part => (
									<li
										key={part.ratePercent}
										className='flex flex-wrap items-baseline gap-x-3 text-sm'
									>
										<span className='w-12 font-mono text-foreground'>
											{part.ratePercent}%
										</span>
										<span className='font-mono text-muted-foreground tabular-nums'>
											{money(part.amount)} ₽
										</span>
										<span className='ml-auto font-mono tabular-nums'>
											{money(part.tax)} ₽
										</span>
									</li>
								))}
							</ul>
						</div>
					</>
				) : (
					<p className='border-t px-5 py-12 text-center text-sm text-muted-foreground sm:px-6'>
						Введите доход
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						Ступени с {RATES_VALID_FROM}:{' '}
						{NDFL_BRACKETS.map(
							b => `${b.ratePercent}% от ${money(b.from)} ₽`
						).join(', ')}
					</span>
				</div>
			</Card>

			<ToolScreenshot slug='ndfl-calculator' />
			<NdflCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
