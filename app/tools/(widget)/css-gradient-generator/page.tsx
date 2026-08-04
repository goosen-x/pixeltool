'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { GradientGuide } from './GradientGuide'
import { Slider } from '@/components/ui/slider'
import { Copy, Check, RotateCcw, Plus, Trash2, Shuffle } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import { useCSSGradientGenerator } from '@/lib/hooks/widgets'
import {
	generateGradientCSS,
	DEFAULT_GRADIENT_SETTINGS
} from '@/lib/data/css-gradient-data'

import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
// Force dynamic rendering to avoid build-time errors
export const dynamic = 'force-dynamic'

const LINEAR_DIRECTIONS = [
	'to top',
	'to right',
	'to bottom',
	'to left',
	'to top right',
	'to bottom right'
] as const

const RADIAL_SIZES = [
	'closest-side',
	'closest-corner',
	'farthest-side',
	'farthest-corner'
] as const

export default function CSSGradientGeneratorPage() {
	const widget = getWidgetById('css-gradient')!
	const {
		settings,
		selectedStopId,
		selectedStop,
		gradientCSS,
		filteredGradients,
		setSelectedStopId,
		updateGradientType,
		updateLinearDirection,
		updateLinearAngle,
		updateRadialShape,
		updateRadialSize,
		updateRadialPosition,
		updateConicAngle,
		updateConicPosition,
		toggleRepeating,
		addColorStop,
		removeColorStop,
		updateSelectedStop,
		applyPresetGradient,
		generateRandom,
		resetGradient
	} = useCSSGradientGenerator({
		translations: {
			copied: 'CSS скопирован в буфер обмена!',
			copyError: 'Ошибка при копировании CSS',
			gradientApplied: 'Градиент применен!',
			colorStopAdded: 'Цветовая точка добавлена',
			colorStopRemoved: 'Цветовая точка удалена',
			gradientRandomized: 'Случайный градиент сгенерирован!'
		}
	})

	const [copiedCSS, setCopiedCSS] = useState(false)
	const [copiedTailwind, setCopiedTailwind] = useState(false)

	const tailwindClass = `bg-[${gradientCSS.replace(/\s+/g, '_')}]`

	const copyCssCode = async () => {
		await navigator.clipboard.writeText(`background: ${gradientCSS};`)
		setCopiedCSS(true)
		setTimeout(() => setCopiedCSS(false), 2000)
	}

	const copyTailwindCode = async () => {
		await navigator.clipboard.writeText(tailwindClass)
		setCopiedTailwind(true)
		setTimeout(() => setCopiedTailwind(false), 2000)
	}

	/** Ползунок с подписью — тот же вид, что в генераторе теней. */
	const sliderControl = (
		label: string,
		value: number,
		onChange: (value: number) => void,
		options: { min: number; max: number; suffix?: string }
	) => (
		<label className='flex items-center gap-2 text-sm text-muted-foreground'>
			<span className='font-mono text-xs'>{label}</span>
			<Slider
				value={[value]}
				onValueChange={([next]) => onChange(next)}
				min={options.min}
				max={options.max}
				step={1}
				className='w-24 cursor-pointer'
				aria-label={label}
			/>
			<span className='w-10 font-mono text-sm text-foreground tabular-nums'>
				{value}
				{options.suffix ?? ''}
			</span>
		</label>
	)

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: тип градиента задаёт, какие параметры вообще
				    имеют смысл ниже, поэтому он первый. */}
				<div className={toolBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						{(['linear', 'radial', 'conic'] as const).map(type => (
							<button
								key={type}
								type='button'
								onClick={() => updateGradientType(type)}
								aria-pressed={settings.type === type}
								className={toolPill(settings.type === type, 'font-mono')}
							>
								{type}
							</button>
						))}
						<button
							type='button'
							onClick={toggleRepeating}
							aria-pressed={settings.repeating}
							title='Повторять градиент до края элемента'
							className={toolPill(settings.repeating, 'ml-3 font-mono')}
						>
							repeating
						</button>
					</div>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={generateRandom}
							title='Случайный градиент'
							className={toolIconButton}
						>
							<Shuffle className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={resetGradient}
							title='Сбросить настройки'
							className={toolIconButton}
						>
							<RotateCcw className='h-4 w-4' />
						</Button>
					</div>
				</div>

				{/* Сам градиент во всю ширину карточки: он и есть результат, рамка
				    и отступы вокруг превью только уменьшали его. */}
				<div className='h-64 w-full' style={{ background: gradientCSS }} />

				{/* Полоса цветовых точек. */}
				<div className={toolFooterBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						<span className='mr-1 text-sm text-muted-foreground'>Цвета</span>
						{settings.colorStops.map((stop, index) => (
							<button
								key={stop.id}
								type='button'
								onClick={() => setSelectedStopId(stop.id)}
								aria-pressed={selectedStopId === stop.id}
								title={`${stop.color} на ${stop.position}%`}
								className={toolPill(
									selectedStopId === stop.id,
									'flex items-center gap-2'
								)}
							>
								<span
									className='h-3 w-3 rounded-full border'
									style={{
										backgroundColor: stop.color,
										opacity: stop.opacity / 100
									}}
								/>
								<span className='font-mono text-xs'>{stop.position}%</span>
								<span className='sr-only'>Точка {index + 1}</span>
							</button>
						))}
						<Button
							size='icon'
							variant='ghost'
							onClick={addColorStop}
							title='Добавить цветовую точку'
							className={cn(toolIconButton, 'h-7 w-7')}
						>
							<Plus className='h-3.5 w-3.5' />
						</Button>
					</div>

					{selectedStop && (
						<div className='flex items-center gap-0.5 sm:ml-auto'>
							<Button
								size='icon'
								variant='ghost'
								onClick={() => removeColorStop(selectedStop.id)}
								disabled={settings.colorStops.length <= 2}
								title={
									settings.colorStops.length <= 2
										? 'В градиенте должно остаться минимум две точки'
										: 'Удалить точку'
								}
								className={toolIconButton}
							>
								<Trash2 className='h-4 w-4' />
							</Button>
						</div>
					)}
				</div>

				{/* Полоса выбранной точки: цвет, где стоит и насколько прозрачна. */}
				{selectedStop && (
					<div className={toolFooterBar}>
						<label className='flex items-center gap-2 text-sm text-muted-foreground'>
							<span className='font-mono text-xs'>color</span>
							<input
								type='color'
								value={selectedStop.color}
								onChange={event =>
									updateSelectedStop({ color: event.target.value })
								}
								aria-label='Цвет точки'
								className='h-7 w-9 cursor-pointer rounded-md border bg-background p-0.5'
							/>
							<input
								value={selectedStop.color}
								onChange={event =>
									updateSelectedStop({ color: event.target.value })
								}
								spellCheck={false}
								className='w-24 rounded-md border bg-background px-2 py-1 font-mono text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
							/>
						</label>

						{sliderControl(
							'position',
							selectedStop.position,
							value => updateSelectedStop({ position: value }),
							{ min: 0, max: 100, suffix: '%' }
						)}
						{sliderControl(
							'alpha',
							selectedStop.opacity,
							value => updateSelectedStop({ opacity: value }),
							{ min: 0, max: 100, suffix: '%' }
						)}
					</div>
				)}

				{/* Полоса геометрии — у каждого типа градиента она своя. */}
				<div className={toolFooterBar}>
					{settings.type === 'linear' && (
						<>
							<div className='flex flex-wrap items-center gap-1.5'>
								{LINEAR_DIRECTIONS.map(direction => (
									<button
										key={direction}
										type='button'
										onClick={() => updateLinearDirection(direction)}
										aria-pressed={settings.linearDirection === direction}
										className={toolPill(
											settings.linearDirection === direction,
											'font-mono text-xs'
										)}
									>
										{direction}
									</button>
								))}
							</div>
							{sliderControl('angle', settings.linearAngle, updateLinearAngle, {
								min: 0,
								max: 360,
								suffix: '°'
							})}
						</>
					)}

					{settings.type === 'radial' && (
						<>
							<div className='flex flex-wrap items-center gap-1.5'>
								{(['circle', 'ellipse'] as const).map(shape => (
									<button
										key={shape}
										type='button'
										onClick={() => updateRadialShape(shape)}
										aria-pressed={settings.radialShape === shape}
										className={toolPill(
											settings.radialShape === shape,
											'font-mono'
										)}
									>
										{shape}
									</button>
								))}
							</div>
							<label className='flex items-center gap-2 text-sm text-muted-foreground'>
								<span className='font-mono text-xs'>size</span>
								<select
									value={settings.radialSize}
									onChange={event =>
										updateRadialSize(
											event.target.value as (typeof RADIAL_SIZES)[number]
										)
									}
									className='cursor-pointer rounded-md border bg-background px-2 py-1 font-mono text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
								>
									{RADIAL_SIZES.map(size => (
										<option key={size} value={size}>
											{size}
										</option>
									))}
								</select>
							</label>
							{sliderControl(
								'x',
								settings.radialPositionX,
								value => updateRadialPosition(value, settings.radialPositionY),
								{ min: 0, max: 100, suffix: '%' }
							)}
							{sliderControl(
								'y',
								settings.radialPositionY,
								value => updateRadialPosition(settings.radialPositionX, value),
								{ min: 0, max: 100, suffix: '%' }
							)}
						</>
					)}

					{settings.type === 'conic' && (
						<>
							{sliderControl('angle', settings.conicAngle, updateConicAngle, {
								min: 0,
								max: 360,
								suffix: '°'
							})}
							{sliderControl(
								'x',
								settings.conicPositionX,
								value => updateConicPosition(value, settings.conicPositionY),
								{ min: 0, max: 100, suffix: '%' }
							)}
							{sliderControl(
								'y',
								settings.conicPositionY,
								value => updateConicPosition(settings.conicPositionX, value),
								{ min: 0, max: 100, suffix: '%' }
							)}
						</>
					)}
				</div>

				<div className='grid border-t md:grid-cols-2'>
					{[
						{
							title: 'CSS',
							value: `background: ${gradientCSS};`,
							copied: copiedCSS,
							onCopy: copyCssCode
						},
						{
							title: 'Tailwind',
							value: tailwindClass,
							copied: copiedTailwind,
							onCopy: copyTailwindCode
						}
					].map((pane, index) => (
						<div
							key={pane.title}
							className={cn(
								'flex min-w-0 flex-col',
								index === 0 && 'md:border-r',
								index === 1 && 'border-t md:border-t-0'
							)}
						>
							<div className='flex items-center justify-between gap-2 px-5 pt-4 sm:px-6'>
								<span className='text-sm font-medium'>{pane.title}</span>
								<Button
									size='icon'
									variant='ghost'
									onClick={pane.onCopy}
									title='Скопировать'
									className={toolIconButton}
								>
									{pane.copied ? (
										<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
									) : (
										<Copy className='h-4 w-4' />
									)}
								</Button>
							</div>
							<pre className='overflow-x-auto px-5 pt-2 pb-5 font-mono text-xs leading-relaxed break-all whitespace-pre-wrap sm:px-6'>
								{pane.value}
							</pre>
						</div>
					))}
				</div>
			</Card>

			{/* Готовые градиенты — тихая полка под инструментом: их выбирают
			    глазами, названия в списке ничего не дали бы. */}
			<div className='mt-6'>
				<p className='px-1 text-sm text-muted-foreground'>
					Готовые градиенты — кликните, чтобы загрузить в конструктор
				</p>
				<div className='mt-2 flex flex-wrap gap-2'>
					{filteredGradients.map((preset, index) => (
						<button
							key={index}
							type='button'
							onClick={() => applyPresetGradient(preset)}
							title={preset.name}
							aria-label={preset.name}
							className='h-10 w-10 cursor-pointer rounded-md border transition-colors hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
							style={{
								background: generateGradientCSS({
									...DEFAULT_GRADIENT_SETTINGS,
									...preset.settings
								})
							}}
						/>
					))}
				</div>
			</div>

			<GradientGuide />
		</WidgetSEOWrapper>
	)
}
