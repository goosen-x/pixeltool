'use client'

import { useCallback, useMemo, useState } from 'react'
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
import {
	HairlineFigure,
	type FigureDim
} from '@/components/tools/HairlineFigure'
import { GEOMETRY_FIGURES } from '@/lib/hairline/figures/geometry'
import { shapesByKind, type Shape } from '@/lib/constants/geometry-shapes'
import {
	areaAside,
	convertLengthInput,
	formatNumber,
	formatVolume,
	LENGTH_LABELS,
	parseLength,
	parseOpenings,
	toMeters,
	type LengthUnit,
	type OpeningInput
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
	// Проёмы хранятся строками в текущих единицах, как и размеры фигуры:
	// числовое поле съедало запятую, и «0,9» было не набрать.
	const [openings, setOpenings] = useState<OpeningInput[]>([
		{ width: '0.9', height: '2.1', count: '1' }
	])

	const [focusKey, setFocusKey] = useState<string | null>(null)

	const shape = shapes.find(item => item.id === shapeId) ?? shapes[0]

	// Размеры для объёмной схемы: каждый сам по себе, пустое поле не гасит
	// остальные выноски.
	const figureDims = useMemo<FigureDim[]>(
		() =>
			shape.fields.map(field => {
				const raw = (values[field.key] ?? '').trim()
				const value = parseLength(raw) ?? 0
				const ok = value > 0
				return {
					key: field.key,
					letter: field.label,
					meters: ok ? toMeters(value, unit) : null,
					text: ok ? `${raw.replace('.', ',')} ${LENGTH_LABELS[unit]}` : '?'
				}
			}),
		[shape, values, unit]
	)

	const focusField = useCallback((key: string) => {
		document.getElementById(`geometry-field-${key}`)?.focus()
	}, [])

	const selectShape = (next: Shape) => {
		setShapeId(next.id)
		// Значения по умолчанию у каждой фигуры свои: перенести «диаметр 5»
		// с прямоугольника на трубу значило бы показать заведомую чушь.
		setValues(presetsFor(next))
	}

	const numbers = useMemo(() => {
		const parsed: Record<string, number> = {}
		for (const field of shape.fields) {
			const raw = parseLength(values[field.key] ?? '')
			if (raw === null) return null
			parsed[field.key] = toMeters(raw, unit)
		}
		return parsed
	}, [shape, values, unit])

	const result = useMemo(() => {
		if (!numbers) return null
		return shape.compute(
			numbers,
			shape.id === 'walls' ? parseOpenings(openings, unit) : undefined
		)
	}, [shape, numbers, openings, unit])

	const isArea = kind === 'area'

	// Смена единиц пересчитывает введённые размеры: фигура остаётся той же,
	// меняется только запись (5 м → 500 см).
	const changeUnit = (next: LengthUnit) => {
		setValues(current =>
			Object.fromEntries(
				Object.entries(current).map(([key, raw]) => [
					key,
					convertLengthInput(raw, unit, next)
				])
			)
		)
		setOpenings(current =>
			current.map(opening => ({
				...opening,
				width: convertLengthInput(opening.width, unit, next),
				height: convertLengthInput(opening.height, unit, next)
			}))
		)
		setUnit(next)
	}

	const updateOpening = (index: number, patch: Partial<OpeningInput>) =>
		setOpenings(current =>
			current.map((item, i) => (i === index ? { ...item, ...patch } : item))
		)

	const volume = !isArea && result ? formatVolume(result.value) : null

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
						onChange={event => changeUnit(event.target.value as LengthUnit)}
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
					{GEOMETRY_FIGURES[shape.id] ? (
						<HairlineFigure
							id={shape.id}
							figure={GEOMETRY_FIGURES[shape.id]}
							dims={figureDims}
							focusKey={focusKey}
							onPick={focusField}
							className='mx-auto w-full max-w-sm'
						/>
					) : (
						<ShapeDiagram
							shapeId={shape.id}
							className='mx-auto h-44 w-full max-w-xs'
						/>
					)}
					<p className='text-center font-mono text-sm text-muted-foreground'>
						{shape.formula}
					</p>
				</div>

				<div className='space-y-4'>
					<div className='grid gap-3 sm:grid-cols-2'>
						{shape.fields.map(field => (
							<label key={field.key} className='block'>
								<span className='mb-1.5 block text-sm text-muted-foreground'>
									{field.name ?? field.label}, {LENGTH_LABELS[unit]}
								</span>
								<input
									id={`geometry-field-${field.key}`}
									type='text'
									inputMode='decimal'
									value={values[field.key] ?? ''}
									onFocus={() => setFocusKey(field.key)}
									onBlur={() =>
										setFocusKey(current =>
											current === field.key ? null : current
										)
									}
									onChange={event =>
										setValues(current => ({
											...current,
											[field.key]: event.target.value
										}))
									}
									aria-label={`${field.name ?? `Размер ${field.label}`} в ${LENGTH_LABELS[unit]}`}
									className='w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
								/>
							</label>
						))}
					</div>

					{shape.id === 'walls' && (
						<div className='space-y-2'>
							<span className='block text-sm text-muted-foreground'>
								Окна и двери, {LENGTH_LABELS[unit]}: ширина × высота ×
								количество. Вычитаются из площади стен
							</span>
							{openings.map((opening, index) => (
								<div key={index} className='flex items-center gap-2'>
									<OpeningField
										value={opening.width}
										label={`ширина, ${LENGTH_LABELS[unit]}`}
										onChange={width => updateOpening(index, { width })}
									/>
									<span className='text-muted-foreground'>×</span>
									<OpeningField
										value={opening.height}
										label={`высота, ${LENGTH_LABELS[unit]}`}
										onChange={height => updateOpening(index, { height })}
									/>
									<span className='text-muted-foreground'>×</span>
									<OpeningField
										value={opening.count}
										label='количество, шт.'
										onChange={count => updateOpening(index, { count })}
									/>
									<span className='text-sm text-muted-foreground'>шт.</span>
									<Button
										size='icon'
										variant='ghost'
										onClick={() =>
											setOpenings(current =>
												current.filter((_, i) => i !== index)
											)
										}
										title='Убрать проём'
										aria-label='Убрать проём'
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
										// типовое окно 1,4 × 1,5 м в текущих единицах
										{
											width: convertLengthInput('1.4', 'm', unit),
											height: convertLengthInput('1.5', 'm', unit),
											count: '1'
										}
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
						<div className='rounded-xl border p-4' aria-live='polite'>
							{result.label && (
								<span className='mb-1 block text-sm text-muted-foreground'>
									{result.label}
								</span>
							)}
							<span className='block font-mono text-3xl font-bold tracking-tight'>
								{volume ? volume.value : formatNumber(result.value)}{' '}
								<span className='text-xl text-muted-foreground'>
									{volume ? volume.unit : 'м²'}
								</span>
							</span>

							{volume && (
								<span className='mt-1 block text-sm text-muted-foreground'>
									это {volume.liters}
								</span>
							)}
							{isArea && areaAside(result.value) && (
								<span className='mt-1 block text-sm text-muted-foreground'>
									это {areaAside(result.value)}
								</span>
							)}

							{result.extra?.map(extra => (
								<span
									key={extra.label}
									className='mt-2 block text-sm text-muted-foreground'
								>
									{extra.label}:{' '}
									{extra.unit === 'm3' ? (
										<VolumeValue cubicMeters={extra.value} />
									) : (
										<span className='font-mono text-foreground'>
											{formatNumber(extra.value)} м²
										</span>
									)}
								</span>
							))}
						</div>
					) : (
						<p className='rounded-xl border border-dashed p-4 text-sm text-muted-foreground'>
							{numbers && shape.invalidHint
								? shape.invalidHint
								: 'Заполните все размеры положительными числами, например 1,5'}
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

function VolumeValue({ cubicMeters }: { cubicMeters: number }) {
	const { value, unit, liters } = formatVolume(cubicMeters)
	return (
		<span className='font-mono text-foreground'>
			{value} {unit} ({liters})
		</span>
	)
}

function presetsFor(shape: Shape): Record<string, string> {
	return Object.fromEntries(
		shape.fields.map(field => [field.key, String(field.preset)])
	)
}

function OpeningField({
	value,
	label,
	onChange
}: {
	value: string
	label: string
	onChange: (value: string) => void
}) {
	return (
		<input
			type='text'
			inputMode='decimal'
			value={value.replace('.', ',')}
			onChange={event => onChange(event.target.value)}
			aria-label={`Проём: ${label}`}
			placeholder={label.split(',')[0]}
			className='w-16 min-w-0 max-w-24 flex-1 rounded-md border bg-background px-2 py-1 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
		/>
	)
}
