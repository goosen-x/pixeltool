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
import {
	calculateSickLeave,
	DEFAULT_CONTRIBUTION_BASE,
	DEFAULT_MROT,
	LABOR_VALUES_YEAR
} from '@/lib/utils/labor'
import { SickLeaveCalculatorSeo } from './SickLeaveCalculatorSeo'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'

export default function SickLeaveCalculatorPage() {
	const widget = getWidgetById('sick-leave-calculator')!

	const [earnings, setEarnings] = useState('1600000')
	const [years, setYears] = useState('6')
	const [days, setDays] = useState('10')
	const [mrot, setMrot] = useState(String(DEFAULT_MROT))
	const [base, setBase] = useState(String(DEFAULT_CONTRIBUTION_BASE))

	const result = useMemo(() => {
		const values = [earnings, years, days, mrot, base].map(parseNumber)
		if (values.some(v => v === null)) return null
		const [e, y, d, m, b] = values as number[]
		return calculateSickLeave({
			twoYearsEarnings: e,
			insuranceYears: y,
			sickDays: d,
			mrot: m,
			contributionBase: b
		})
	}, [earnings, years, days, mrot, base])

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<span className='text-sm text-muted-foreground'>
						Заработок за два года делится на 730 и умножается на процент по
						стажу
					</span>
				</div>

				<div className='grid gap-4 px-5 py-6 sm:grid-cols-2 sm:px-6'>
					<LaborField
						label='Заработок за два предыдущих года'
						suffix='₽'
						value={earnings}
						onChange={setEarnings}
						hint='Сумма за оба года целиком, а не в среднем за год'
					/>
					<LaborField
						label='Страховой стаж'
						suffix='лет'
						value={years}
						onChange={setYears}
						hint='До 5 лет — 60%, от 5 до 8 — 80%, от 8 — 100%'
					/>
					<LaborField label='Дней болезни' value={days} onChange={setDays} />
					<LaborField
						label='МРОТ'
						suffix='₽'
						value={mrot}
						onChange={setMrot}
						hint={`Значение на ${LABOR_VALUES_YEAR} год — проверьте актуальность`}
					/>
					<LaborField
						label='Предельная база взносов за год'
						suffix='₽'
						value={base}
						onChange={setBase}
						hint='Заработок сверх неё в расчёт не идёт'
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
								value={moneyPrecise(result.dailyBenefit)}
								label={`Пособие за день, ${result.percent}%`}
							/>
							<ResultTile
								value={money(result.total)}
								label='Всего за период болезни'
								accent='primary'
							/>
						</div>

						{(result.cappedByBase || result.raisedToMrot) && (
							<div className='border-t px-5 py-4 text-sm text-muted-foreground sm:px-6'>
								{result.cappedByBase && (
									<p>
										Заработок превысил предельную базу — в расчёт взята только
										её величина за два года.
									</p>
								)}
								{result.raisedToMrot && (
									<p>
										Расчёт по заработку оказался ниже минимума, пособие
										подтянуто до расчёта по МРОТ.
									</p>
								)}
							</div>
						)}
					</>
				) : (
					<p className='border-t px-5 py-12 text-center text-sm text-muted-foreground sm:px-6'>
						Заполните заработок, стаж и число дней
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						Пособие облагается НДФЛ. Первые три дня болезни оплачивает
						работодатель, остальные — Соцфонд
					</span>
				</div>
			</Card>

			<ToolScreenshot slug='sick-leave-calculator' />
			<SickLeaveCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
