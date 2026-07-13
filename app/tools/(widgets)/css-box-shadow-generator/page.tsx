'use client'

import { useState, useCallback } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { ShadowGuide } from './ShadowGuide'
import { Copy, Check, RefreshCw, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type ShadowMode = 'box' | 'text'

interface Shadow {
	id: string
	offsetX: number
	offsetY: number
	blur: number
	spread: number
	color: string
	opacity: number
	inset: boolean
	enabled: boolean
}

interface PresetShadow {
	name: string
	category: string
	shadows: Omit<Shadow, 'id' | 'enabled'>[]
}

const PRESET_SHADOWS: PresetShadow[] = [
	{
		name: 'Простая тень',
		category: 'basic',
		shadows: [
			{
				offsetX: 0,
				offsetY: 4,
				blur: 6,
				spread: -1,
				color: '#000000',
				opacity: 10,
				inset: false
			}
		]
	},
	{
		name: 'Мягкая тень',
		category: 'basic',
		shadows: [
			{
				offsetX: 0,
				offsetY: 1,
				blur: 3,
				spread: 0,
				color: '#000000',
				opacity: 10,
				inset: false
			},
			{
				offsetX: 0,
				offsetY: 1,
				blur: 2,
				spread: 0,
				color: '#000000',
				opacity: 6,
				inset: false
			}
		]
	},
	{
		name: 'Материальная тень',
		category: 'material',
		shadows: [
			{
				offsetX: 0,
				offsetY: 2,
				blur: 4,
				spread: -1,
				color: '#000000',
				opacity: 20,
				inset: false
			},
			{
				offsetX: 0,
				offsetY: 4,
				blur: 5,
				spread: 0,
				color: '#000000',
				opacity: 14,
				inset: false
			},
			{
				offsetX: 0,
				offsetY: 1,
				blur: 10,
				spread: 0,
				color: '#000000',
				opacity: 12,
				inset: false
			}
		]
	},
	{
		name: 'Глубокая тень',
		category: 'material',
		shadows: [
			{
				offsetX: 0,
				offsetY: 10,
				blur: 15,
				spread: -3,
				color: '#000000',
				opacity: 30,
				inset: false
			},
			{
				offsetX: 0,
				offsetY: 4,
				blur: 6,
				spread: -2,
				color: '#000000',
				opacity: 15,
				inset: false
			}
		]
	},
	{
		name: 'Неоморфизм',
		category: 'neumorphism',
		shadows: [
			{
				offsetX: 20,
				offsetY: 20,
				blur: 60,
				spread: 0,
				color: '#bebebe',
				opacity: 100,
				inset: false
			},
			{
				offsetX: -20,
				offsetY: -20,
				blur: 60,
				spread: 0,
				color: '#ffffff',
				opacity: 100,
				inset: false
			}
		]
	},
	{
		name: 'Внутренняя тень',
		category: 'inset',
		shadows: [
			{
				offsetX: 0,
				offsetY: 2,
				blur: 4,
				spread: 0,
				color: '#000000',
				opacity: 6,
				inset: true
			}
		]
	},
	{
		name: 'Вдавленная кнопка',
		category: 'inset',
		shadows: [
			{
				offsetX: 0,
				offsetY: 4,
				blur: 6,
				spread: -1,
				color: '#000000',
				opacity: 10,
				inset: true
			},
			{
				offsetX: 0,
				offsetY: 2,
				blur: 4,
				spread: -1,
				color: '#000000',
				opacity: 6,
				inset: true
			}
		]
	},
	{
		name: 'Светящаяся тень',
		category: 'glow',
		shadows: [
			{
				offsetX: 0,
				offsetY: 0,
				blur: 20,
				spread: 3,
				color: '#3b82f6',
				opacity: 50,
				inset: false
			}
		]
	},
	{
		name: 'Неоновое свечение',
		category: 'glow',
		shadows: [
			{
				offsetX: 0,
				offsetY: 0,
				blur: 10,
				spread: 1,
				color: '#f43f5e',
				opacity: 80,
				inset: false
			},
			{
				offsetX: 0,
				offsetY: 0,
				blur: 20,
				spread: 5,
				color: '#f43f5e',
				opacity: 60,
				inset: false
			},
			{
				offsetX: 0,
				offsetY: 0,
				blur: 40,
				spread: 10,
				color: '#f43f5e',
				opacity: 40,
				inset: false
			}
		]
	}
]

// У text-shadow нет spread и inset — эти поля здесь всегда нейтральны.
const TEXT_PRESET_SHADOWS: PresetShadow[] = [
	{
		name: 'Мягкая тень',
		category: 'basic',
		shadows: [
			{
				offsetX: 1,
				offsetY: 2,
				blur: 4,
				spread: 0,
				color: '#000000',
				opacity: 30,
				inset: false
			}
		]
	},
	{
		name: 'Жёсткая тень',
		category: 'basic',
		shadows: [
			{
				offsetX: 3,
				offsetY: 3,
				blur: 0,
				spread: 0,
				color: '#000000',
				opacity: 100,
				inset: false
			}
		]
	},
	{
		name: 'Объёмный текст',
		category: 'volume',
		shadows: [
			{
				offsetX: 1,
				offsetY: 1,
				blur: 0,
				spread: 0,
				color: '#9ca3af',
				opacity: 100,
				inset: false
			},
			{
				offsetX: 2,
				offsetY: 2,
				blur: 0,
				spread: 0,
				color: '#6b7280',
				opacity: 100,
				inset: false
			},
			{
				offsetX: 3,
				offsetY: 4,
				blur: 5,
				spread: 0,
				color: '#000000',
				opacity: 40,
				inset: false
			}
		]
	},
	{
		name: 'Вдавленный текст',
		category: 'volume',
		shadows: [
			{
				offsetX: 0,
				offsetY: -1,
				blur: 0,
				spread: 0,
				color: '#000000',
				opacity: 40,
				inset: false
			},
			{
				offsetX: 0,
				offsetY: 1,
				blur: 0,
				spread: 0,
				color: '#ffffff',
				opacity: 70,
				inset: false
			}
		]
	},
	{
		name: 'Неоновый текст',
		category: 'glow',
		shadows: [
			{
				offsetX: 0,
				offsetY: 0,
				blur: 8,
				spread: 0,
				color: '#f43f5e',
				opacity: 90,
				inset: false
			},
			{
				offsetX: 0,
				offsetY: 0,
				blur: 20,
				spread: 0,
				color: '#f43f5e',
				opacity: 70,
				inset: false
			},
			{
				offsetX: 0,
				offsetY: 0,
				blur: 40,
				spread: 0,
				color: '#f43f5e',
				opacity: 40,
				inset: false
			}
		]
	},
	{
		name: 'Читаемость на фото',
		category: 'glow',
		shadows: [
			{
				offsetX: 0,
				offsetY: 1,
				blur: 3,
				spread: 0,
				color: '#000000',
				opacity: 80,
				inset: false
			},
			{
				offsetX: 0,
				offsetY: 0,
				blur: 12,
				spread: 0,
				color: '#000000',
				opacity: 60,
				inset: false
			}
		]
	}
]

export default function CSSBoxShadowGeneratorPage() {
	const widget = getWidgetById('css-box-shadow')!
	const [mode, setMode] = useState<ShadowMode>('box')
	const [previewText, setPreviewText] = useState('Тень текста')
	const [shadows, setShadows] = useState<Shadow[]>([
		{
			id: '1',
			offsetX: 0,
			offsetY: 4,
			blur: 6,
			spread: -1,
			color: '#000000',
			opacity: 10,
			inset: false,
			enabled: true
		}
	])
	const [selectedShadowId, setSelectedShadowId] = useState<string>('1')
	const [boxColor, setBoxColor] = useState('#ffffff')
	const [bgColor, setBgColor] = useState('#f3f4f6')
	const [borderRadius, setBorderRadius] = useState(8)
	const [boxSize, setBoxSize] = useState(200)
	const [fontSize, setFontSize] = useState(56)
	const [copiedCSS, setCopiedCSS] = useState(false)
	const [copiedTailwind, setCopiedTailwind] = useState(false)

	const selectedShadow = shadows.find(s => s.id === selectedShadowId)

	const generateCSS = useCallback((): string => {
		const enabledShadows = shadows.filter(s => s.enabled)
		if (enabledShadows.length === 0) return 'none'

		return enabledShadows
			.map(shadow => {
				const { offsetX, offsetY, blur, spread, color, opacity, inset } = shadow
				const rgba = hexToRgba(color, opacity / 100)
				// text-shadow не поддерживает ни spread, ни inset
				if (mode === 'text') {
					return `${offsetX}px ${offsetY}px ${blur}px ${rgba}`
				}
				const insetStr = inset ? 'inset ' : ''
				return `${insetStr}${offsetX}px ${offsetY}px ${blur}px ${spread}px ${rgba}`
			})
			.join(', ')
	}, [shadows, mode])

	const cssProperty = mode === 'text' ? 'text-shadow' : 'box-shadow'

	const hexToRgba = (hex: string, alpha: number): string => {
		const r = parseInt(hex.slice(1, 3), 16)
		const g = parseInt(hex.slice(3, 5), 16)
		const b = parseInt(hex.slice(5, 7), 16)
		return `rgba(${r}, ${g}, ${b}, ${alpha})`
	}

	const updateShadow = (id: string, updates: Partial<Shadow>) => {
		setShadows(prev =>
			prev.map(shadow =>
				shadow.id === id ? { ...shadow, ...updates } : shadow
			)
		)
	}

	const addShadow = useCallback(() => {
		const newId = Date.now().toString()
		const newShadow: Shadow = {
			id: newId,
			offsetX: 0,
			offsetY: 10,
			blur: 20,
			spread: 0,
			color: '#000000',
			opacity: 20,
			inset: false,
			enabled: true
		}
		setShadows(prev => [...prev, newShadow])
		setSelectedShadowId(newId)
		toast.success('Новая тень добавлена')
	}, [])

	const deleteShadow = (id: string) => {
		if (shadows.length === 1) {
			toast.error('Должна остаться хотя бы одна тень')
			return
		}

		setShadows(prev => prev.filter(s => s.id !== id))
		if (selectedShadowId === id) {
			setSelectedShadowId(shadows.find(s => s.id !== id)?.id || '')
		}
		toast.success('Тень удалена')
	}

	// Tailwind принимает произвольное значение, если пробелы заменить на _
	const tailwindClass =
		mode === 'text'
			? `[text-shadow:${generateCSS().replace(/\s+/g, '_')}]`
			: `shadow-[${generateCSS().replace(/\s+/g, '_')}]`

	const copyCSSCode = useCallback(() => {
		navigator.clipboard.writeText(`${cssProperty}: ${generateCSS()};`)
		setCopiedCSS(true)
		setTimeout(() => setCopiedCSS(false), 2000)
		toast.success('CSS скопирован')
	}, [generateCSS, cssProperty])

	const copyTailwindCode = useCallback(() => {
		navigator.clipboard.writeText(tailwindClass)
		setCopiedTailwind(true)
		setTimeout(() => setCopiedTailwind(false), 2000)
		toast.success('Tailwind-класс скопирован')
	}, [tailwindClass])

	const loadPreset = useCallback((preset: PresetShadow) => {
		const newShadows: Shadow[] = preset.shadows.map((shadow, index) => ({
			...shadow,
			id: Date.now().toString() + index,
			enabled: true
		}))
		setShadows(newShadows)
		setSelectedShadowId(newShadows[0].id)
		toast.success(`Загружен пресет: ${preset.name}`)
	}, [])

	const presets = mode === 'text' ? TEXT_PRESET_SHADOWS : PRESET_SHADOWS

	const switchMode = (next: ShadowMode) => {
		if (next === mode) return
		setMode(next)
		const preset = (next === 'text' ? TEXT_PRESET_SHADOWS : PRESET_SHADOWS)[0]
		loadPreset(preset)
	}

	const reset = useCallback(() => {
		setShadows([
			{
				id: '1',
				offsetX: 0,
				offsetY: 4,
				blur: 6,
				spread: -1,
				color: '#000000',
				opacity: 10,
				inset: false,
				enabled: true
			}
		])
		setSelectedShadowId('1')
		setBoxColor('#ffffff')
		setBgColor('#f3f4f6')
		setBorderRadius(8)
		setBoxSize(200)
		toast.success('Настройки сброшены')
	}, [])

	// Keyboard shortcuts
	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='space-y-8 p-6 sm:p-8'>
				{/* Режим и пресеты — горизонтальный ряд наверху */}
				<div className='space-y-4'>
					<div
						className='inline-flex rounded-lg border p-1'
						role='group'
						aria-label='Тип тени'
					>
						<Button
							variant={mode === 'box' ? 'default' : 'ghost'}
							size='sm'
							onClick={() => switchMode('box')}
							aria-pressed={mode === 'box'}
							className='cursor-pointer'
						>
							Тень блока — box-shadow
						</Button>
						<Button
							variant={mode === 'text' ? 'default' : 'ghost'}
							size='sm'
							onClick={() => switchMode('text')}
							aria-pressed={mode === 'text'}
							className='cursor-pointer'
						>
							Тень текста — text-shadow
						</Button>
					</div>

					{/* Пресеты: тени нужен воздух вокруг, иначе она обрезается рамкой */}
					<div className='flex flex-wrap gap-2'>
						{presets.map((preset, index) => {
							const css = preset.shadows
								.map(s => {
									const rgba = hexToRgba(s.color, s.opacity / 100)
									if (mode === 'text') {
										return `${s.offsetX}px ${s.offsetY}px ${s.blur}px ${rgba}`
									}
									const insetStr = s.inset ? 'inset ' : ''
									return `${insetStr}${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${rgba}`
								})
								.join(', ')

							return (
								<button
									key={index}
									onClick={() => loadPreset(preset)}
									className='flex cursor-pointer flex-col items-center gap-2 rounded-lg border bg-muted/30 px-4 py-3 transition-colors hover:border-primary'
								>
									<span className='flex h-12 w-16 items-center justify-center'>
										{mode === 'text' ? (
											<span
												className='text-lg font-bold'
												style={{ textShadow: css }}
											>
												Аа
											</span>
										) : (
											<span
												className='block h-8 w-12 rounded bg-background'
												style={{ boxShadow: css }}
											/>
										)}
									</span>
									<span className='text-xs whitespace-nowrap'>
										{preset.name}
									</span>
								</button>
							)
						})}
					</div>
				</div>

				<div className='grid gap-10 border-t pt-8 lg:grid-cols-2'>
					{/* Слева: слои и параметры */}
					<div className='space-y-6'>
						<div>
							<div className='mb-3 flex items-center justify-between'>
								<h3 className='text-sm font-semibold uppercase tracking-wide text-muted-foreground'>
									Слои теней
								</h3>
								<Button
									onClick={addShadow}
									size='sm'
									variant='outline'
									className='cursor-pointer'
								>
									<Plus className='mr-2 h-4 w-4' />
									Добавить
								</Button>
							</div>

							<div className='space-y-2'>
								{shadows.map((shadow, index) => (
									<div
										key={shadow.id}
										className={cn(
											'flex cursor-pointer items-center gap-2 rounded-lg border p-2 transition-colors',
											selectedShadowId === shadow.id
												? 'border-primary bg-primary/5'
												: 'hover:bg-muted/50'
										)}
										onClick={() => setSelectedShadowId(shadow.id)}
									>
										<Switch
											checked={shadow.enabled}
											onCheckedChange={checked =>
												updateShadow(shadow.id, { enabled: checked })
											}
											onClick={e => e.stopPropagation()}
											className='cursor-pointer'
											aria-label={`Слой ${index + 1}`}
										/>
										<div className='min-w-0 flex-1'>
											<div className='flex items-center gap-2'>
												<span className='text-sm font-medium'>
													Тень {index + 1}
												</span>
												{mode === 'box' && shadow.inset && (
													<Badge variant='secondary' className='text-xs'>
														inset
													</Badge>
												)}
											</div>
											<div className='font-mono text-xs text-muted-foreground'>
												{shadow.offsetX}/{shadow.offsetY}/{shadow.blur}
												{mode === 'box' ? `/${shadow.spread}` : ''}
											</div>
										</div>
										<div
											className='h-6 w-6 rounded border'
											style={{
												backgroundColor: hexToRgba(
													shadow.color,
													shadow.opacity / 100
												)
											}}
										/>
										<Button
											variant='ghost'
											size='icon'
											className='h-8 w-8 cursor-pointer'
											onClick={e => {
												e.stopPropagation()
												deleteShadow(shadow.id)
											}}
											aria-label={`Удалить тень ${index + 1}`}
										>
											<Trash2 className='h-4 w-4' />
										</Button>
									</div>
								))}
							</div>
						</div>

						{selectedShadow && (
							<div className='space-y-4 border-t pt-6'>
								<h3 className='text-sm font-semibold uppercase tracking-wide text-muted-foreground'>
									Настройки тени
								</h3>

								<div className='grid grid-cols-2 gap-4'>
									<div>
										<Label htmlFor='offset-x'>Смещение X</Label>
										<div className='mt-1 flex items-center gap-2'>
											<Slider
												id='offset-x'
												value={[selectedShadow.offsetX]}
												onValueChange={value =>
													updateShadow(selectedShadow.id, { offsetX: value[0] })
												}
												min={-50}
												max={50}
												step={1}
												className='flex-1'
											/>
											<span className='w-10 text-right text-sm'>
												{selectedShadow.offsetX}
											</span>
										</div>
									</div>

									<div>
										<Label htmlFor='offset-y'>Смещение Y</Label>
										<div className='mt-1 flex items-center gap-2'>
											<Slider
												id='offset-y'
												value={[selectedShadow.offsetY]}
												onValueChange={value =>
													updateShadow(selectedShadow.id, { offsetY: value[0] })
												}
												min={-50}
												max={50}
												step={1}
												className='flex-1'
											/>
											<span className='w-10 text-right text-sm'>
												{selectedShadow.offsetY}
											</span>
										</div>
									</div>

									<div>
										<Label htmlFor='blur'>Размытие</Label>
										<div className='mt-1 flex items-center gap-2'>
											<Slider
												id='blur'
												value={[selectedShadow.blur]}
												onValueChange={value =>
													updateShadow(selectedShadow.id, { blur: value[0] })
												}
												min={0}
												max={100}
												step={1}
												className='flex-1'
											/>
											<span className='w-10 text-right text-sm'>
												{selectedShadow.blur}
											</span>
										</div>
									</div>

									{mode === 'box' && (
										<div>
											<Label htmlFor='spread'>Растяжение</Label>
											<div className='mt-1 flex items-center gap-2'>
												<Slider
													id='spread'
													value={[selectedShadow.spread]}
													onValueChange={value =>
														updateShadow(selectedShadow.id, {
															spread: value[0]
														})
													}
													min={-50}
													max={50}
													step={1}
													className='flex-1'
												/>
												<span className='w-10 text-right text-sm'>
													{selectedShadow.spread}
												</span>
											</div>
										</div>
									)}

									<div>
										<Label htmlFor='color'>Цвет</Label>
										<div className='mt-1 flex gap-2'>
											<Input
												id='color'
												type='color'
												value={selectedShadow.color}
												onChange={e =>
													updateShadow(selectedShadow.id, {
														color: e.target.value
													})
												}
												className='h-10 w-14 cursor-pointer p-1'
											/>
											<Input
												type='text'
												value={selectedShadow.color}
												onChange={e =>
													updateShadow(selectedShadow.id, {
														color: e.target.value
													})
												}
												className='flex-1 font-mono'
											/>
										</div>
									</div>

									<div>
										<Label htmlFor='opacity'>Прозрачность</Label>
										<div className='mt-1 flex items-center gap-2'>
											<Slider
												id='opacity'
												value={[selectedShadow.opacity]}
												onValueChange={value =>
													updateShadow(selectedShadow.id, { opacity: value[0] })
												}
												min={0}
												max={100}
												step={1}
												className='flex-1'
											/>
											<span className='w-10 text-right text-sm'>
												{selectedShadow.opacity}%
											</span>
										</div>
									</div>
								</div>

								{mode === 'box' ? (
									<div className='flex items-center space-x-2'>
										<Switch
											id='inset'
											checked={selectedShadow.inset}
											onCheckedChange={checked =>
												updateShadow(selectedShadow.id, { inset: checked })
											}
											className='cursor-pointer'
										/>
										<Label htmlFor='inset' className='cursor-pointer'>
											Внутренняя тень (inset)
										</Label>
									</div>
								) : (
									<p className='text-xs text-muted-foreground'>
										У text-shadow нет растяжения (spread) и внутренней тени
										(inset) — только смещение, размытие и цвет.
									</p>
								)}
							</div>
						)}

						<div className='space-y-4 border-t pt-6'>
							<h3 className='text-sm font-semibold uppercase tracking-wide text-muted-foreground'>
								{mode === 'text' ? 'Настройки текста' : 'Настройки элемента'}
							</h3>

							{mode === 'text' && (
								<div>
									<Label htmlFor='preview-text'>Текст для примера</Label>
									<Input
										id='preview-text'
										type='text'
										value={previewText}
										onChange={e => setPreviewText(e.target.value)}
										className='mt-1'
									/>
								</div>
							)}

							<div className='grid grid-cols-2 gap-4'>
								<div>
									<Label htmlFor='box-color'>
										{mode === 'text' ? 'Цвет текста' : 'Цвет элемента'}
									</Label>
									<div className='mt-1 flex gap-2'>
										<Input
											id='box-color'
											type='color'
											value={boxColor}
											onChange={e => setBoxColor(e.target.value)}
											className='h-10 w-14 cursor-pointer p-1'
										/>
										<Input
											type='text'
											value={boxColor}
											onChange={e => setBoxColor(e.target.value)}
											className='flex-1 font-mono'
										/>
									</div>
								</div>

								<div>
									<Label htmlFor='bg-color'>Цвет фона</Label>
									<div className='mt-1 flex gap-2'>
										<Input
											id='bg-color'
											type='color'
											value={bgColor}
											onChange={e => setBgColor(e.target.value)}
											className='h-10 w-14 cursor-pointer p-1'
										/>
										<Input
											type='text'
											value={bgColor}
											onChange={e => setBgColor(e.target.value)}
											className='flex-1 font-mono'
										/>
									</div>
								</div>

								{mode === 'box' && (
									<div>
										<Label htmlFor='border-radius'>Скругление углов</Label>
										<div className='mt-1 flex items-center gap-2'>
											<Slider
												id='border-radius'
												value={[borderRadius]}
												onValueChange={value => setBorderRadius(value[0])}
												min={0}
												max={50}
												step={1}
												className='flex-1'
											/>
											<span className='w-12 text-right text-sm'>
												{borderRadius}px
											</span>
										</div>
									</div>
								)}

								<div>
									<Label htmlFor='box-size'>
										{mode === 'text' ? 'Размер шрифта' : 'Размер элемента'}
									</Label>
									<div className='mt-1 flex items-center gap-2'>
										<Slider
											id='box-size'
											value={[mode === 'text' ? fontSize : boxSize]}
											onValueChange={value =>
												mode === 'text'
													? setFontSize(value[0])
													: setBoxSize(value[0])
											}
											min={mode === 'text' ? 16 : 100}
											max={mode === 'text' ? 120 : 300}
											step={mode === 'text' ? 2 : 10}
											className='flex-1'
										/>
										<span className='w-12 text-right text-sm'>
											{mode === 'text' ? fontSize : boxSize}px
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Справа: превью и код */}
					<div className='space-y-4 lg:sticky lg:top-6 lg:self-start'>
						<div className='flex items-center justify-between'>
							<h3 className='text-sm font-semibold uppercase tracking-wide text-muted-foreground'>
								Предпросмотр
							</h3>
							<Button
								onClick={reset}
								variant='ghost'
								size='sm'
								className='cursor-pointer'
							>
								<RefreshCw className='mr-2 h-4 w-4' />
								Сбросить
							</Button>
						</div>

						<div
							className='flex items-center justify-center overflow-hidden rounded-lg p-12 transition-colors'
							style={{ backgroundColor: bgColor }}
						>
							{mode === 'text' ? (
								<span
									className='text-center font-bold break-words transition-all'
									style={{
										color: boxColor,
										fontSize: `${fontSize}px`,
										lineHeight: 1.2,
										textShadow: generateCSS()
									}}
								>
									{previewText || 'Тень текста'}
								</span>
							) : (
								<div
									className='transition-all'
									style={{
										width: `${boxSize}px`,
										height: `${boxSize}px`,
										backgroundColor: boxColor,
										borderRadius: `${borderRadius}px`,
										boxShadow: generateCSS()
									}}
								/>
							)}
						</div>

						{/* Вывод как в grid: CSS и Tailwind рядом */}
						<div className='grid gap-4 md:grid-cols-2'>
							<div>
								<div className='mb-2 flex items-center justify-between'>
									<Label className='text-sm text-muted-foreground'>CSS</Label>
									<Button
										size='sm'
										variant='ghost'
										onClick={copyCSSCode}
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
									<pre className='overflow-x-auto font-mono text-xs break-all whitespace-pre-wrap text-secondary-foreground'>
										{cssProperty}: {generateCSS()};
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
										{tailwindClass}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Card>

			<ShadowGuide />
		</WidgetSEOWrapper>
	)
}
