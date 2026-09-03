'use client'

import { useMemo, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toolBar, toolFooterBar, toolIconButton } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { calculateServiceLength, type Period } from '@/lib/utils/labor'
import { pluralizeRu } from '@/lib/utils/pluralize'
import { sickLeavePercent } from '@/lib/utils/labor'
import { ServiceLengthCalculatorSeo } from './ServiceLengthCalculatorSeo'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'

export default function ServiceLengthCalculatorPage() {
	const widget = getWidgetById('service-length-calculator')!

	const [periods, setPeriods] = useState<Period[]>([
		{ from: '2015-03-10', to: '2020-08-31' },
		{ from: '2020-09-15', to: '2026-09-01' }
	])

	const result = useMemo(() => calculateServiceLength(periods), [periods])

	const update = (index: number, patch: Partial<Period>) =>
		setPeriods(current =>
			current.map((item, i) => (i === index ? { ...item, ...patch } : item))
		)

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<span className='text-sm text-muted-foreground'>
						Периоды работы из трудовой книжки — день увольнения входит в стаж
					</span>
					<Button
						variant='ghost'
						onClick={() =>
							setPeriods(current => [...current, { from: '', to: '' }])
						}
						className='cursor-pointer gap-2 px-2 text-sm sm:ml-auto'
					>
						<Plus className='h-4 w-4' />
						Добавить период
					</Button>
				</div>

				<div className='space-y-3 px-5 py-6 sm:px-6'>
					{periods.map((period, index) => (
						<div key={index} className='flex flex-wrap items-center gap-2'>
							<input
								type='date'
								value={period.from}
								onChange={event => update(index, { from: event.target.value })}
								aria-label={`Период ${index + 1}: дата приёма`}
								className='rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
							/>
							<span className='text-muted-foreground'>—</span>
							<input
								type='date'
								value={period.to}
								onChange={event => update(index, { to: event.target.value })}
								aria-label={`Период ${index + 1}: дата увольнения`}
								className='rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
							/>
							{periods.length > 1 && (
								<Button
									size='icon'
									variant='ghost'
									onClick={() =>
										setPeriods(current => current.filter((_, i) => i !== index))
									}
									title='Убрать период'
									className={toolIconButton}
								>
									<X className='h-4 w-4' />
								</Button>
							)}
						</div>
					))}
				</div>

				{result ? (
					<div className='border-t px-5 py-8 text-center sm:px-6'>
						<span className='block font-mono text-3xl font-bold tracking-tight'>
							{result.years} {pluralizeRu(result.years, ['год', 'года', 'лет'])}{' '}
							{result.months}{' '}
							{pluralizeRu(result.months, ['месяц', 'месяца', 'месяцев'])}{' '}
							{result.days} {pluralizeRu(result.days, ['день', 'дня', 'дней'])}
						</span>
						<span className='mt-2 block text-sm text-muted-foreground'>
							всего {result.totalDays.toLocaleString('ru-RU')} календарных дней
						</span>
						<span className='mt-3 block text-sm'>
							Больничный при таком стаже —{' '}
							<span className='font-medium'>
								{sickLeavePercent(result.years)}%
							</span>{' '}
							от среднего заработка
						</span>
					</div>
				) : (
					<p className='border-t px-5 py-12 text-center text-sm text-muted-foreground sm:px-6'>
						Укажите хотя бы один период с датами
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						Годы и месяцы считаются по 360 и 30 дней — так предписано для
						подсчёта стажа, хотя календарно месяцы разной длины
					</span>
				</div>
			</Card>

			<ToolScreenshot slug='service-length-calculator' />
			<ServiceLengthCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
