'use client'

import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { toolBar, toolFooterBar } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import {
	LaborField,
	money,
	moneyPrecise,
	parseNumber,
	ResultTile
} from '@/components/tools/LaborField'
import { AVERAGE_MONTH_DAYS, calculateVacation } from '@/lib/utils/labor'
import { calculateNdfl } from '@/lib/utils/tax'
import { VacationPayCalculatorSeo } from './VacationPayCalculatorSeo'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'

export default function VacationPayCalculatorPage() {
	const widget = getWidgetById('vacation-pay-calculator')!

	const [earnings, setEarnings] = useState('720000')
	const [fullMonths, setFullMonths] = useState('12')
	const [partialDays, setPartialDays] = useState('0')
	const [days, setDays] = useState('28')

	const result = useMemo(() => {
		const values = [earnings, fullMonths, partialDays, days].map(parseNumber)
		if (values.some(v => v === null)) return null
		const [e, m, p, d] = values as number[]
		return calculateVacation({
			yearEarnings: e,
			fullMonths: m,
			partialDays: p,
			vacationDays: d
		})
	}, [earnings, fullMonths, partialDays, days])

	// НДФЛ с отпускных удерживают как с обычного дохода
	const net = result ? (calculateNdfl(result.gross)?.net ?? null) : null

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<span className='text-sm text-muted-foreground'>
						Расчёт по статье 139 ТК РФ: заработок за 12 месяцев делится на
						календарные дни
					</span>
				</div>

				<div className='grid gap-4 px-5 py-6 sm:grid-cols-2 sm:px-6'>
					<LaborField
						label='Заработок за расчётный период'
						suffix='₽'
						value={earnings}
						onChange={setEarnings}
						hint='Обычно за 12 месяцев до отпуска, без отпускных и больничных'
					/>
					<LaborField
						label='Полных отработанных месяцев'
						value={fullMonths}
						onChange={setFullMonths}
						hint={`Каждый считается за ${AVERAGE_MONTH_DAYS} календарных дня`}
					/>
					<LaborField
						label='Календарных дней в неполных месяцах'
						value={partialDays}
						onChange={setPartialDays}
						hint='Если весь период отработан полностью — ноль'
					/>
					<LaborField
						label='Дней отпуска'
						value={days}
						onChange={setDays}
						hint='Стандартный отпуск — 28 календарных дней'
					/>
				</div>

				{result ? (
					<>
						<div className='grid gap-3 border-t px-5 py-6 text-center sm:grid-cols-3 sm:px-6'>
							<ResultTile
								value={moneyPrecise(result.averageDaily)}
								label='Средний дневной заработок'
							/>
							<ResultTile
								value={money(result.gross)}
								label='Отпускные начислено'
								accent='primary'
							/>
							<ResultTile
								value={net === null ? '—' : money(net)}
								label='На руки после НДФЛ'
								accent='green'
							/>
						</div>
						<p className='border-t px-5 py-4 text-sm text-muted-foreground sm:px-6'>
							База для деления: {result.daysBase.toFixed(1).replace('.', ',')}{' '}
							календарных дней
						</p>
					</>
				) : (
					<p className='border-t px-5 py-12 text-center text-sm text-muted-foreground sm:px-6'>
						Заполните заработок и число дней
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						НДФЛ посчитан по прогрессивной шкале от суммы отпускных. Реальное
						удержание зависит от дохода с начала года и вычетов
					</span>
				</div>
			</Card>

			<ToolScreenshot slug='vacation-pay-calculator' />
			<VacationPayCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
