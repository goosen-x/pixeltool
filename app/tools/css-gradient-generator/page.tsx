'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	Palette,
	Copy,
	RefreshCw,
	Plus,
	Trash2,
	Sparkles,
	Download,
	Sliders,
	RotateCw,
	Search,
	Layers,
	Settings2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCSSGradientGenerator } from '@/lib/hooks/widgets'
import {
	generateGradientCSS,
	DEFAULT_GRADIENT_SETTINGS
} from '@/lib/data/css-gradient-data'

import { WidgetLayout } from '@/components/widgets/WidgetLayout'
import { WidgetSection } from '@/components/widgets/WidgetSection'
import { WidgetInput } from '@/components/widgets/WidgetInput'
import { WidgetOutput } from '@/components/widgets/WidgetOutput'
import {
	useWidgetKeyboard,
	generatorShortcuts
} from '@/lib/hooks/useWidgetKeyboard'

// Force dynamic rendering to avoid build-time errors
export const dynamic = 'force-dynamic'

export default function CSSGradientGeneratorPage() {

	const {
		settings,
		selectedStopId,
		selectedStop,
		activeCategory,
		searchQuery,
		exportFormat,
		gradientCSS,
		categories,
		filteredGradients,
		setSelectedStopId,
		setActiveCategory,
		setSearchQuery,
		setExportFormat,
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
		copyCSS,
		exportGradient,
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

	// Keyboard shortcuts
	useWidgetKeyboard({
		widgetId: 'css-gradient-generator',
		shortcuts: [
			{
				key: 'g',
				primary: true,
				description: 'Generate random gradient',
				action: generateRandom
			},
			{
				key: 'r',
				primary: true,
				description: 'Reset gradient',
				action: resetGradient
			},
			{
				key: 'c',
				alt: true,
				description: 'Copy CSS',
				action: copyCSS
			},
			{
				key: 'e',
				primary: true,
				description: 'Export gradient',
				action: () => exportGradient('css')
			},
			{
				key: 'a',
				primary: true,
				description: 'Add color stop',
				action: addColorStop
			}
		]
	})

	return (
		<WidgetLayout>
			{/* Preview Section */}
			<WidgetSection
				icon={Palette}
				title='Предварительный просмотр'
				className='w-full'
			>
				<div className='space-y-4'>
					{/* Gradient Preview */}
					<div
						className='w-full h-64 rounded-2xl border-2 border-border/50 shadow-inner relative overflow-hidden'
						style={{ background: gradientCSS }}
					>
						<div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2220%22%20height=%2220%22%20viewBox=%220%200%2020%2020%22%3E%3Cg%20fill=%22%239C92AC%22%20fill-opacity=%220.1%22%3E%3Cpolygon%20points=%220,0%2010,10%200,20%22/%3E%3Cpolygon%20points=%2210,0%2020,0%2020,10%22/%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
					</div>

					{/* CSS Output */}
					<WidgetOutput>
						<code className='block text-sm font-mono'>
							background: {gradientCSS};
						</code>
					</WidgetOutput>

					<div className='flex items-center gap-2 mt-4'>
						<Select
							value={exportFormat}
							onValueChange={value =>
								setExportFormat(value as 'css' | 'scss' | 'tailwind')
							}
						>
							<SelectTrigger className='w-32'>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='css'>CSS</SelectItem>
								<SelectItem value='scss'>SCSS</SelectItem>
								<SelectItem value='tailwind'>Tailwind</SelectItem>
							</SelectContent>
						</Select>
						<Button onClick={copyCSS} className='gap-2'>
							<Copy className='w-4 h-4' />
							Копировать
						</Button>
						<Button
							onClick={generateRandom}
							variant='outline'
							className='gap-2'
						>
							<Sparkles className='w-4 h-4' />
							Случайный
						</Button>
						<Button onClick={resetGradient} variant='outline' className='gap-2'>
							<RefreshCw className='w-4 h-4' />
							Сброс
						</Button>
					</div>
				</div>
			</WidgetSection>

			<div className='grid gap-6 lg:grid-cols-2 mt-6'>
				{/* Controls Section */}
				<WidgetSection icon={Sliders} title='Настройки'>
					<div className='space-y-6'>
						{/* Gradient Type */}
						<div className='space-y-3'>
							<Label className='text-sm font-medium'>Тип градиента</Label>
							<div className='grid grid-cols-3 gap-2'>
								{(['linear', 'radial', 'conic'] as const).map(type => (
									<Button
										key={type}
										onClick={() => updateGradientType(type)}
										variant={settings.type === type ? 'default' : 'outline'}
										size='sm'
										className={cn(
											'capitalize',
											settings.type === type &&
												'bg-gradient-to-r from-primary to-accent text-white'
										)}
									>
										{type}
									</Button>
								))}
							</div>

							{/* Repeating Toggle */}
							<div className='flex items-center justify-between p-3 rounded-xl bg-muted/50'>
								<Label htmlFor='repeating' className='text-sm'>
									Повторяющийся
								</Label>
								<Button
									id='repeating'
									onClick={toggleRepeating}
									variant={settings.repeating ? 'default' : 'outline'}
									size='sm'
									className={cn(
										settings.repeating &&
											'bg-gradient-to-r from-primary to-accent text-white'
									)}
								>
									{settings.repeating ? 'On' : 'Off'}
								</Button>
							</div>
						</div>

						{/* Type-specific Controls */}
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
												className={cn(
													'text-xs',
													settings.linearDirection === dir &&
														'bg-gradient-to-r from-primary to-accent text-white'
												)}
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
												className={cn(
													'capitalize',
													settings.radialShape === shape &&
														'bg-gradient-to-r from-primary to-accent text-white'
												)}
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
										<SelectTrigger>
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
				</WidgetSection>

				{/* Color Stops Section */}
				<WidgetSection icon={Layers} title='Цветовые точки'>
					<div className='space-y-4'>
						{/* Color Stop List */}
						<div className='space-y-2'>
							{settings.colorStops.map((stop, index) => (
								<div
									key={stop.id}
									onClick={() => setSelectedStopId(stop.id)}
									className={cn(
										'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all',
										selectedStopId === stop.id
											? 'border-primary bg-gradient-to-r from-primary/5 to-accent/5'
											: 'border-border/50 hover:border-border'
									)}
								>
									<div
										className='w-10 h-10 rounded-lg border shadow-inner'
										style={{
											backgroundColor: stop.color,
											opacity: stop.opacity / 100
										}}
									/>
									<div className='flex-1'>
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
											className='hover:text-destructive'
										>
											<Trash2 className='w-4 h-4' />
										</Button>
									)}
								</div>
							))}
						</div>

						<Button onClick={addColorStop} className='w-full gap-2'>
							<Plus className='w-4 h-4' />
							Добавить точку
						</Button>

						{/* Selected Color Stop Editor */}
						{selectedStop && (
							<div className='space-y-4 pt-4 border-t'>
								<WidgetInput label='Цвет'>
									<div className='flex gap-2'>
										<Input
											type='color'
											value={selectedStop.color}
											onChange={e =>
												updateSelectedStop({ color: e.target.value })
											}
											className='w-20 h-10 p-1 cursor-pointer'
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
				</WidgetSection>
			</div>

			{/* Presets Section */}
			<WidgetSection icon={Sparkles} title='Готовые градиенты' className='mt-6'>
				<div className='space-y-4'>
					{/* Search and Categories */}
					<div className='flex flex-col sm:flex-row gap-4'>
						<div className='relative flex-1'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
							<Input
								value={searchQuery}
								onChange={e => setSearchQuery(e.target.value)}
								placeholder='Поиск градиентов...'
								className='pl-10'
							/>
						</div>
						<Select value={activeCategory} onValueChange={setActiveCategory}>
							<SelectTrigger className='w-full sm:w-48'>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>Все категории</SelectItem>
								{categories.map(category => (
									<SelectItem
										key={category}
										value={category}
										className='capitalize'
									>
										{category}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Preset Grid */}
					<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
						{filteredGradients.map((preset, index) => (
							<button
								key={index}
								onClick={() => applyPresetGradient(preset)}
								className='group relative h-20 rounded-xl overflow-hidden border-2 border-border/50 hover:border-primary transition-all hover:scale-105'
								style={{
									background: generateGradientCSS({
										...DEFAULT_GRADIENT_SETTINGS,
										...preset.settings
									})
								}}
							>
								<div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors' />
								<div className='absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity'>
									<span className='text-xs text-white font-medium truncate block'>
										{preset.name}
									</span>
								</div>
							</button>
						))}
					</div>
				</div>
			</WidgetSection>
		</WidgetLayout>
	)
}
