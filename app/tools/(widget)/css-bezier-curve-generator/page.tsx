'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Copy, Check, Play, Pause, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import {
	createBezierEasing,
	generateCurvePoints,
	EASING_PRESETS,
	formatCubicBezier,
	getHandlePositions,
	updateCurveFromHandle,
	type BezierCurve
} from '@/lib/utils/bezier-easing'

/** Пять кривых, у которых в CSS есть собственные ключевые слова. */
const BASE_PRESETS = ['linear', 'ease', 'easeIn', 'easeOut', 'easeInOut']

export default function BezierCurvePage() {
	// State
	const [curve, setCurve] = useState<BezierCurve>({
		p1: { x: 0.25, y: 0.1 },
		p2: { x: 0.25, y: 1 }
	})
	const [duration, setDuration] = useState(1)
	const [isPlaying, setIsPlaying] = useState(false)
	const [progress, setProgress] = useState(0)
	const [selectedPreset, setSelectedPreset] = useState('ease')
	// Состояние, а не ref: от ref-а React не перерисовывается, и подсказка
	// «Редактирование P1/P2» появлялась не тогда, когда надо
	const [dragging, setDragging] = useState<'p1' | 'p2' | null>(null)
	const [copied, setCopied] = useState<'css' | 'tailwind' | null>(null)

	// Refs
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const animationRef = useRef<number | undefined>(undefined)
	const startTimeRef = useRef<number | undefined>(undefined)

	// Canvas size
	const canvasSize = { width: 400, height: 400 }
	const padding = 50
	const gridSize = canvasSize.width - padding * 2

	// Generate curve points for visualization
	const curvePoints = generateCurvePoints(curve)
	const easingFunction = createBezierEasing(
		curve.p1.x,
		curve.p1.y,
		curve.p2.x,
		curve.p2.y
	)

	// Copy to clipboard
	const copyToClipboard = (text: string, pane: 'css' | 'tailwind') => {
		navigator.clipboard.writeText(text)
		setCopied(pane)
		setTimeout(() => setCopied(null), 2000)
	}

	// Draw grid on canvas
	const drawGrid = useCallback(
		(ctx: CanvasRenderingContext2D) => {
			ctx.clearRect(0, 0, canvasSize.width, canvasSize.height)

			// Grid lines
			ctx.strokeStyle = '#e5e7eb'
			ctx.lineWidth = 1

			// Draw grid
			for (let i = 0; i <= 10; i++) {
				const x = padding + (gridSize / 10) * i
				const y = padding + (gridSize / 10) * i

				// Vertical lines
				ctx.beginPath()
				ctx.moveTo(x, padding)
				ctx.lineTo(x, padding + gridSize)
				ctx.stroke()

				// Horizontal lines
				ctx.beginPath()
				ctx.moveTo(padding, y)
				ctx.lineTo(padding + gridSize, y)
				ctx.stroke()
			}

			// Axes
			ctx.strokeStyle = '#9ca3af'
			ctx.lineWidth = 2

			// X axis
			ctx.beginPath()
			ctx.moveTo(padding, padding + gridSize)
			ctx.lineTo(padding + gridSize, padding + gridSize)
			ctx.stroke()

			// Y axis
			ctx.beginPath()
			ctx.moveTo(padding, padding)
			ctx.lineTo(padding, padding + gridSize)
			ctx.stroke()

			// Axis labels
			ctx.fillStyle = '#6b7280'
			ctx.font = '12px sans-serif'
			ctx.textAlign = 'center'
			ctx.fillText('0', padding, padding + gridSize + 20)
			ctx.fillText('1', padding + gridSize, padding + gridSize + 20)
			ctx.textAlign = 'right'
			ctx.fillText('1', padding - 10, padding + 5)
			ctx.fillText('0', padding - 10, padding + gridSize + 5)

			// Draw curve
			ctx.strokeStyle = '#8b5cf6'
			ctx.lineWidth = 3
			ctx.beginPath()

			curvePoints.forEach((point, index) => {
				const x = padding + point.x * gridSize
				const y = padding + (1 - point.y) * gridSize

				if (index === 0) {
					ctx.moveTo(x, y)
				} else {
					ctx.lineTo(x, y)
				}
			})

			ctx.stroke()

			// Draw control handles
			const handles = getHandlePositions(gridSize, gridSize, curve)

			// Control lines
			ctx.strokeStyle = '#d1d5db'
			ctx.lineWidth = 2
			ctx.setLineDash([5, 5])

			// Line from start to P1
			ctx.beginPath()
			ctx.moveTo(padding, padding + gridSize)
			ctx.lineTo(padding + handles.p1.x, padding + handles.p1.y)
			ctx.stroke()

			// Line from P2 to end
			ctx.beginPath()
			ctx.moveTo(padding + handles.p2.x, padding + handles.p2.y)
			ctx.lineTo(padding + gridSize, padding)
			ctx.stroke()

			ctx.setLineDash([])

			// Control points
			ctx.fillStyle = '#8b5cf6'
			ctx.strokeStyle = '#ffffff'
			ctx.lineWidth = 3

			// P1
			ctx.beginPath()
			ctx.arc(padding + handles.p1.x, padding + handles.p1.y, 8, 0, Math.PI * 2)
			ctx.fill()
			ctx.stroke()

			// P2
			ctx.beginPath()
			ctx.arc(padding + handles.p2.x, padding + handles.p2.y, 8, 0, Math.PI * 2)
			ctx.fill()
			ctx.stroke()

			// Progress indicator
			if (progress > 0 && progress < 1) {
				const progressY = easingFunction(progress)
				const x = padding + progress * gridSize
				const y = padding + (1 - progressY) * gridSize

				// Progress line
				ctx.strokeStyle = '#ef4444'
				ctx.lineWidth = 2
				ctx.setLineDash([2, 2])

				// Vertical line
				ctx.beginPath()
				ctx.moveTo(x, padding + gridSize)
				ctx.lineTo(x, y)
				ctx.stroke()

				// Horizontal line
				ctx.beginPath()
				ctx.moveTo(padding, y)
				ctx.lineTo(x, y)
				ctx.stroke()

				ctx.setLineDash([])

				// Progress dot
				ctx.fillStyle = '#ef4444'
				ctx.beginPath()
				ctx.arc(x, y, 6, 0, Math.PI * 2)
				ctx.fill()
			}
		},
		[
			curve,
			curvePoints,
			easingFunction,
			progress,
			gridSize,
			canvasSize.width,
			canvasSize.height
		]
	)

	// Draw canvas
	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		// Без учёта плотности пикселей кривая на Retina выглядела мылом
		const dpr = window.devicePixelRatio || 1
		canvas.width = canvasSize.width * dpr
		canvas.height = canvasSize.height * dpr
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

		drawGrid(ctx)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [drawGrid])

	// Animation loop
	const animate = useCallback(
		(timestamp: number) => {
			if (!startTimeRef.current) {
				startTimeRef.current = timestamp
			}

			const elapsed = timestamp - startTimeRef.current
			const newProgress = Math.min(elapsed / (duration * 1000), 1)

			setProgress(newProgress)

			if (newProgress < 1) {
				animationRef.current = requestAnimationFrame(animate)
			} else {
				setIsPlaying(false)
				setProgress(0)
				startTimeRef.current = undefined
			}
		},
		[duration]
	)

	// Play/pause animation
	const toggleAnimation = () => {
		if (isPlaying) {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current)
			}
			setIsPlaying(false)
			setProgress(0)
			startTimeRef.current = undefined
		} else {
			setIsPlaying(true)
			animationRef.current = requestAnimationFrame(animate)
		}
	}

	// Reset curve
	const resetCurve = () => {
		setCurve(EASING_PRESETS.ease)
		setSelectedPreset('ease')
		setProgress(0)
		setIsPlaying(false)
		if (animationRef.current) {
			cancelAnimationFrame(animationRef.current)
		}
	}

	// Курсор приходит в CSS-пикселях, а точки посчитаны в координатах битмапа
	// (400x400). Канвас растянут через w-full, поэтому без этого коэффициента
	// промах равен отношению размеров — точка не следует за курсором.
	const toCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current
		if (!canvas) return null

		const rect = canvas.getBoundingClientRect()
		const scaleX = canvasSize.width / rect.width
		const scaleY = canvasSize.height / rect.height

		return {
			x: (e.clientX - rect.left) * scaleX - padding,
			y: (e.clientY - rect.top) * scaleY - padding
		}
	}

	const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
		const point = toCanvasCoords(e)
		if (!point) return

		const handles = getHandlePositions(gridSize, gridSize, curve)
		const hit = (h: { x: number; y: number }) =>
			Math.hypot(point.x - h.x, point.y - h.y) < 20

		const target = hit(handles.p1) ? 'p1' : hit(handles.p2) ? 'p2' : null
		if (!target) return

		// Захват указателя: перетаскивание продолжается, даже если курсор
		// вышел за пределы канваса
		e.currentTarget.setPointerCapture(e.pointerId)
		setDragging(target)
	}

	const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
		if (!dragging) return

		const point = toCanvasCoords(e)
		if (!point) return

		setCurve(
			updateCurveFromHandle(
				dragging,
				point.x,
				point.y,
				gridSize,
				gridSize,
				curve
			)
		)
		setSelectedPreset('custom')
	}

	const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
		if (!dragging) return
		e.currentTarget.releasePointerCapture(e.pointerId)
		setDragging(null)
	}

	// Handle preset change
	const handlePresetChange = (preset: string) => {
		setSelectedPreset(preset)
		if (preset !== 'custom' && preset in EASING_PRESETS) {
			setCurve(EASING_PRESETS[preset as keyof typeof EASING_PRESETS])
		}
	}

	// Handle manual input changes
	const handleManualInput = (
		field: 'p1x' | 'p1y' | 'p2x' | 'p2y',
		value: string
	) => {
		const numValue = parseFloat(value)
		if (isNaN(numValue)) return

		const newCurve = { ...curve }

		switch (field) {
			case 'p1x':
				newCurve.p1.x = Math.max(0, Math.min(1, numValue))
				break
			case 'p1y':
				newCurve.p1.y = Math.max(-2, Math.min(2, numValue))
				break
			case 'p2x':
				newCurve.p2.x = Math.max(0, Math.min(1, numValue))
				break
			case 'p2y':
				newCurve.p2.y = Math.max(-2, Math.min(2, numValue))
				break
		}

		setCurve(newCurve)
		setSelectedPreset('custom')
	}

	// CSS output
	const cssOutput = formatCubicBezier(curve)
	const cssTransition = `transition: all ${duration}s ${cssOutput}`
	const tailwindClass = `transition-all duration-[${duration * 1000}ms] ease-[${cssOutput.replace(/\s+/g, '_')}]`

	return (
		<>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: пять кривых из спецификации CSS. Остальные три
				    десятка (easeInQuad, easeOutBack и компания) — на полке под
				    инструментом: списком в шесть строк они забивали всю шапку. */}
				<div className={toolBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						{BASE_PRESETS.map(key => (
							<button
								key={key}
								type='button'
								onClick={() => handlePresetChange(key)}
								aria-pressed={selectedPreset === key}
								className={toolPill(selectedPreset === key, 'font-mono')}
							>
								{EASING_PRESETS[key as keyof typeof EASING_PRESETS].name}
							</button>
						))}
						{!BASE_PRESETS.includes(selectedPreset) && (
							<span className={toolPill(true, 'font-mono')}>
								{selectedPreset === 'custom'
									? 'своя кривая'
									: EASING_PRESETS[
											selectedPreset as keyof typeof EASING_PRESETS
										]?.name}
							</span>
						)}
					</div>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={toggleAnimation}
							title={isPlaying ? 'Остановить' : 'Проиграть'}
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
							onClick={resetCurve}
							title='Вернуть кривую ease'
							className={toolIconButton}
						>
							<RotateCcw className='h-4 w-4' />
						</Button>
					</div>
				</div>

				{/* Рабочая область: слева кривая, справа то, как она ощущается в
				    движении. Раньше предпросмотр жил под контрольными точками —
				    ниже графика на полтора экрана. */}
				<div className='grid gap-8 px-5 py-8 sm:px-6 lg:grid-cols-2'>
					<div className='relative'>
						<canvas
							ref={canvasRef}
							style={{
								width: `${canvasSize.width}px`,
								height: `${canvasSize.height}px`,
								maxWidth: '100%',
								aspectRatio: '1 / 1'
							}}
							className='w-full cursor-grab touch-none rounded-xl border bg-white active:cursor-grabbing dark:bg-gray-950'
							onPointerDown={handlePointerDown}
							onPointerMove={handlePointerMove}
							onPointerUp={handlePointerUp}
							onPointerCancel={handlePointerUp}
						/>
						<p className='mt-2 text-sm text-muted-foreground'>
							{dragging
								? `Тянете точку ${dragging.toUpperCase()}`
								: 'Тяните точки P1 и P2 мышью — или впишите координаты ниже'}
						</p>
					</div>

					<div className='space-y-3'>
						{/* Движению нужна вся ширина — оно едет на 200px */}
						<div className='flex h-16 items-center rounded-xl bg-muted/30 px-3'>
							<div
								className='h-8 w-8 shrink-0 rounded-lg bg-primary'
								style={{
									transform: isPlaying ? 'translateX(200px)' : 'none',
									transition: isPlaying
										? `transform ${duration}s ${cssOutput}`
										: 'none'
								}}
							/>
						</div>

						{/* Масштаб и вращение меняются на месте — им хватает узкой ячейки */}
						<div className='grid grid-cols-2 gap-3'>
							{[
								{
									label: 'Масштаб',
									from: 'scale(0.5)',
									to: 'scale(1)'
								},
								{
									label: 'Вращение',
									from: 'rotate(0deg)',
									to: 'rotate(360deg)'
								}
							].map(demo => (
								<div
									key={demo.label}
									className='flex h-16 items-center justify-center rounded-xl bg-muted/30'
								>
									<div
										className='h-8 w-8 rounded-lg bg-primary'
										style={{
											transform: isPlaying ? demo.to : demo.from,
											transition: isPlaying
												? `transform ${duration}s ${cssOutput}`
												: 'none'
										}}
									/>
								</div>
							))}
						</div>

						<p className='text-sm text-muted-foreground'>
							Движение, масштаб и вращение с этой кривой — нажмите «играть» в
							шапке инструмента
						</p>
					</div>
				</div>

				{/* Полоса координат: те же точки, что и на графике, но числами. */}
				<div className={toolFooterBar}>
					{(
						[
							{ key: 'p1', label: 'P1' },
							{ key: 'p2', label: 'P2' }
						] as const
					).map(({ key, label }) => (
						<div
							key={key}
							className={cn(
								'flex items-center gap-2 text-sm',
								dragging === key ? 'text-primary' : 'text-muted-foreground'
							)}
						>
							<span className='font-mono text-xs'>{label}</span>
							<input
								type='number'
								value={curve[key].x.toFixed(2)}
								onChange={event =>
									handleManualInput(
										`${key}x` as 'p1x' | 'p2x',
										event.target.value
									)
								}
								min={0}
								max={1}
								step={0.01}
								aria-label={`${label} по оси X`}
								className='w-20 rounded-md border bg-background px-2 py-1 text-center font-mono text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
							/>
							<input
								type='number'
								value={curve[key].y.toFixed(2)}
								onChange={event =>
									handleManualInput(
										`${key}y` as 'p1y' | 'p2y',
										event.target.value
									)
								}
								min={-2}
								max={2}
								step={0.01}
								aria-label={`${label} по оси Y`}
								className='w-20 rounded-md border bg-background px-2 py-1 text-center font-mono text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
							/>
						</div>
					))}

					{/* Длительность на форму кривой не влияет — она только про то,
					    за сколько секунд её проходят. */}
					<label className='flex items-center gap-2 text-sm text-muted-foreground'>
						<span className='font-mono text-xs'>duration</span>
						<Slider
							value={[duration]}
							onValueChange={([value]) => setDuration(value)}
							min={0.1}
							max={5}
							step={0.1}
							className='w-24 cursor-pointer'
							aria-label='Длительность анимации'
						/>
						<span className='w-10 font-mono text-sm text-foreground tabular-nums'>
							{duration.toFixed(1)}s
						</span>
					</label>
				</div>

				<div className='grid border-t md:grid-cols-2'>
					{[
						{
							title: 'CSS',
							value: `${cssTransition};`,
							copied: copied === 'css',
							onCopy: () => copyToClipboard(`${cssTransition};`, 'css')
						},
						{
							title: 'Tailwind',
							value: tailwindClass,
							copied: copied === 'tailwind',
							onCopy: () => copyToClipboard(tailwindClass, 'tailwind')
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

			{/* Библиотека кривых — тихая полка под инструментом. Названия вроде
			    easeOutBack ничего не значат, пока кривую не увидишь в движении,
			    поэтому клик грузит её в график, а не просто копирует числа. */}
			<div className='mt-6'>
				<p className='px-1 text-sm text-muted-foreground'>
					Библиотека кривых — кликните, чтобы загрузить в график
				</p>
				<div className='mt-2 flex flex-wrap gap-1.5'>
					{Object.entries(EASING_PRESETS)
						.filter(([key]) => !BASE_PRESETS.includes(key))
						.map(([key, preset]) => (
							<button
								key={key}
								type='button'
								onClick={() => handlePresetChange(key)}
								aria-pressed={selectedPreset === key}
								className={toolPill(selectedPreset === key, 'font-mono')}
							>
								{preset.name}
							</button>
						))}
				</div>
			</div>

			{/* Справка — секцией под карточкой, как обучающие блоки в других тулах */}
			<section className='mx-auto mt-12 max-w-3xl text-left text-foreground'>
				<h2 className='text-2xl font-bold tracking-tight'>
					Что такое cubic-bezier
				</h2>
				<p className='mt-3 leading-relaxed'>
					<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
						cubic-bezier(x1, y1, x2, y2)
					</code>{' '}
					— функция плавности (easing) для{' '}
					<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
						transition-timing-function
					</code>{' '}
					и{' '}
					<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
						animation-timing-function
					</code>
					. Четыре числа — координаты двух контрольных точек кривой Безье,
					которая описывает скорость движения во времени: где анимация
					разгоняется, а где тормозит. Ключевые слова{' '}
					<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
						ease
					</code>
					,{' '}
					<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
						ease-in
					</code>
					,{' '}
					<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
						ease-out
					</code>{' '}
					— просто готовые cubic-bezier с заранее подобранными числами.
				</p>

				<h2 className='mt-10 text-2xl font-bold tracking-tight'>
					Как пользоваться генератором
				</h2>
				<ol className='mt-3 space-y-2 leading-relaxed'>
					<li>
						Перетащите точки P1 и P2 на графике — или впишите координаты
						вручную.
					</li>
					<li>
						Нажмите «Воспроизвести», чтобы увидеть кривую в движении на трёх
						примерах.
					</li>
					<li>
						Настройте длительность анимации ползунком — форма кривой от неё не
						зависит.
					</li>
					<li>
						Скопируйте готовое значение CSS или Tailwind-класс одной кнопкой.
					</li>
				</ol>

				<h2 className='mt-10 text-2xl font-bold tracking-tight'>
					Готовые кривые и их числа
				</h2>
				<p className='mt-3 leading-relaxed'>
					Стандартные ключевые слова — это конкретные cubic-bezier, только с
					именем вместо чисел.
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full border-collapse text-sm'>
						<thead>
							<tr className='border-b text-left'>
								<th className='py-2 pr-4 font-semibold'>Ключевое слово</th>
								<th className='py-2 font-semibold'>cubic-bezier()</th>
							</tr>
						</thead>
						<tbody>
							{[
								['linear', '0, 0, 1, 1'],
								['ease', '0.25, 0.1, 0.25, 1'],
								['ease-in', '0.42, 0, 1, 1'],
								['ease-out', '0, 0, 0.58, 1'],
								['ease-in-out', '0.42, 0, 0.58, 1']
							].map(([name, values]) => (
								<tr key={name} className='border-b align-top last:border-0'>
									<td className='py-2 pr-4'>
										<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-xs'>
											{name}
										</code>
									</td>
									<td className='py-2 font-mono text-xs text-muted-foreground'>
										cubic-bezier({values})
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<h2 className='mt-10 text-2xl font-bold tracking-tight'>
					Как читать контрольные точки
				</h2>
				<p className='mt-3 leading-relaxed'>
					P1 отвечает за начало движения, P2 — за конец. Чем дальше точка от
					своего края графика, тем резче эффект в этой части анимации.
					Координата X всегда лежит между 0 и 1 — это время, от начала до конца
					перехода. Координата Y может выходить за пределы 0–1: тогда элемент
					«перелетает» конечное значение и возвращается — получается эффект
					отскока, как в{' '}
					<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
						easeOutBack
					</code>
					.
				</p>

				<h2 className='mt-10 text-2xl font-bold tracking-tight'>
					Какую кривую выбрать
				</h2>
				<p className='mt-3 leading-relaxed'>
					Для интерфейсных переходов — открытие меню, появление модалки,
					наведение на кнопку — обычно нужен ease-out: движение начинается
					быстро и мягко останавливается, это ощущается отзывчивее, чем плавный
					разгон. Ease-in подходит, когда элемент уходит со экрана —
					исчезновение можно начать неспешно. Linear уместен только для
					механических процессов вроде прогресс-бара или бесконечного вращения —
					в остальных случаях он выглядит неестественно.
				</p>

				<p className='mt-8 leading-relaxed'>
					Собранную кривую можно сразу применить к анимации по кадрам в{' '}
					<Link
						href='/tools/css-keyframes-generator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						конструкторе CSS-анимаций
					</Link>{' '}
					или к тени, которая плавно нарастает при наведении, в{' '}
					<Link
						href='/tools/css-box-shadow-generator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						генераторе теней box-shadow
					</Link>
					.
				</p>
			</section>
		</>
	)
}
