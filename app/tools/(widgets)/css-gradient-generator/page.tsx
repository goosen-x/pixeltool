'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { GradientGuide } from './GradientGuide'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Copy, Check, RefreshCw, Plus, Trash2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCSSGradientGenerator } from '@/lib/hooks/widgets'
import {
	generateGradientCSS,
	DEFAULT_GRADIENT_SETTINGS
} from '@/lib/data/css-gradient-data'

import { WidgetInput } from '@/components/widgets/WidgetInput'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
// Force dynamic rendering to avoid build-time errors
export const dynamic = 'force-dynamic'

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

	const copyCssCode = async () => {
		await navigator.clipboard.writeText(`background: ${gradientCSS};`)
		setCopiedCSS(true)
		setTimeout(() => setCopiedCSS(false), 2000)
		toast.success('CSS скопирован в буфер обмена')
	}

	const copyTailwindCode = async () => {
		await navigator.clipboard.writeText(
			`bg-[${gradientCSS.replace(/\s+/g, '_')}]`
		)
		setCopiedTailwind(true)
		setTimeout(() => setCopiedTailwind(false), 2000)
		toast.success('Tailwind-класс скопирован в буфер обмена')
	}

	// Keyboard shortcuts
	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='space-y-6 p-6'>
				{/* Пресеты — компактный ряд наверху */}
				<div className='flex flex-wrap items-center gap-2'>
					{filteredGradients.map((preset, index) => (
						<button
							key={index}
							onClick={() => applyPresetGradient(preset)}
							title={preset.name}
							aria-label={preset.name}
							className='h-10 w-10 cursor-pointer rounded-md border border-border/50 transition-all hover:scale-105 hover:border-primary'
							style={{
								background: generateGradientCSS({
									...DEFAULT_GRADIENT_SETTINGS,
									...preset.settings
								})
							}}
						/>
					))}
				</div>

				{/* Превью и готовый код */}
				<div className='space-y-4 border-t pt-6'>
					<div
						className='relative h-56 w-full overflow-hidden rounded-xl border'
						style={{ background: gradientCSS }}
					/>

					{/* Вывод как в grid-генераторе: CSS и Tailwind рядом,
					    у каждого своя иконка копирования */}
					<div className='grid gap-4 md:grid-cols-2'>
						<div>
							<div className='mb-2 flex items-center justify-between'>
								<Label className='text-sm text-muted-foreground'>CSS</Label>
								<Button
									size='sm'
									variant='ghost'
									onClick={copyCssCode}
									className='h-8 cursor-pointer px-2 hover:bg-accent hover:text-white'
									aria-label='Скопировать CSS'
								>
									{copiedCSS ? (
										<Check className='h-3 w-3 text-green-500' />
									) : (
										<Copy className='h-3 w-3' />
									)}
								</Button>
							</div>
							<div className='rounded-lg bg-secondary p-4'>
								<pre className='overflow-x-auto font-mono text-xs text-secondary-foreground'>
									background: {gradientCSS};
								</pre>
							</div>
						</div>

						<div>
							<div className='mb-2 flex items-center justify-between'>
								<Label className='text-sm text-muted-foreground'>
									Tailwind CSS
								</Label>
								<Button
									size='sm'
									variant='ghost'
									onClick={copyTailwindCode}
									className='h-8 cursor-pointer px-2 hover:bg-accent hover:text-white'
									aria-label='Скопировать Tailwind CSS'
								>
									{copiedTailwind ? (
										<Check className='h-3 w-3 text-green-500' />
									) : (
										<Copy className='h-3 w-3' />
									)}
								</Button>
							</div>
							<div className='rounded-lg bg-secondary p-4'>
								<span className='font-mono text-xs break-all text-secondary-foreground'>
									bg-[{gradientCSS.replace(/\s+/g, '_')}]
								</span>
							</div>
						</div>
					</div>

					<div className='flex flex-wrap items-center gap-2'>
						<Button
							onClick={generateRandom}
							variant='outline'
							size='sm'
							className='cursor-pointer gap-2'
						>
							<Sparkles className='h-4 w-4' />
							Случайный
						</Button>
						<Button
							onClick={resetGradient}
							variant='ghost'
							size='sm'
							className='cursor-pointer gap-2'
						>
							<RefreshCw className='h-4 w-4' />
							Сброс
						</Button>
					</div>
				</div>

				<div className='grid gap-8 border-t pt-6 lg:grid-cols-2'>
					{/* Настройки */}
					<div className='space-y-6'>
						<h3 className='font-semibold'>Настройки</h3>

						<div className='space-y-3'>
							<Label className='text-sm font-medium'>Тип градиента</Label>
							<div className='grid grid-cols-3 gap-2'>
								{(['linear', 'radial', 'conic'] as const).map(type => (
									<Button
										key={type}
										onClick={() => updateGradientType(type)}
										variant={settings.type === type ? 'default' : 'outline'}
										size='sm'
										className='cursor-pointer capitalize'
									>
										{type}
									</Button>
								))}
							</div>
						</div>

						<div className='flex items-center justify-between rounded-lg bg-muted/50 p-3'>
							<Label htmlFor='repeating' className='text-sm'>
								Повторяющийся
							</Label>
							<Button
								id='repeating'
								onClick={toggleRepeating}
								variant={settings.repeating ? 'default' : 'outline'}
								size='sm'
								className='cursor-pointer'
							>
								{settings.repeating ? 'On' : 'Off'}
							</Button>
						</div>

						{settings.type === 'linear' && (
							<div className='space-y-4'>
								<WidgetInput label='Направление'>
									<div className='grid grid-cols-3 gap-2'>
										{(
											[
												'to top',
												'to right',
												'to bottom',
												'to left',
												'to top right',
												'to bottom right'
											] as const
										).map(dir => (
											<Button
												key={dir}
												onClick={() => updateLinearDirection(dir)}
												variant={
													settings.linearDirection === dir
														? 'default'
														: 'outline'
												}
												size='sm'
												className='cursor-pointer text-xs'
											>
												{dir}
											</Button>
										))}
									</div>
								</WidgetInput>

								<WidgetInput label={`Угол: ${settings.linearAngle}°`}>
									<Slider
										value={[settings.linearAngle]}
										onValueChange={([value]) => updateLinearAngle(value)}
										min={0}
										max={360}
										step={1}
									/>
								</WidgetInput>
							</div>
						)}

						{settings.type === 'radial' && (
							<div className='space-y-4'>
								<WidgetInput label='Форма'>
									<div className='grid grid-cols-2 gap-2'>
										{(['circle', 'ellipse'] as const).map(shape => (
											<Button
												key={shape}
												onClick={() => updateRadialShape(shape)}
												variant={
													settings.radialShape === shape ? 'default' : 'outline'
												}
												size='sm'
												className='cursor-pointer capitalize'
											>
												{shape}
											</Button>
										))}
									</div>
								</WidgetInput>

								<WidgetInput label='Размер'>
									<Select
										value={settings.radialSize}
										onValueChange={value => updateRadialSize(value as any)}
									>
										<SelectTrigger className='cursor-pointer'>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='closest-side'>Closest Side</SelectItem>
											<SelectItem value='closest-corner'>
												Closest Corner
											</SelectItem>
											<SelectItem value='farthest-side'>
												Farthest Side
											</SelectItem>
											<SelectItem value='farthest-corner'>
												Farthest Corner
											</SelectItem>
										</SelectContent>
									</Select>
								</WidgetInput>

								<div className='grid grid-cols-2 gap-4'>
									<WidgetInput label={`X: ${settings.radialPositionX}%`}>
										<Slider
											value={[settings.radialPositionX]}
											onValueChange={([value]) =>
												updateRadialPosition(value, settings.radialPositionY)
											}
											min={0}
											max={100}
											step={1}
										/>
									</WidgetInput>
									<WidgetInput label={`Y: ${settings.radialPositionY}%`}>
										<Slider
											value={[settings.radialPositionY]}
											onValueChange={([value]) =>
												updateRadialPosition(settings.radialPositionX, value)
											}
											min={0}
											max={100}
											step={1}
										/>
									</WidgetInput>
								</div>
							</div>
						)}

						{settings.type === 'conic' && (
							<div className='space-y-4'>
								<WidgetInput label={`Угол: ${settings.conicAngle}°`}>
									<Slider
										value={[settings.conicAngle]}
										onValueChange={([value]) => updateConicAngle(value)}
										min={0}
										max={360}
										step={1}
									/>
								</WidgetInput>

								<div className='grid grid-cols-2 gap-4'>
									<WidgetInput label={`X: ${settings.conicPositionX}%`}>
										<Slider
											value={[settings.conicPositionX]}
											onValueChange={([value]) =>
												updateConicPosition(value, settings.conicPositionY)
											}
											min={0}
											max={100}
											step={1}
										/>
									</WidgetInput>
									<WidgetInput label={`Y: ${settings.conicPositionY}%`}>
										<Slider
											value={[settings.conicPositionY]}
											onValueChange={([value]) =>
												updateConicPosition(settings.conicPositionX, value)
											}
											min={0}
											max={100}
											step={1}
										/>
									</WidgetInput>
								</div>
							</div>
						)}
					</div>

					{/* Цветовые точки */}
					<div className='space-y-4'>
						<h3 className='font-semibold'>Цветовые точки</h3>

						<div className='space-y-2'>
							{settings.colorStops.map(stop => (
								<div
									key={stop.id}
									onClick={() => setSelectedStopId(stop.id)}
									className={cn(
										'flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors',
										selectedStopId === stop.id
											? 'border-primary bg-primary/5'
											: 'border-border/50 hover:border-border'
									)}
								>
									<div
										className='h-9 w-9 rounded-md border'
										style={{
											backgroundColor: stop.color,
											opacity: stop.opacity / 100
										}}
									/>
									<div className='min-w-0 flex-1'>
										<div className='font-mono text-sm'>{stop.color}</div>
										<div className='text-xs text-muted-foreground'>
											{stop.position}% • {stop.opacity}% opacity
										</div>
									</div>
									{settings.colorStops.length > 2 && (
										<Button
											onClick={e => {
												e.stopPropagation()
												removeColorStop(stop.id)
											}}
											variant='ghost'
											size='sm'
											className='cursor-pointer hover:text-destructive'
											aria-label={`Удалить точку ${stop.color}`}
										>
											<Trash2 className='h-4 w-4' />
										</Button>
									)}
								</div>
							))}
						</div>

						<Button
							onClick={addColorStop}
							variant='outline'
							size='sm'
							className='w-full cursor-pointer gap-2'
						>
							<Plus className='h-4 w-4' />
							Добавить точку
						</Button>

						{selectedStop && (
							<div className='space-y-4 border-t pt-4'>
								<WidgetInput label='Цвет'>
									<div className='flex gap-2'>
										<Input
											type='color'
											value={selectedStop.color}
											onChange={e =>
												updateSelectedStop({ color: e.target.value })
											}
											className='h-10 w-14 cursor-pointer p-1'
										/>
										<Input
											type='text'
											value={selectedStop.color}
											onChange={e =>
												updateSelectedStop({ color: e.target.value })
											}
											className='font-mono'
										/>
									</div>
								</WidgetInput>

								<WidgetInput label={`Позиция: ${selectedStop.position}%`}>
									<Slider
										value={[selectedStop.position]}
										onValueChange={([value]) =>
											updateSelectedStop({ position: value })
										}
										min={0}
										max={100}
										step={1}
									/>
								</WidgetInput>

								<WidgetInput label={`Прозрачность: ${selectedStop.opacity}%`}>
									<Slider
										value={[selectedStop.opacity]}
										onValueChange={([value]) =>
											updateSelectedStop({ opacity: value })
										}
										min={0}
										max={100}
										step={1}
									/>
								</WidgetInput>
							</div>
						)}
					</div>
				</div>
			</Card>
			<GradientGuide />
		</WidgetSEOWrapper>
	)
}
