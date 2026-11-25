'use client'

import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import {
	toolBar,
	toolFooterBar,
	toolToggleOption,
	toolToggleTrack
} from '@/lib/ui/tool-pill'
import {
	calculateTrip,
	consumptionPer100Km,
	costPerPerson,
	rangeOnLiters,
	tripDistance
} from '@/lib/utils/fuel-calculator'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { FuelCalculatorSeo } from './FuelCalculatorSeo'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'

type Mode = 'trip' | 'actual'

const inputClass =
	'w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'

function toNumber(value: string): number | null {
	const parsed = parseFloat(value.replace(',', '.'))
	return Number.isFinite(parsed) && parsed >= 0 ? parsed : null
}

function Field({
	label,
	value,
	onChange
}: {
	label: string
	value: string
	onChange: (value: string) => void
}) {
	return (
		<label className='block'>
			<span className='mb-1.5 block text-sm text-muted-foreground'>
				{label}
			</span>
			<input
				type='text'
				inputMode='decimal'
				value={value}
				onChange={event => onChange(event.target.value)}
				aria-label={label}
				className={inputClass}
			/>
		</label>
	)
}

function format(value: number, digits = 1): string {
	return value.toLocaleString('ru-RU', { maximumFractionDigits: digits })
}

export default function FuelCalculatorPage() {
	const widget = getWidgetById('fuel-calculator')!

	const [mode, setMode] = useState<Mode>('trip')

	const [distance, setDistance] = useState('500')
	const [consumption, setConsumption] = useState('8')
	// Средняя цена бензина по Росстату в ноябре 2026 года — около 75 ₽.
	const [price, setPrice] = useState('75')
	const [roundTrip, setRoundTrip] = useState(false)
	const [people, setPeople] = useState('1')

	const [actualDistance, setActualDistance] = useState('450')
	const [actualLiters, setActualLiters] = useState('36')
	const [tankVolume, setTankVolume] = useState('50')

	const trip = useMemo(() => {
		const d = toNumber(distance)
		const c = toNumber(consumption)
		const p = toNumber(price)
		if (d === null || c === null || p === null) return null
		const km = tripDistance(d, roundTrip)
		const n = toNumber(people)
		const count = n !== null && n >= 1 ? Math.floor(n) : 1
		const result = calculateTrip(km, c, p)
		return {
			...result,
			km,
			people: count,
			perPerson: costPerPerson(result.cost, count)
		}
	}, [distance, consumption, price, roundTrip, people])

	const actual = useMemo(() => {
		const d = toNumber(actualDistance)
		const l = toNumber(actualLiters)
		const tank = toNumber(tankVolume)
		if (d === null || l === null || d === 0) return null

		const per100 = consumptionPer100Km(d, l)
		return {
			per100,
			range: tank !== null ? rangeOnLiters(tank, per100) : null
		}
	}, [actualDistance, actualLiters, tankVolume])

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<div className={toolToggleTrack}>
						{(
							[
								['trip', 'Поездка'],
								['actual', 'Мой расход']
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

					<span className='text-sm text-muted-foreground sm:ml-auto'>
						{mode === 'trip'
							? 'Сколько топлива и денег уйдёт на маршрут'
							: 'Фактический расход по одной заправке до полного'}
					</span>
				</div>

				{mode === 'trip' ? (
					<>
						<div className='grid gap-4 border-b px-5 py-6 sm:grid-cols-3 sm:px-6'>
							<Field
								label='Расстояние, км'
								value={distance}
								onChange={setDistance}
							/>
							<Field
								label='Расход, л на 100 км'
								value={consumption}
								onChange={setConsumption}
							/>
							<Field label='Цена литра, ₽' value={price} onChange={setPrice} />
						</div>

						<div className='flex flex-wrap items-end gap-x-6 gap-y-4 border-b px-5 py-4 sm:px-6'>
							<label className='flex cursor-pointer items-center gap-2 py-2 text-sm text-foreground'>
								<input
									type='checkbox'
									checked={roundTrip}
									onChange={event => setRoundTrip(event.target.checked)}
									className='h-4 w-4 cursor-pointer accent-primary'
								/>
								Туда и обратно
							</label>
							<label className='flex items-center gap-2 whitespace-nowrap text-sm text-muted-foreground'>
								Делим на
								<input
									type='text'
									inputMode='numeric'
									value={people}
									onChange={event => setPeople(event.target.value)}
									aria-label='Сколько человек делят бензин'
									className={`${inputClass.replace('w-full', 'w-16')} text-center`}
								/>
								чел.
							</label>
						</div>

						{trip ? (
							<>
								<div className='px-5 py-8 text-center sm:px-6'>
									<span className='block font-mono text-5xl font-bold tracking-tight text-foreground sm:text-6xl'>
										{format(trip.cost, 0)} ₽
									</span>
									<span className='mt-2 block text-base font-medium text-muted-foreground'>
										{trip.km > 0
											? `стоимость поездки${roundTrip ? ' туда и обратно' : ''}, ${format(trip.km, 0)} км`
											: 'стоимость поездки'}
									</span>
									{trip.people > 1 && (
										<span className='mt-1 block text-sm text-muted-foreground'>
											по {format(trip.perPerson, 0)} ₽ с каждого из{' '}
											{trip.people}
										</span>
									)}
								</div>

								<div className='grid grid-cols-2 gap-4 border-t px-5 py-6 text-center sm:px-6'>
									<div>
										<span className='block font-mono text-xl font-semibold text-foreground'>
											{format(trip.liters)} л
										</span>
										<span className='mt-1 block text-sm text-muted-foreground'>
											уйдёт топлива
										</span>
									</div>
									<div>
										<span className='block font-mono text-xl font-semibold text-foreground'>
											{format(trip.costPerKm, 2)} ₽
										</span>
										<span className='mt-1 block text-sm text-muted-foreground'>
											за километр
										</span>
									</div>
								</div>
							</>
						) : (
							<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
								Заполните расстояние, расход и цену литра
							</p>
						)}
					</>
				) : (
					<>
						<div className='grid gap-4 border-b px-5 py-6 sm:grid-cols-3 sm:px-6'>
							<Field
								label='Проехали, км'
								value={actualDistance}
								onChange={setActualDistance}
							/>
							<Field
								label='Залили до полного, л'
								value={actualLiters}
								onChange={setActualLiters}
							/>
							<Field
								label='Объём бака, л'
								value={tankVolume}
								onChange={setTankVolume}
							/>
						</div>

						{actual ? (
							<>
								<div className='px-5 py-8 text-center sm:px-6'>
									<span className='block font-mono text-5xl font-bold tracking-tight text-foreground sm:text-6xl'>
										{format(actual.per100)}
									</span>
									<span className='mt-2 block text-base font-medium text-muted-foreground'>
										литров на 100 км
									</span>
								</div>

								{actual.range !== null && actual.range > 0 && (
									<div className='border-t px-5 py-6 text-center sm:px-6'>
										<span className='block font-mono text-xl font-semibold text-foreground'>
											{format(actual.range, 0)} км
										</span>
										<span className='mt-1 block text-sm text-muted-foreground'>
											запас хода на полном баке
										</span>
									</div>
								)}
							</>
						) : (
							<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
								Укажите пробег и сколько литров вошло в бак
							</p>
						)}
					</>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						{mode === 'trip'
							? 'Паспортный расход обычно занижен: город, зима и кондиционер добавляют 10–20%'
							: 'Мерить надо от полного бака до полного — только так объём заправки совпадает с потраченным'}
					</span>
				</div>
			</Card>

			<ToolScreenshot slug='fuel-calculator' />
			<FuelCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
