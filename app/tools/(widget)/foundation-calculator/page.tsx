'use client'

import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { toolBar, toolFooterBar, toolPill } from '@/lib/ui/tool-pill'
import {
	calculateFoundation,
	type FoundationType
} from '@/lib/utils/foundation-calculator'
import {
	CONCRETE_MIXES,
	type ConcreteGrade
} from '@/lib/utils/concrete-calculator'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { FoundationCalculatorSeo } from './FoundationCalculatorSeo'

const TYPES: { value: FoundationType; label: string }[] = [
	{ value: 'strip', label: 'Ленточный' },
	{ value: 'slab', label: 'Плита' },
	{ value: 'piles', label: 'Столбчатый' }
]

const GRADES: ConcreteGrade[] = ['M100', 'M200', 'M300', 'M400']
const BAG_WEIGHTS = [25, 50]

const inputClass =
	'w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'

function toNumber(value: string): number {
	const parsed = parseFloat(value.replace(',', '.'))
	return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
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

function formatKg(value: number): string {
	return value.toLocaleString('ru-RU', { maximumFractionDigits: 0 })
}

export default function FoundationCalculatorPage() {
	const widget = getWidgetById('foundation-calculator')!

	const [type, setType] = useState<FoundationType>('strip')
	const [length, setLength] = useState('10')
	const [width, setWidth] = useState('8')
	const [thickness, setThickness] = useState('0.4')
	const [height, setHeight] = useState('1.5')
	const [innerWalls, setInnerWalls] = useState('0')
	const [pileCount, setPileCount] = useState('12')
	const [pileDiameter, setPileDiameter] = useState('0.3')
	const [rebarLines, setRebarLines] = useState('4')
	const [grade, setGrade] = useState<ConcreteGrade>('M300')
	const [bagWeight, setBagWeight] = useState(50)

	const result = useMemo(() => {
		const input = {
			type,
			length: toNumber(length),
			width: toNumber(width),
			thickness: toNumber(thickness),
			height: toNumber(height),
			innerWallsLength: toNumber(innerWalls),
			pileCount: toNumber(pileCount),
			pileDiameter: toNumber(pileDiameter),
			rebarLines: toNumber(rebarLines),
			grade
		}

		const computed = calculateFoundation(input, bagWeight)
		return computed.volumeM3 > 0 ? computed : null
	}, [
		type,
		length,
		width,
		thickness,
		height,
		innerWalls,
		pileCount,
		pileDiameter,
		rebarLines,
		grade,
		bagWeight
	])

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<span className='text-sm text-muted-foreground'>Тип фундамента</span>
					<div className='flex flex-wrap gap-1.5'>
						{TYPES.map(option => (
							<button
								key={option.value}
								type='button'
								onClick={() => setType(option.value)}
								aria-pressed={type === option.value}
								className={toolPill(type === option.value)}
							>
								{option.label}
							</button>
						))}
					</div>
				</div>

				<div className='grid gap-4 border-b px-5 py-6 sm:grid-cols-3 sm:px-6'>
					{type === 'piles' ? (
						<>
							<Field
								label='Число столбов'
								value={pileCount}
								onChange={setPileCount}
							/>
							<Field
								label='Диаметр столба, м'
								value={pileDiameter}
								onChange={setPileDiameter}
							/>
							<Field
								label='Глубина заложения, м'
								value={height}
								onChange={setHeight}
							/>
						</>
					) : (
						<>
							<Field
								label='Длина дома, м'
								value={length}
								onChange={setLength}
							/>
							<Field label='Ширина дома, м' value={width} onChange={setWidth} />
							<Field
								label={type === 'slab' ? 'Толщина плиты, м' : 'Ширина ленты, м'}
								value={thickness}
								onChange={setThickness}
							/>
							{type === 'strip' && (
								<>
									<Field
										label='Высота ленты, м'
										value={height}
										onChange={setHeight}
									/>
									<Field
										label='Внутренние стены, м'
										value={innerWalls}
										onChange={setInnerWalls}
									/>
								</>
							)}
						</>
					)}
					<Field
						label='Прутков арматуры в сечении'
						value={rebarLines}
						onChange={setRebarLines}
					/>
				</div>

				{result ? (
					<>
						<div className='px-5 py-8 text-center sm:px-6'>
							<span className='block font-mono text-5xl font-bold tracking-tight text-foreground sm:text-6xl'>
								{result.volumeM3.toLocaleString('ru-RU', {
									maximumFractionDigits: 2
								})}
							</span>
							<span className='mt-2 block text-base font-medium text-muted-foreground'>
								м³ бетона
							</span>
						</div>

						<div className='grid grid-cols-2 gap-4 border-t px-5 py-6 text-center sm:grid-cols-4 sm:px-6'>
							<div>
								<span className='block font-mono text-xl font-semibold text-foreground'>
									{formatKg(result.cementKg)} кг
								</span>
								<span className='mt-1 block text-sm text-muted-foreground'>
									цемент ({result.bags} мешков)
								</span>
							</div>
							<div>
								<span className='block font-mono text-xl font-semibold text-foreground'>
									{formatKg(result.sandKg)} кг
								</span>
								<span className='mt-1 block text-sm text-muted-foreground'>
									песок
								</span>
							</div>
							<div>
								<span className='block font-mono text-xl font-semibold text-foreground'>
									{formatKg(result.gravelKg)} кг
								</span>
								<span className='mt-1 block text-sm text-muted-foreground'>
									щебень
								</span>
							</div>
							<div>
								<span className='block font-mono text-xl font-semibold text-foreground'>
									{formatKg(result.rebarMeters)} м
								</span>
								<span className='mt-1 block text-sm text-muted-foreground'>
									арматура с нахлёстом
								</span>
							</div>
						</div>
					</>
				) : (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						Заполните размеры фундамента
					</p>
				)}

				<div className={toolFooterBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						<span className='text-sm text-muted-foreground'>Марка бетона</span>
						{GRADES.map(option => (
							<button
								key={option}
								type='button'
								onClick={() => setGrade(option)}
								aria-pressed={grade === option}
								className={toolPill(grade === option)}
							>
								{option}
							</button>
						))}
					</div>

					<div className='flex items-center gap-1.5 sm:ml-auto'>
						<span className='text-sm text-muted-foreground'>Мешок</span>
						{BAG_WEIGHTS.map(option => (
							<button
								key={option}
								type='button'
								onClick={() => setBagWeight(option)}
								aria-pressed={bagWeight === option}
								className={toolPill(bagWeight === option)}
							>
								{option} кг
							</button>
						))}
					</div>
				</div>

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						{CONCRETE_MIXES[grade].usage}
					</span>
				</div>
			</Card>

			<FoundationCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
