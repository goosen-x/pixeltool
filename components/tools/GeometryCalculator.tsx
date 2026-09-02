'use client'

import { useMemo, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ToolSelect } from '@/components/ui/tool-select'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import { ShapeDiagram } from '@/components/tools/ShapeDiagram'
import { shapesByKind, type Shape } from '@/lib/constants/geometry-shapes'
import {
	cubicMetersToLiters,
	formatNumber,
	LENGTH_LABELS,
	toMeters,
	type LengthUnit,
	type Opening
} from '@/lib/utils/geometry'

const UNITS: LengthUnit[] = ['mm', 'cm', 'm']

interface GeometryCalculatorProps {
	kind: 'area' | 'volume'
	/** Фигура, открытая по умолчанию — на подстранице своя. */
	initialShapeId?: string
}

export function GeometryCalculator({
	kind,
	initialShapeId
}: GeometryCalculatorProps) {
	const shapes = useMemo(() => shapesByKind(kind), [kind])
	const [shapeId, setShapeId] = useState(initialShapeId ?? shapes[0].id)
	const [unit, setUnit] = useState<LengthUnit>('m')
	const [values, setValues] = useState<Record<string, string>>(() =>
		presetsFor(shapes.find(s => s.id === (initialShapeId ?? shapes[0].id))!)
	)
	const [openings, setOpenings] = useState<Opening[]>([
		{ width: 0.9, height: 2.1, count: 1 }
	])

	const shape = shapes.find(item => item.id === shapeId) ?? shapes[0]

	const selectShape = (next: Shape) => {
		setShapeId(next.id)
		// Значения по умолчанию у каждой фигуры свои: перенести «диаметр 5»
		// с прямоугольника на трубу значило бы показать заведомую чушь.
		setValues(presetsFor(next))
	}

	const numbers = useMemo(() => {
		const parsed: Record<string, number> = {}
		for (const field of shape.fields) {
			const raw = parseFloat((values[field.key] ?? '').replace(',', '.'))
			if (!Number.isFinite(raw) || raw <= 0) return null
			parsed[field.key] = toMeters(raw, unit)
		}
		return parsed
	}, [shape, values, unit])

	const result = useMemo(() => {
		if (!numbers) return null
		return shape.compute(numbers, shape.id === 'walls' ? openings : undefined)
	}, [shape, numbers, openings])

	const isArea = kind === 'area'

	return (
		<Card className='overflow-hidden p-0'>
			<div className={toolBar}>
				<div className='flex flex-wrap items-center gap-1.5'>
					{shapes.map(item => (
						<button
							key={item.id}
							type='button'
							onClick={() => selectShape(item)}
							aria-pressed={item.id === shape.id}
							className={toolPill(item.id === shape.id)}
						>
							{item.name}
						</button>
					))}
				</div>

				<label className='flex items-center gap-2 text-sm text-muted-foreground sm:ml-auto'>
					Размеры в
					<ToolSelect
						value={unit}
						onChange={event => setUnit(event.target.value as LengthUnit)}
						aria-label='Единица измерения ввода'
					>
						{UNITS.map(value => (
							<option key={value} value={value}>
								{LENGTH_LABELS[value]}
							</option>
						))}
					</ToolSelect>
				</label>
			</div>

			<div className='grid gap-8 px-5 py-8 sm:px-6 md:grid-cols-2'>
				<div className='flex flex-col gap-4'>
					<ShapeDiagram
						shapeId={shape.id}
						className='mx-auto h-44 w-full max-w-xs'
					/>
					<p className='text-center font-mono text-sm text-muted-foreground'>
						{shape.formula}
					</p>
				</div>

				<div className='space-y-4'>
					<div className='grid gap-3 sm:grid-cols-2'>
						{shape.fields.map(field => (
							<label key={field.key} className='block'>
								<span className='mb-1.5 block text-sm text-muted-foreground'>
									{field.label}, {LENGTH_LABELS[unit]}
								</span>
								<input
									type='text'
									inputMode='decimal'
									value={values[field.key] ?? ''}
									onChange={event =>
										setValues(current => ({
											...current,
											[field.key]: event.target.value
										}))
									}
									aria-label={`Размер ${field.label} в ${LENGTH_LABELS[unit]}`}
									className='w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
								/>
							</label>
						))}
					</div>

					{shape.id === 'walls' && (
						<div className='space-y-2'>
							<span className='block text-sm text-muted-foreground'>
								Проёмы — окна и двери, вычитаются из площади стен
							</span>
							{openings.map((opening, index) => (
								<div key={index} className='flex items-center gap-2'>
									<OpeningInput
										value={opening.width}
										label='ширина, м'
										onChange={width =>
											setOpenings(current =>
												current.map((item, i) =>
													i === index ? { ...item, width } : item
												)
											)
										}
									/>
									<span className='text-muted-foreground'>×</span>
									<OpeningInput
										value={opening.height}
										label='высота, м'
										onChange={height =>
											setOpenings(current =>
												current.map((item, i) =>
													i === index ? { ...item, height } : item
												)
											)
										}
									/>
									<span className='text-muted-foreground'>шт.</span>
									<OpeningInput
										value={opening.count}
										label='количество'
										onChange={count =>
											setOpenings(current =>
												current.map((item, i) =>
													i === index ? { ...item, count } : item
												)
											)
										}
									/>
									<Button
										size='icon'
										variant='ghost'
										onClick={() =>
											setOpenings(current =>
												current.filter((_, i) => i !== index)
											)
										}
										title='Убрать проём'
										className={toolIconButton}
									>
										<X className='h-4 w-4' />
									</Button>
								</div>
							))}
							<Button
								variant='ghost'
								onClick={() =>
									setOpenings(current => [
										...current,
										{ width: 1.4, height: 1.5, count: 1 }
									])
								}
								className='cursor-pointer gap-2 px-2 text-sm'
							>
								<Plus className='h-4 w-4' />
								Добавить проём
							</Button>
						</div>
					)}

					{result ? (
						<div className='rounded-xl border p-4'>
							<span className='block font-mono text-3xl font-bold tracking-tight'>
								{formatNumber(result.value)}{' '}
								<span className='text-xl text-muted-foreground'>
									{isArea ? 'м²' : 'м³'}
								</span>
							</span>

							{!isArea && (
								<span className='mt-1 block text-sm text-muted-foreground'>
									это {formatNumber(cubicMetersToLiters(result.value))} литров
								</span>
							)}
							{isArea && (
								<span className='mt-1 block text-sm text-muted-foreground'>
									это {formatNumber(result.value * 10000)} см²
								</span>
							)}

							{result.extra?.map(extra => (
								<span
									key={extra.label}
									className='mt-2 block text-sm text-muted-foreground'
								>
									{extra.label}:{' '}
									<span className='font-mono text-foreground'>
										{formatNumber(extra.value)}{' '}
										{extra.unit === 'm2' ? 'м²' : 'м³'}
									</span>
									{extra.unit === 'm3' && (
										<> ({formatNumber(cubicMetersToLiters(extra.value))} л)</>
									)}
								</span>
							))}
						</div>
					) : (
						<p className='rounded-xl border border-dashed p-4 text-sm text-muted-foreground'>
							{shape.id === 'triangle'
								? 'Проверьте стороны: сумма любых двух должна быть больше третьей, иначе такого треугольника не существует'
								: 'Заполните все размеры положительными числами'}
						</p>
					)}
				</div>
			</div>

			<div className={toolFooterBar}>
				<span className='text-sm text-muted-foreground'>
					Круглые фигуры задаются диаметром, а не радиусом — рулетка ложится
					через центр, и радиус не приходится считать в уме
				</span>
			</div>
		</Card>
	)
}

function presetsFor(shape: Shape): Record<string, string> {
	return Object.fromEntries(
		shape.fields.map(field => [field.key, String(field.preset)])
	)
}

function OpeningInput({
	value,
	label,
	onChange
}: {
	value: number
	label: string
	onChange: (value: number) => void
}) {
	return (
		<input
			type='text'
			inputMode='decimal'
			value={value}
			onChange={event => {
				const parsed = parseFloat(event.target.value.replace(',', '.'))
				onChange(Number.isFinite(parsed) && parsed >= 0 ? parsed : 0)
			}}
			aria-label={`Проём: ${label}`}
			className='w-16 rounded-md border bg-background px-2 py-1 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
		/>
	)
}
