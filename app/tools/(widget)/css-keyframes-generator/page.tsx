'use client'

import { useState, useEffect, useMemo } from 'react'
import { AnimationGuide } from './AnimationGuide'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { ToolSelect } from '@/components/ui/tool-select'
import {
	Play,
	Pause,
	Copy,
	Check,
	RotateCcw,
	Plus,
	Trash2,
	Zap,
	Move,
	RotateCw,
	Eye,
	Activity,
	ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'

type AnimationType = 'transform' | 'opacity' | 'color' | 'position' | 'custom'
type EasingType =
	| 'linear'
	| 'ease'
	| 'ease-in'
	| 'ease-out'
	| 'ease-in-out'
	| 'cubic-bezier'

interface Keyframe {
	id: string
	percentage: number
	properties: { [key: string]: string }
}

interface AnimationPreset {
	name: string
	type: AnimationType
	icon: any
	keyframes: Keyframe[]
	duration: number
	easing: EasingType
	infinite: boolean
}

const ANIMATION_PRESETS: AnimationPreset[] = [
	{
		name: 'Fade In',
		type: 'opacity',
		icon: Eye,
		duration: 1,
		easing: 'ease',
		infinite: false,
		keyframes: [
			{ id: '1', percentage: 0, properties: { opacity: '0' } },
			{ id: '2', percentage: 100, properties: { opacity: '1' } }
		]
	},
	{
		name: 'Slide In',
		type: 'transform',
		icon: ArrowRight,
		duration: 0.5,
		easing: 'ease-out',
		infinite: false,
		keyframes: [
			{
				id: '1',
				percentage: 0,
				properties: { transform: 'translateX(-100%)' }
			},
			{ id: '2', percentage: 100, properties: { transform: 'translateX(0)' } }
		]
	},
	{
		name: 'Bounce',
		type: 'transform',
		icon: Activity,
		duration: 1,
		easing: 'ease',
		infinite: true,
		keyframes: [
			{ id: '1', percentage: 0, properties: { transform: 'translateY(0)' } },
			{
				id: '2',
				percentage: 50,
				properties: { transform: 'translateY(-30px)' }
			},
			{ id: '3', percentage: 100, properties: { transform: 'translateY(0)' } }
		]
	},
	{
		name: 'Rotate',
		type: 'transform',
		icon: RotateCw,
		duration: 2,
		easing: 'linear',
		infinite: true,
		keyframes: [
			{ id: '1', percentage: 0, properties: { transform: 'rotate(0deg)' } },
			{ id: '2', percentage: 100, properties: { transform: 'rotate(360deg)' } }
		]
	},
	{
		name: 'Pulse',
		type: 'transform',
		icon: Zap,
		duration: 1.5,
		easing: 'ease-in-out',
		infinite: true,
		keyframes: [
			{ id: '1', percentage: 0, properties: { transform: 'scale(1)' } },
			{ id: '2', percentage: 50, properties: { transform: 'scale(1.1)' } },
			{ id: '3', percentage: 100, properties: { transform: 'scale(1)' } }
		]
	},
	{
		name: 'Shake',
		type: 'transform',
		icon: Move,
		duration: 0.5,
		easing: 'ease',
		infinite: false,
		keyframes: [
			{ id: '1', percentage: 0, properties: { transform: 'translateX(0)' } },
			{
				id: '2',
				percentage: 25,
				properties: { transform: 'translateX(-10px)' }
			},
			{
				id: '3',
				percentage: 50,
				properties: { transform: 'translateX(10px)' }
			},
			{
				id: '4',
				percentage: 75,
				properties: { transform: 'translateX(-10px)' }
			},
			{ id: '5', percentage: 100, properties: { transform: 'translateX(0)' } }
		]
	},
	{
		name: 'Swing',
		type: 'transform',
		icon: Activity,
		duration: 1,
		easing: 'ease-in-out',
		infinite: false,
		keyframes: [
			{ id: '1', percentage: 0, properties: { transform: 'rotate(0deg)' } },
			{ id: '2', percentage: 20, properties: { transform: 'rotate(15deg)' } },
			{ id: '3', percentage: 40, properties: { transform: 'rotate(-10deg)' } },
			{ id: '4', percentage: 60, properties: { transform: 'rotate(5deg)' } },
			{ id: '5', percentage: 80, properties: { transform: 'rotate(-5deg)' } },
			{ id: '6', percentage: 100, properties: { transform: 'rotate(0deg)' } }
		]
	}
]

const EASING_FUNCTIONS = [
	{ value: 'linear', label: 'Linear' },
	{ value: 'ease', label: 'Ease' },
	{ value: 'ease-in', label: 'Ease In' },
	{ value: 'ease-out', label: 'Ease Out' },
	{ value: 'ease-in-out', label: 'Ease In Out' },
	{ value: 'cubic-bezier', label: 'Cubic Bezier' }
]

const CSS_PROPERTIES = [
	{ category: 'Transform', properties: ['transform', 'transform-origin'] },
	{ category: 'Position', properties: ['top', 'right', 'bottom', 'left'] },
	{
		category: 'Size',
		properties: ['width', 'height', 'max-width', 'max-height']
	},
	{ category: 'Spacing', properties: ['margin', 'padding'] },
	{
		category: 'Colors',
		properties: ['color', 'background-color', 'border-color']
	},
	{
		category: 'Effects',
		properties: ['opacity', 'filter', 'box-shadow', 'text-shadow']
	},
	{ category: 'Border', properties: ['border-width', 'border-radius'] }
]

const DIRECTIONS = [
	'normal',
	'reverse',
	'alternate',
	'alternate-reverse'
] as const

const FILL_MODES = ['none', 'forwards', 'backwards', 'both'] as const

export default function CSSKeyframesGeneratorPage() {
	const [animationName, setAnimationName] = useState('myAnimation')
	const [duration, setDuration] = useState(1)
	const [easing, setEasing] = useState<EasingType>('ease')
	const [cubicBezier, setCubicBezier] = useState('0.25, 0.1, 0.25, 1')
	const [delay, setDelay] = useState(0)
	const [iterationCount, setIterationCount] = useState('1')
	const [infinite, setInfinite] = useState(false)
	const [direction, setDirection] = useState('normal')
	const [fillMode, setFillMode] = useState('none')
	const [keyframes, setKeyframes] = useState<Keyframe[]>([
		{ id: '1', percentage: 0, properties: { transform: 'scale(1)' } },
		{ id: '2', percentage: 50, properties: { transform: 'scale(1.2)' } },
		{ id: '3', percentage: 100, properties: { transform: 'scale(1)' } }
	])
	const [selectedKeyframeId, setSelectedKeyframeId] = useState('1')
	const [isPlaying, setIsPlaying] = useState(true)
	const [playCount, setPlayCount] = useState(0)
	const [selectedProperty, setSelectedProperty] = useState('transform')
	const [propertyValue, setPropertyValue] = useState('')
	const [copied, setCopied] = useState(false)

	const selectedKeyframe =
		keyframes.find(kf => kf.id === selectedKeyframeId) ?? keyframes[0]

	useEffect(() => {
		if (infinite) {
			setIterationCount('infinite')
		} else if (iterationCount === 'infinite') {
			setIterationCount('1')
		}
	}, [infinite, iterationCount])

	const addKeyframe = () => {
		const newKeyframe: Keyframe = {
			id: Date.now().toString(),
			percentage: 50,
			properties: {}
		}
		setKeyframes(
			[...keyframes, newKeyframe].sort((a, b) => a.percentage - b.percentage)
		)
		setSelectedKeyframeId(newKeyframe.id)
	}

	const updateKeyframe = (
		id: string,
		field: 'percentage' | 'properties',
		value: any
	) => {
		setKeyframes(
			keyframes
				.map(kf => {
					if (kf.id === id) {
						if (field === 'percentage') {
							return { ...kf, percentage: value }
						} else {
							return { ...kf, properties: value }
						}
					}
					return kf
				})
				.sort((a, b) => a.percentage - b.percentage)
		)
	}

	const deleteKeyframe = (id: string) => {
		// Меньше двух кадров анимации не бывает: кнопка заблокирована, но и
		// здесь на всякий случай.
		if (keyframes.length <= 2) return

		const rest = keyframes.filter(kf => kf.id !== id)
		setKeyframes(rest)
		if (selectedKeyframeId === id) setSelectedKeyframeId(rest[0].id)
	}

	const addPropertyToKeyframe = (
		keyframeId: string,
		property: string,
		value: string
	) => {
		const keyframe = keyframes.find(kf => kf.id === keyframeId)
		if (keyframe) {
			const updatedProperties = { ...keyframe.properties, [property]: value }
			updateKeyframe(keyframeId, 'properties', updatedProperties)
		}
	}

	const removePropertyFromKeyframe = (keyframeId: string, property: string) => {
		const keyframe = keyframes.find(kf => kf.id === keyframeId)
		if (keyframe) {
			const updatedProperties = { ...keyframe.properties }
			delete updatedProperties[property]
			updateKeyframe(keyframeId, 'properties', updatedProperties)
		}
	}

	const loadPreset = (preset: AnimationPreset) => {
		setAnimationName(preset.name.toLowerCase().replace(/\s+/g, '-'))
		setDuration(preset.duration)
		setEasing(preset.easing)
		setInfinite(preset.infinite)
		const loaded = preset.keyframes.map(kf => ({
			...kf,
			id: Date.now().toString() + kf.id
		}))
		setKeyframes(loaded)
		setSelectedKeyframeId(loaded[0].id)
		setPlayCount(count => count + 1)
		setIsPlaying(true)
	}

	const generateCSS = (): string => {
		const easingValue =
			easing === 'cubic-bezier' ? `cubic-bezier(${cubicBezier})` : easing

		let css = `@keyframes ${safeAnimationName} {\n`

		keyframes.forEach(keyframe => {
			css += `  ${keyframe.percentage}% {\n`
			Object.entries(keyframe.properties).forEach(([prop, value]) => {
				css += `    ${prop}: ${value};\n`
			})
			css += `  }\n`
		})

		css += `}\n\n`
		css += `.animated-element {\n`
		css += `  animation-name: ${safeAnimationName};\n`
		css += `  animation-duration: ${duration}s;\n`
		css += `  animation-timing-function: ${easingValue};\n`
		if (delay > 0) css += `  animation-delay: ${delay}s;\n`
		css += `  animation-iteration-count: ${iterationCount};\n`
		if (direction !== 'normal') css += `  animation-direction: ${direction};\n`
		if (fillMode !== 'none') css += `  animation-fill-mode: ${fillMode};\n`
		css += `}\n\n`
		css += `/* Сокращенная запись */\n`
		css += `.animated-element {\n`
		css += `  animation: ${safeAnimationName} ${duration}s ${easingValue}`
		if (delay > 0) css += ` ${delay}s`
		css += ` ${iterationCount}`
		if (direction !== 'normal') css += ` ${direction}`
		if (fillMode !== 'none') css += ` ${fillMode}`
		css += `;\n}`

		return css
	}

	const copyCSS = () => {
		navigator.clipboard.writeText(generateCSS())
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	// Имя анимации попадает в CSS-идентификатор: пустое или с пробелами оно
	// сделает правило невалидным, и предпросмотр молча перестанет работать.
	const safeAnimationName =
		animationName.trim().replace(/\s+/g, '-') || 'myAnimation'

	// Правило @keyframes нужно реально отдать браузеру — иначе animation-name
	// ссылается в пустоту и предпросмотр не двигается.
	const keyframesRule = useMemo(() => {
		const body = keyframes
			.map(kf => {
				const props = Object.entries(kf.properties)
					.map(([prop, value]) => `    ${prop}: ${value};`)
					.join('\n')
				return `  ${kf.percentage}% {\n${props}\n  }`
			})
			.join('\n')

		return `@keyframes ${safeAnimationName} {\n${body}\n}`
	}, [safeAnimationName, keyframes])

	const togglePlayPause = () => {
		// Перемонтируем демо-элемент, чтобы повторное нажатие проигрывало
		// анимацию заново, а не оставляло её в конечном кадре.
		if (!isPlaying) setPlayCount(c => c + 1)
		setIsPlaying(!isPlaying)
	}

	const reset = () => {
		setAnimationName('myAnimation')
		setDuration(1)
		setEasing('ease')
		setCubicBezier('0.25, 0.1, 0.25, 1')
		setDelay(0)
		setIterationCount('1')
		setInfinite(false)
		setDirection('normal')
		setFillMode('none')
		setKeyframes([
			{ id: '1', percentage: 0, properties: { transform: 'scale(1)' } },
			{ id: '2', percentage: 50, properties: { transform: 'scale(1.2)' } },
			{ id: '3', percentage: 100, properties: { transform: 'scale(1)' } }
		])
		setSelectedKeyframeId('1')
		setIsPlaying(true)
		setPlayCount(count => count + 1)
	}

	const getAnimationStyle = () => {
		if (!isPlaying) return {}

		const easingValue =
			easing === 'cubic-bezier' ? `cubic-bezier(${cubicBezier})` : easing

		return {
			animation: `${safeAnimationName} ${duration}s ${easingValue} ${delay}s ${iterationCount} ${direction} ${fillMode}`,
			...keyframes.reduce((acc, kf) => {
				if (kf.percentage === 0) {
					return { ...acc, ...kf.properties }
				}
				return acc
			}, {})
		}
	}

	/** Ползунок с подписью — общий вид на все полосы параметров. */
	const sliderControl = (
		label: string,
		value: number,
		onChange: (value: number) => void,
		options: { min: number; max: number; step: number; suffix: string }
	) => (
		<label className='flex items-center gap-2 text-sm text-muted-foreground'>
			<span className='font-mono text-xs'>{label}</span>
			<Slider
				value={[value]}
				onValueChange={([next]) => onChange(next)}
				min={options.min}
				max={options.max}
				step={options.step}
				className='w-24 cursor-pointer'
				aria-label={label}
			/>
			<span className='w-10 font-mono text-sm text-foreground tabular-nums'>
				{value}
				{options.suffix}
			</span>
		</label>
	)

	/** Выпадающий список в полосе — тот же вид, что в grid-генераторе. */
	const selectControl = (
		label: string,
		value: string,
		onChange: (value: string) => void,
		options: readonly string[]
	) => (
		<label className='flex items-center gap-2 text-sm text-muted-foreground'>
			<span className='font-mono text-xs'>{label}</span>
			<ToolSelect
				value={value}
				onChange={event => onChange(event.target.value)}
				className='font-mono'
			>
				{options.map(option => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</ToolSelect>
		</label>
	)

	return (
		<>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: имя анимации попадает в @keyframes, поэтому оно
				    здесь, а не в общей куче параметров. */}
				<div className={toolBar}>
					<label className='flex items-center gap-2 text-sm text-muted-foreground'>
						<span>Название</span>
						<input
							value={animationName}
							onChange={event => setAnimationName(event.target.value)}
							spellCheck={false}
							placeholder='myAnimation'
							className='w-44 rounded-md border bg-background px-2 py-1 font-mono text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						/>
					</label>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={togglePlayPause}
							title={isPlaying ? 'Пауза' : 'Проиграть'}
							className={toolIconButton}
						>
							{isPlaying ? (
								<Pause className='h-4 w-4' />
							) : (
								<Play className='h-4 w-4' />
							)}
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={reset}
							title='Сбросить генератор'
							className={toolIconButton}
						>
							<RotateCcw className='h-4 w-4' />
						</Button>
					</div>
				</div>

				<style>{keyframesRule}</style>
				<div className='flex h-56 items-center justify-center overflow-hidden px-5 sm:px-6'>
					<div
						key={playCount}
						className='flex h-24 w-24 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground'
						style={getAnimationStyle()}
					>
						DEMO
					</div>
				</div>

				{/* Полоса кадров: проценты — это и есть шкала анимации. */}
				<div className={toolFooterBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						<span className='mr-1 text-sm text-muted-foreground'>Кадры</span>
						{keyframes.map(keyframe => (
							<button
								key={keyframe.id}
								type='button'
								onClick={() => setSelectedKeyframeId(keyframe.id)}
								aria-pressed={selectedKeyframe?.id === keyframe.id}
								className={toolPill(
									selectedKeyframe?.id === keyframe.id,
									'font-mono'
								)}
							>
								{keyframe.percentage}%
							</button>
						))}
						<Button
							size='icon'
							variant='ghost'
							onClick={addKeyframe}
							title='Добавить кадр'
							className={cn(toolIconButton, 'h-7 w-7')}
						>
							<Plus className='h-3.5 w-3.5' />
						</Button>
					</div>

					{selectedKeyframe && (
						<>
							<label className='flex items-center gap-2 text-sm text-muted-foreground'>
								<span className='font-mono text-xs'>позиция</span>
								<input
									type='number'
									min={0}
									max={100}
									value={selectedKeyframe.percentage}
									onChange={event =>
										updateKeyframe(
											selectedKeyframe.id,
											'percentage',
											parseInt(event.target.value) || 0
										)
									}
									className='w-16 rounded-md border bg-background px-2 py-1 text-center font-mono text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
								/>
								<span className='font-mono text-xs'>%</span>
							</label>

							<div className='flex items-center gap-0.5 sm:ml-auto'>
								<Button
									size='icon'
									variant='ghost'
									onClick={() => deleteKeyframe(selectedKeyframe.id)}
									disabled={keyframes.length <= 2}
									title={
										keyframes.length <= 2
											? 'В анимации должно остаться минимум два кадра'
											: 'Удалить кадр'
									}
									className={toolIconButton}
								>
									<Trash2 className='h-4 w-4' />
								</Button>
							</div>
						</>
					)}
				</div>

				{/* Полоса свойств выбранного кадра. */}
				{selectedKeyframe && (
					<div className={toolFooterBar}>
						{Object.entries(selectedKeyframe.properties).map(
							([prop, value]) => (
								<label
									key={prop}
									className='flex items-center gap-2 text-sm text-muted-foreground'
								>
									<span className='font-mono text-xs'>{prop}</span>
									<input
										value={value}
										onChange={event =>
											addPropertyToKeyframe(
												selectedKeyframe.id,
												prop,
												event.target.value
											)
										}
										spellCheck={false}
										className='w-40 rounded-md border bg-background px-2 py-1 font-mono text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
									/>
									<Button
										size='icon'
										variant='ghost'
										onClick={() =>
											removePropertyFromKeyframe(selectedKeyframe.id, prop)
										}
										title={`Убрать ${prop}`}
										className={cn(toolIconButton, 'h-7 w-7')}
									>
										<Trash2 className='h-3.5 w-3.5' />
									</Button>
								</label>
							)
						)}

						<div className='flex items-center gap-2 sm:ml-auto'>
							<ToolSelect
								value={selectedProperty}
								onChange={event => setSelectedProperty(event.target.value)}
								aria-label='Свойство для добавления'
								className='font-mono'
							>
								{CSS_PROPERTIES.map(category => (
									<optgroup key={category.category} label={category.category}>
										{category.properties.map(prop => (
											<option key={prop} value={prop}>
												{prop}
											</option>
										))}
									</optgroup>
								))}
							</ToolSelect>
							<input
								value={propertyValue}
								onChange={event => setPropertyValue(event.target.value)}
								onKeyDown={event => {
									if (event.key === 'Enter' && propertyValue) {
										addPropertyToKeyframe(
											selectedKeyframe.id,
											selectedProperty,
											propertyValue
										)
										setPropertyValue('')
									}
								}}
								placeholder='значение'
								spellCheck={false}
								aria-label='Значение свойства'
								className='w-36 rounded-md border bg-background px-2 py-1 font-mono text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
							/>
							<Button
								size='icon'
								variant='ghost'
								onClick={() => {
									if (propertyValue) {
										addPropertyToKeyframe(
											selectedKeyframe.id,
											selectedProperty,
											propertyValue
										)
										setPropertyValue('')
									}
								}}
								title='Добавить свойство в кадр'
								className={cn(toolIconButton, 'h-7 w-7')}
							>
								<Plus className='h-3.5 w-3.5' />
							</Button>
						</div>
					</div>
				)}

				{/* Полоса тайминга: как долго, с какой плавностью и сколько раз. */}
				<div className={toolFooterBar}>
					{sliderControl('duration', duration, setDuration, {
						min: 0.1,
						max: 10,
						step: 0.1,
						suffix: 's'
					})}
					{sliderControl('delay', delay, setDelay, {
						min: 0,
						max: 5,
						step: 0.1,
						suffix: 's'
					})}
					{selectControl(
						'easing',
						easing,
						value => setEasing(value as EasingType),
						EASING_FUNCTIONS.map(func => func.value)
					)}
					{easing === 'cubic-bezier' && (
						<input
							value={cubicBezier}
							onChange={event => setCubicBezier(event.target.value)}
							placeholder='0.25, 0.1, 0.25, 1'
							spellCheck={false}
							aria-label='Значения cubic-bezier'
							className='w-40 rounded-md border bg-background px-2 py-1 font-mono text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						/>
					)}

					<label className='flex items-center gap-2 text-sm text-muted-foreground'>
						<span className='font-mono text-xs'>повторы</span>
						<input
							type='number'
							min={1}
							value={iterationCount === 'infinite' ? '' : iterationCount}
							onChange={event => setIterationCount(event.target.value)}
							disabled={infinite}
							className='w-16 rounded-md border bg-background px-2 py-1 text-center font-mono text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50'
						/>
					</label>
					<button
						type='button'
						onClick={() => setInfinite(!infinite)}
						aria-pressed={infinite}
						className={toolPill(infinite, 'font-mono')}
					>
						infinite
					</button>

					{selectControl('direction', direction, setDirection, DIRECTIONS)}
					{selectControl('fill-mode', fillMode, setFillMode, FILL_MODES)}
				</div>

				<div className='border-t'>
					<div className='flex items-center justify-between gap-2 px-5 pt-4 sm:px-6'>
						<span className='text-sm font-medium'>CSS</span>
						<Button
							size='icon'
							variant='ghost'
							onClick={copyCSS}
							title='Скопировать'
							className={toolIconButton}
						>
							{copied ? (
								<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
							) : (
								<Copy className='h-4 w-4' />
							)}
						</Button>
					</div>
					<pre className='overflow-x-auto px-5 pt-2 pb-5 font-mono text-xs leading-relaxed sm:px-6'>
						{generateCSS()}
					</pre>
				</div>
			</Card>

			{/* Готовые анимации — тихая полка под инструментом. */}
			<div className='mt-6'>
				<p className='px-1 text-sm text-muted-foreground'>
					Готовые анимации — кликните, чтобы загрузить в конструктор
				</p>
				<div className='mt-2 flex flex-wrap gap-1.5'>
					{ANIMATION_PRESETS.map((preset, index) => {
						const Icon = preset.icon
						return (
							<button
								key={index}
								type='button'
								onClick={() => loadPreset(preset)}
								className={toolPill(false, 'flex items-center gap-2')}
							>
								<Icon className='h-3.5 w-3.5' />
								{preset.name}
							</button>
						)
					})}
				</div>
			</div>

			<AnimationGuide />
		</>
	)
}
