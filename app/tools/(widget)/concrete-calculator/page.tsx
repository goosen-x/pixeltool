'use client'

import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { toolBar, toolFooterBar, toolPill } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import {
	calculateConcrete,
	CONCRETE_MIXES,
	type ConcreteGrade
} from '@/lib/utils/concrete-calculator'
import { ConcreteCalculatorSeo } from './ConcreteCalculatorSeo'

const GRADES: ConcreteGrade[] = ['M100', 'M200', 'M300', 'M400']
const BAG_WEIGHTS = [25, 50]

const inputClass =
	'w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'

function toNumber(value: string): number | null {
	const parsed = parseFloat(value.replace(',', '.'))
	return Number.isFinite(parsed) && parsed > 0 ? parsed : null
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

export default function ConcreteCalculatorPage() {
	const widget = getWidgetById('concrete-calculator')!

	const [length, setLength] = useState('5')
	const [width, setWidth] = useState('3')
	const [height, setHeight] = useState('0.2')
	const [grade, setGrade] = useState<ConcreteGrade>('M200')
	const [bagWeight, setBagWeight] = useState(50)

	const result = useMemo(() => {
		const l = toNumber(length)
		const w = toNumber(width)
		const h = toNumber(height)
		if (!l || !w || !h) return null
		return calculateConcrete(l, w, h, grade, bagWeight)
	}, [length, width, height, grade, bagWeight])

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<span className='text-sm text-muted-foreground'>Марка бетона</span>
					<div className='flex flex-wrap gap-1.5'>
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
				</div>

				<div className='grid gap-4 border-b px-5 py-6 sm:grid-cols-3 sm:px-6'>
					<Field label='Длина, м' value={length} onChange={setLength} />
					<Field label='Ширина, м' value={width} onChange={setWidth} />
					<Field label='Высота (толщина), м' value={height} onChange={setHeight} />
				</div>

				{result ? (
					<>
						<div className='px-5 py-8 text-center sm:px-6'>
							<span className='block font-mono text-5xl font-bold tracking-tight text-foreground sm:text-6xl'>
								{result.volumeM3.toLocaleString('ru-RU', { maximumFractionDigits: 2 })}
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
								<span className='mt-1 block text-sm text-muted-foreground'>песок</span>
							</div>
							<div>
								<span className='block font-mono text-xl font-semibold text-foreground'>
									{formatKg(result.gravelKg)} кг
								</span>
								<span className='mt-1 block text-sm text-muted-foreground'>щебень</span>
							</div>
							<div>
								<span className='block font-mono text-xl font-semibold text-foreground'>
									{formatKg(result.waterL)} л
								</span>
								<span className='mt-1 block text-sm text-muted-foreground'>вода</span>
							</div>
						</div>
					</>
				) : (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						Укажите длину, ширину и высоту
					</p>
				)}

				<div className={toolFooterBar}>
					<div className='flex items-center gap-2'>
						<span className='text-sm text-muted-foreground'>Мешок цемента</span>
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
					<span className='ml-auto text-sm text-muted-foreground'>
						{CONCRETE_MIXES[grade].usage}
					</span>
				</div>
			</Card>

			<ConcreteCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
