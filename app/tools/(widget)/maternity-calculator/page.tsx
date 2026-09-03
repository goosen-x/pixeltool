'use client'

import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { toolBar, toolFooterBar, toolPill } from '@/lib/ui/tool-pill'
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
	calculateMaternity,
	DEFAULT_CONTRIBUTION_BASE,
	DEFAULT_MROT,
	LABOR_VALUES_YEAR,
	MATERNITY_DAYS,
	type MaternityKind
} from '@/lib/utils/labor'
import { MaternityCalculatorSeo } from './MaternityCalculatorSeo'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'

const KINDS: [MaternityKind, string][] = [
	['normal', 'Обычные роды'],
	['complicated', 'Осложнённые'],
	['multiple', 'Многоплодная беременность']
]

export default function MaternityCalculatorPage() {
	const widget = getWidgetById('maternity-calculator')!

	const [earnings, setEarnings] = useState('1600000')
	const [excluded, setExcluded] = useState('0')
	const [kind, setKind] = useState<MaternityKind>('normal')
	const [mrot, setMrot] = useState(String(DEFAULT_MROT))
	const [base, setBase] = useState(String(DEFAULT_CONTRIBUTION_BASE))

	const result = useMemo(() => {
		const values = [earnings, excluded, mrot, base].map(parseNumber)
		if (values.some(v => v === null)) return null
		const [e, x, m, b] = values as number[]
		return calculateMaternity({
			twoYearsEarnings: e,
			excludedDays: x,
			kind,
			mrot: m,
			contributionBase: b
		})
	}, [earnings, excluded, kind, mrot, base])

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						{KINDS.map(([value, label]) => (
							<button
								key={value}
								type='button'
								onClick={() => setKind(value)}
								aria-pressed={kind === value}
								className={toolPill(kind === value)}
							>
								{label} · {MATERNITY_DAYS[value]} дн.
							</button>
						))}
					</div>
				</div>

				<div className='grid gap-4 px-5 py-6 sm:grid-cols-2 sm:px-6'>
					<LaborField
						label='Заработок за два предыдущих года'
						suffix='₽'
						value={earnings}
						onChange={setEarnings}
						hint='Сумма за оба года целиком'
					/>
					<LaborField
						label='Исключаемые дни'
						value={excluded}
						onChange={setExcluded}
						hint='Больничные и прошлые декреты — вычитаются из 730'
					/>
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
								value={String(result.days)}
								label='Дней отпуска'
								unit=''
							/>
							<ResultTile
								value={money(result.total)}
								label='Пособие всего'
								accent='primary'
							/>
						</div>

						<div className='border-t px-5 py-4 text-sm text-muted-foreground sm:px-6'>
							<p>Делили на {result.daysBase} дней вместо 730.</p>
							{result.cappedByBase && (
								<p>
									Заработок превысил предельную базу — в расчёт взята только её
									величина.
								</p>
							)}
							{result.raisedToMrot && (
								<p>Расчёт оказался ниже минимума и подтянут до МРОТ.</p>
							)}
						</div>
					</>
				) : (
					<p className='border-t px-5 py-12 text-center text-sm text-muted-foreground sm:px-6'>
						Заполните заработок; исключаемых дней не может быть 730 и больше
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						Пособие по беременности и родам НДФЛ не облагается, и стаж на его
						размер не влияет — платят 100% независимо от него
					</span>
				</div>
			</Card>

			<ToolScreenshot slug='maternity-calculator' />
			<MaternityCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
