'use client'

import { useState, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { ShadowGuide } from './ShadowGuide'
import { Copy, Check, RotateCcw, Plus, Trash2, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'

type ShadowMode = 'box' | 'text'

/** Цвет тени задают пипеткой в hex, а прозрачность — отдельным ползунком. */
const hexToRgba = (hex: string, alpha: number): string => {
	const r = parseInt(hex.slice(1, 3), 16)
	const g = parseInt(hex.slice(3, 5), 16)
	const b = parseInt(hex.slice(5, 7), 16)
	return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

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

	const updateShadow = (id: string, updates: Partial<Shadow>) => {
		setShadows(prev =>
			prev.map(shadow =>
				shadow.id === id ? { ...shadow, ...updates } : shadow
			)
		)
	}

	const addShadow = useCallback(() => {
		const newId = Date.now().toString()
		setShadows(prev => [
			...prev,
			{
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
		])
		setSelectedShadowId(newId)
	}, [])

	const deleteShadow = (id: string) => {
		// Кнопка удаления заблокирована на последнем слое, но проверка нужна и
		// здесь: без слоёв инструменту нечего показывать.
		if (shadows.length === 1) return

		setShadows(prev => prev.filter(s => s.id !== id))
		if (selectedShadowId === id) {
			setSelectedShadowId(shadows.find(s => s.id !== id)?.id || '')
		}
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
	}, [generateCSS, cssProperty])

	const copyTailwindCode = useCallback(() => {
		navigator.clipboard.writeText(tailwindClass)
		setCopiedTailwind(true)
		setTimeout(() => setCopiedTailwind(false), 2000)
	}, [tailwindClass])

	const loadPreset = useCallback((preset: PresetShadow) => {
		const newShadows: Shadow[] = preset.shadows.map((shadow, index) => ({
			...shadow,
			id: Date.now().toString() + index,
			enabled: true
		}))
		setShadows(newShadows)
		setSelectedShadowId(newShadows[0].id)
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
	}, [])

	/** Ползунок с подписью в полосе параметров — единый вид на все свойства. */
	const sliderControl = (
		label: string,
		value: number,
		onChange: (value: number) => void,
		options: { min: number; max: number; step?: number; suffix?: string }
	) => (
		<label className='flex items-center gap-2 text-sm text-muted-foreground'>
			<span className='font-mono text-xs'>{label}</span>
			<Slider
				value={[value]}
				onValueChange={([next]) => onChange(next)}
				min={options.min}
				max={options.max}
				step={options.step ?? 1}
				className='w-20 cursor-pointer'
				aria-label={label}
			/>
			<span className='w-10 font-mono text-sm text-foreground tabular-nums'>
				{value}
				{options.suffix ?? ''}
			</span>
		</label>
	)

	/** Пара «пипетка + hex» — цвет задают то кликом, то вставкой из макета. */
	const colorControl = (
		label: string,
		value: string,
		onChange: (value: string) => void
	) => (
		<label className='flex items-center gap-2 text-sm text-muted-foreground'>
			<span className='font-mono text-xs'>{label}</span>
			<input
				type='color'
				value={value}
				onChange={event => onChange(event.target.value)}
				aria-label={label}
				className='h-7 w-9 cursor-pointer rounded-md border bg-background p-0.5'
			/>
			<input
				value={value}
				onChange={event => onChange(event.target.value)}
				spellCheck={false}
				className='w-24 rounded-md border bg-background px-2 py-1 font-mono text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
			/>
		</label>
	)

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: box-shadow и text-shadow — это разные свойства с
				    разным набором параметров, поэтому переключатель здесь главный. */}
				<div className={toolBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						{(
							[
								['box', 'box-shadow'],
								['text', 'text-shadow']
							] as [ShadowMode, string][]
						).map(([value, label]) => (
							<button
								key={value}
								type='button'
								onClick={() => switchMode(value)}
								aria-pressed={mode === value}
								className={toolPill(mode === value, 'font-mono')}
							>
								{label}
							</button>
						))}
					</div>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={reset}
							title='Сбросить настройки'
							className={toolIconButton}
						>
							<RotateCcw className='h-4 w-4' />
						</Button>
					</div>
				</div>

				<div
					className='flex items-center justify-center px-5 py-12 transition-colors sm:px-6'
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

				{/* Полоса слоёв. Тень почти никогда не бывает одна: реальные тени
				    складывают из 2–3 слоёв, поэтому список слоёв — первое, что под
				    предпросмотром. */}
				<div className={toolFooterBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						<span className='mr-1 text-sm text-muted-foreground'>Слои</span>
						{shadows.map((shadow, index) => (
							<button
								key={shadow.id}
								type='button'
								onClick={() => setSelectedShadowId(shadow.id)}
								aria-pressed={selectedShadowId === shadow.id}
								title={`Тень ${index + 1}${shadow.enabled ? '' : ' (выключена)'}`}
								className={toolPill(
									selectedShadowId === shadow.id,
									cn('flex items-center gap-2', !shadow.enabled && 'opacity-50')
								)}
							>
								<span
									className='h-3 w-3 rounded-full border'
									style={{
										backgroundColor: hexToRgba(
											shadow.color,
											shadow.opacity / 100
										)
									}}
								/>
								{index + 1}
								{mode === 'box' && shadow.inset && (
									<span className='font-mono text-xs'>inset</span>
								)}
							</button>
						))}
						<Button
							size='icon'
							variant='ghost'
							onClick={addShadow}
							title='Добавить слой'
							className={cn(toolIconButton, 'h-7 w-7')}
						>
							<Plus className='h-3.5 w-3.5' />
						</Button>
					</div>

					{selectedShadow && (
						<div className='flex items-center gap-0.5 sm:ml-auto'>
							<Button
								size='icon'
								variant='ghost'
								onClick={() =>
									updateShadow(selectedShadow.id, {
										enabled: !selectedShadow.enabled
									})
								}
								title={
									selectedShadow.enabled ? 'Выключить слой' : 'Включить слой'
								}
								className={toolIconButton}
							>
								{selectedShadow.enabled ? (
									<Eye className='h-4 w-4' />
								) : (
									<EyeOff className='h-4 w-4' />
								)}
							</Button>
							<Button
								size='icon'
								variant='ghost'
								onClick={() => deleteShadow(selectedShadow.id)}
								disabled={shadows.length === 1}
								title={
									shadows.length === 1
										? 'Последний слой удалить нельзя'
										: 'Удалить слой'
								}
								className={toolIconButton}
							>
								<Trash2 className='h-4 w-4' />
							</Button>
						</div>
					)}
				</div>

				{/* Полоса параметров выбранного слоя. */}
				{selectedShadow && (
					<div className={toolFooterBar}>
						{sliderControl(
							'offset-x',
							selectedShadow.offsetX,
							value => updateShadow(selectedShadow.id, { offsetX: value }),
							{ min: -50, max: 50 }
						)}
						{sliderControl(
							'offset-y',
							selectedShadow.offsetY,
							value => updateShadow(selectedShadow.id, { offsetY: value }),
							{ min: -50, max: 50 }
						)}
						{sliderControl(
							'blur',
							selectedShadow.blur,
							value => updateShadow(selectedShadow.id, { blur: value }),
							{ min: 0, max: 100 }
						)}
						{/* У text-shadow нет ни растяжения, ни внутренней тени —
						    показывать выключённые поля нечестнее, чем не показывать. */}
						{mode === 'box' &&
							sliderControl(
								'spread',
								selectedShadow.spread,
								value => updateShadow(selectedShadow.id, { spread: value }),
								{ min: -50, max: 50 }
							)}
						{sliderControl(
							'alpha',
							selectedShadow.opacity,
							value => updateShadow(selectedShadow.id, { opacity: value }),
							{ min: 0, max: 100, suffix: '%' }
						)}
						{colorControl('color', selectedShadow.color, value =>
							updateShadow(selectedShadow.id, { color: value })
						)}
						{mode === 'box' && (
							<button
								type='button'
								onClick={() =>
									updateShadow(selectedShadow.id, {
										inset: !selectedShadow.inset
									})
								}
								aria-pressed={selectedShadow.inset}
								title='Тень внутри элемента'
								className={toolPill(selectedShadow.inset, 'font-mono')}
							>
								inset
							</button>
						)}
					</div>
				)}

				{/* Полоса самой сцены: цвета, размер, скругление. К результату
				    отношения не имеет — это то, на чём тень смотрят. */}
				<div className={toolFooterBar}>
					{colorControl(
						mode === 'text' ? 'color' : 'background',
						boxColor,
						setBoxColor
					)}
					{colorControl('фон', bgColor, setBgColor)}
					{mode === 'box' &&
						sliderControl('radius', borderRadius, setBorderRadius, {
							min: 0,
							max: 50,
							suffix: 'px'
						})}
					{mode === 'box'
						? sliderControl('size', boxSize, setBoxSize, {
								min: 100,
								max: 300,
								step: 10,
								suffix: 'px'
							})
						: sliderControl('font-size', fontSize, setFontSize, {
								min: 16,
								max: 120,
								step: 2,
								suffix: 'px'
							})}
					{mode === 'text' && (
						<label className='flex items-center gap-2 text-sm text-muted-foreground'>
							<span className='text-xs'>Текст</span>
							<input
								value={previewText}
								onChange={event => setPreviewText(event.target.value)}
								className='w-40 rounded-md border bg-background px-2 py-1 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
							/>
						</label>
					)}
				</div>

				<div className='grid border-t md:grid-cols-2'>
					{[
						{
							title: 'CSS',
							value: `${cssProperty}: ${generateCSS()};`,
							copied: copiedCSS,
							onCopy: copyCSSCode
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

			{/* Готовые тени — тихая полка под инструментом. Названия вроде
			    «неоморфизм» ничего не говорят без картинки, поэтому пресеты
			    показаны как есть, а не списком в выпадающем меню. */}
			<div className='mt-6'>
				<p className='px-1 text-sm text-muted-foreground'>
					Готовые тени — кликните, чтобы загрузить в конструктор
				</p>
				<div className='mt-2 flex flex-wrap gap-4'>
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
								type='button'
								onClick={() => loadPreset(preset)}
								className='group flex cursor-pointer flex-col items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
							>
								{/* Рамка снята: тень сама рисует границу плитки,
								    рамка вокруг неё только зашумляла ряд */}
								<span className='flex h-20 w-24 items-center justify-center rounded-xl bg-muted/40 transition-colors group-hover:bg-muted'>
									{mode === 'text' ? (
										<span
											className='text-xl font-bold'
											style={{ textShadow: css }}
										>
											Аа
										</span>
									) : (
										<span
											className='block h-10 w-14 rounded-md bg-background'
											style={{ boxShadow: css }}
										/>
									)}
								</span>
								<span className='text-xs whitespace-nowrap text-muted-foreground transition-colors group-hover:text-foreground'>
									{preset.name}
								</span>
							</button>
						)
					})}
				</div>
			</div>

			<ShadowGuide />
		</WidgetSEOWrapper>
	)
}
