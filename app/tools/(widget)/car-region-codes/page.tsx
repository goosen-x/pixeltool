'use client'

import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { toolBar, toolFooterBar, toolPill } from '@/lib/ui/tool-pill'
import { CAR_REGIONS, type CarRegion } from '@/lib/data/car-region-codes'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { CarRegionCodesSeo } from './CarRegionCodesSeo'

const DISTRICTS = [
	'Все',
	...Array.from(new Set(CAR_REGIONS.map(region => region.district))).sort()
]

/** Строка таблицы вместе с тем, по какому коду она нашлась. */
type Row = { region: CarRegion; matchedFormer: string | null }

function matches(region: CarRegion, needle: string): Row | null {
	if (!needle) return { region, matchedFormer: null }

	if (region.region.toLowerCase().includes(needle)) {
		return { region, matchedFormer: null }
	}
	if (region.codes.some(code => code.startsWith(needle))) {
		return { region, matchedFormer: null }
	}

	const former = region.formerCodes?.find(code => code.startsWith(needle))
	return former ? { region, matchedFormer: former } : null
}

export default function CarRegionCodesPage() {
	const widget = getWidgetById('car-region-codes')!

	const [query, setQuery] = useState('')
	const [district, setDistrict] = useState('Все')

	const rows = useMemo(() => {
		const needle = query.trim().toLowerCase()

		return CAR_REGIONS.reduce<Row[]>((acc, region) => {
			if (district !== 'Все' && region.district !== district) return acc
			const row = matches(region, needle)
			if (row) acc.push(row)
			return acc
		}, [])
	}, [query, district])

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<input
						type='search'
						value={query}
						onChange={event => setQuery(event.target.value)}
						placeholder='Код или регион — например 116 или Татарстан'
						aria-label='Поиск по коду или названию региона'
						className='w-full max-w-sm rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
					/>

					<span className='text-sm text-muted-foreground sm:ml-auto'>
						найдено{' '}
						<span className='font-mono text-foreground'>{rows.length}</span>
					</span>
				</div>

				<div className={toolBar}>
					<div className='flex flex-wrap gap-1.5'>
						{DISTRICTS.map(option => (
							<button
								key={option}
								type='button'
								onClick={() => setDistrict(option)}
								aria-pressed={district === option}
								className={toolPill(district === option)}
							>
								{option}
							</button>
						))}
					</div>
				</div>

				{rows.length === 0 ? (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						Ничего не нашлось — проверьте код или название региона
					</p>
				) : (
					<div className='overflow-x-auto'>
						<table className='w-full text-sm'>
							<thead>
								<tr className='border-b text-left text-muted-foreground'>
									<th className='px-5 py-3 font-medium sm:px-6'>Коды</th>
									<th className='px-5 py-3 font-medium sm:px-6'>Регион</th>
									<th className='hidden px-5 py-3 font-medium sm:table-cell sm:px-6'>
										Федеральный округ
									</th>
								</tr>
							</thead>
							<tbody>
								{rows.map(({ region, matchedFormer }) => (
									<tr
										key={region.region}
										className='border-b last:border-0 hover:bg-muted/40'
									>
										<td className='px-5 py-3 font-mono whitespace-nowrap sm:px-6'>
											{region.codes.join(', ')}
											{matchedFormer && (
												<span
													className='ml-2 rounded-full border border-amber-500/40 px-2 py-0.5 text-xs text-amber-700 dark:text-amber-400'
													title='Код за этим регионом больше не выдаётся'
												>
													был {matchedFormer}
												</span>
											)}
										</td>
										<td
											className={cn(
												'px-5 py-3 sm:px-6',
												matchedFormer && 'text-muted-foreground'
											)}
										>
											{region.region}
										</td>
										<td className='hidden px-5 py-3 text-muted-foreground sm:table-cell sm:px-6'>
											{region.district}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						Коды 80, 81, 82, 84, 85 и 88 когда-то принадлежали упразднённым
						автономным округам и позже были переназначены — такие совпадения
						помечены
					</span>
				</div>
			</Card>

			<CarRegionCodesSeo />
		</WidgetSEOWrapper>
	)
}
