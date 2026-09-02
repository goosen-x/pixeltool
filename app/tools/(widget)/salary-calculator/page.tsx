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
	LaborField,
	money,
	parseNumber,
	ResultTile
} from '@/components/tools/LaborField'
import { calculateNdfl, grossFromNet } from '@/lib/utils/tax'
import { SalaryCalculatorSeo } from './SalaryCalculatorSeo'

type Direction = 'fromGross' | 'fromNet'

const DIRECTIONS: [Direction, string][] = [
	['fromGross', 'Оклад → на руки'],
	['fromNet', 'На руки → оклад']
]

export default function SalaryCalculatorPage() {
	const widget = getWidgetById('salary-calculator')!

	const [direction, setDirection] = useState<Direction>('fromGross')
	const [monthly, setMonthly] = useState('150000')
	const [children, setChildren] = useState('0')

	const result = useMemo(() => {
		const value = parseNumber(monthly)
		const kids = parseNumber(children) ?? 0
		if (value === null || value < 0) return null

		// Годовой доход: шкала НДФЛ прогрессивная и считается за год,
		// поэтому от месячной суммы переходим к годовой и обратно.
		const yearly = value * 12
		const income = direction === 'fromGross' ? yearly : grossFromNet(yearly)
		if (income === null) return null

		// Стандартный вычет на детей уменьшает облагаемую базу
		const deduction = Math.min(income, kids * 1400 * 12)
		const taxable = Math.max(0, income - deduction)
		const computed = calculateNdfl(taxable)
		if (!computed) return null

		const net = income - computed.tax
		return {
			grossYear: income,
			taxYear: computed.tax,
			netYear: net,
			grossMonth: income / 12,
			taxMonth: computed.tax / 12,
			netMonth: net / 12,
			effective: income > 0 ? (computed.tax / income) * 100 : 0,
			deduction
		}
	}, [monthly, children, direction])

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
				</div>

				<div className='grid gap-4 px-5 py-6 sm:grid-cols-2 sm:px-6'>
					<LaborField
						label={
							direction === 'fromGross'
								? 'Оклад в месяц до налога'
								: 'Сумма на руки в месяц'
						}
						suffix='₽'
						value={monthly}
						onChange={setMonthly}
					/>
					<LaborField
						label='Детей до 18 лет'
						value={children}
						onChange={setChildren}
						hint='Стандартный вычет 1400 ₽ в месяц на каждого'
					/>
				</div>

				{result ? (
					<>
						<div className='grid gap-3 border-t px-5 py-6 text-center sm:grid-cols-3 sm:px-6'>
							<ResultTile
								value={money(result.grossMonth)}
								label='Начислено в месяц'
							/>
							<ResultTile
								value={money(result.taxMonth)}
								label={`НДФЛ, ${result.effective.toFixed(2).replace('.', ',')}%`}
								accent='primary'
							/>
							<ResultTile
								value={money(result.netMonth)}
								label='На руки в месяц'
								accent='green'
							/>
						</div>

						<div className='border-t px-5 py-4 text-sm text-muted-foreground sm:px-6'>
							<p>
								За год: начислено {money(result.grossYear)} ₽, налог{' '}
								{money(result.taxYear)} ₽, на руки {money(result.netYear)} ₽.
							</p>
							{result.deduction > 0 && (
								<p>
									Вычет на детей за год: {money(result.deduction)} ₽ — на эту
									сумму уменьшена облагаемая база.
								</p>
							)}
						</div>
					</>
				) : (
					<p className='border-t px-5 py-12 text-center text-sm text-muted-foreground sm:px-6'>
						Введите сумму
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						Взносы в фонды платит работодатель сверх оклада — из вашей зарплаты
						они не удерживаются и здесь не показаны
					</span>
				</div>
			</Card>

			<SalaryCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
