'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Copy, Play, Pause, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
	createBezierEasing,
	generateCurvePoints,
	EASING_PRESETS,
	formatCubicBezier,
	getHandlePositions,
	updateCurveFromHandle,
	type BezierCurve
} from '@/lib/utils/bezier-easing'

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
	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text)
		toast.success('CSS значение скопировано в буфер обмена')
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
		<div className='max-w-7xl mx-auto space-y-6'>
			<Card className='space-y-8 p-6 sm:p-8'>
				{/* Пресеты — ряд наверху, как в остальных CSS-тулах */}
				<div className='flex flex-wrap items-center gap-2'>
					{Object.entries(EASING_PRESETS).map(([key, preset]) => (
						<Button
							key={key}
							onClick={() => handlePresetChange(key)}
							variant={selectedPreset === key ? 'default' : 'outline'}
							size='sm'
							className='cursor-pointer'
						>
							{preset.name}
						</Button>
					))}
					{selectedPreset === 'custom' && (
						<Badge variant='secondary'>Своя кривая</Badge>
					)}

					<div className='ml-auto flex items-center gap-2'>
						<Button
							onClick={toggleAnimation}
							variant={isPlaying ? 'secondary' : 'default'}
							size='sm'
							className='cursor-pointer gap-2'
						>
							{isPlaying ? (
								<>
									<Pause className='h-4 w-4' />
									Пауза
								</>
							) : (
								<>
									<Play className='h-4 w-4' />
									Воспроизвести
								</>
							)}
						</Button>
						<Button
							onClick={resetCurve}
							variant='ghost'
							size='sm'
							className='cursor-pointer gap-2'
						>
							<RotateCcw className='h-4 w-4' />
							Сброс
						</Button>
					</div>
				</div>

				<div className='grid gap-10 border-t pt-8 lg:grid-cols-2'>
					{/* Кривая */}
					<div className='space-y-4'>
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
							{dragging && (
								<div className='absolute top-3 left-3 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground'>
									Перетаскивание {dragging.toUpperCase()}
								</div>
							)}
						</div>
						<p className='text-xs text-muted-foreground'>
							Тяните точки P1 и P2 мышью — или задайте координаты вручную
							справа.
						</p>
					</div>

					{/* Параметры */}
					<div className='space-y-6'>
						<div>
							<div className='flex items-center justify-between'>
								<Label className='text-sm'>Длительность анимации</Label>
								<span className='font-mono text-sm'>
									{duration.toFixed(1)}s
								</span>
							</div>
							<Slider
								value={[duration]}
								onValueChange={([v]) => setDuration(v)}
								min={0.1}
								max={5}
								step={0.1}
								className='mt-2'
							/>
						</div>

						<div className='space-y-3'>
							<h3 className='text-sm font-semibold tracking-wide text-muted-foreground uppercase'>
								Контрольные точки
							</h3>
							<div className='grid grid-cols-2 gap-4'>
								{(
									[
										{ key: 'p1', label: 'Точка P1' },
										{ key: 'p2', label: 'Точка P2' }
									] as const
								).map(({ key, label }) => (
									<div
										key={key}
										className={cn(
											'space-y-3 rounded-lg border p-4 transition-colors',
											dragging === key ? 'border-primary bg-primary/5' : ''
										)}
									>
										<Label className='text-sm font-medium'>{label}</Label>
										<div className='grid grid-cols-2 gap-2'>
											<div className='space-y-1.5'>
												<Label className='text-xs text-muted-foreground'>
													X
												</Label>
												<Input
													type='number'
													value={curve[key].x.toFixed(2)}
													onChange={e =>
														handleManualInput(
															`${key}x` as 'p1x' | 'p2x',
															e.target.value
														)
													}
													min='0'
													max='1'
													step='0.01'
													className='h-9 font-mono text-sm'
												/>
											</div>
											<div className='space-y-1.5'>
												<Label className='text-xs text-muted-foreground'>
													Y
												</Label>
												<Input
													type='number'
													value={curve[key].y.toFixed(2)}
													onChange={e =>
														handleManualInput(
															`${key}y` as 'p1y' | 'p2y',
															e.target.value
														)
													}
													min='-2'
													max='2'
													step='0.01'
													className='h-9 font-mono text-sm'
												/>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Предпросмотр: как кривая ощущается в движении.
						    Анимацию ведёт CSS — одно переключение значения и переход
						    с нужной кривой; rAF остался только для точки на графике */}
						<div className='space-y-3'>
							<h3 className='text-sm font-semibold tracking-wide text-muted-foreground uppercase'>
								Предпросмотр
							</h3>

							{/* Движению нужна вся ширина — оно едет на 200px */}
							<div className='space-y-1.5'>
								<div className='flex items-center justify-between text-sm'>
									<span>Движение</span>
									<span className='text-xs text-muted-foreground'>
										0 → 200px
									</span>
								</div>
								<div className='flex h-14 items-center rounded-lg bg-muted/40 px-3'>
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
							</div>

							{/* Масштаб и вращение меняются на месте — им хватает узкой ячейки */}
							<div className='grid grid-cols-2 gap-3'>
								{[
									{
										label: 'Масштаб',
										hint: '0.5 → 1',
										from: 'scale(0.5)',
										to: 'scale(1)'
									},
									{
										label: 'Вращение',
										hint: '0 → 360°',
										from: 'rotate(0deg)',
										to: 'rotate(360deg)'
									}
								].map(demo => (
									<div key={demo.label} className='space-y-1.5'>
										<div className='flex items-center justify-between text-sm'>
											<span>{demo.label}</span>
											<span className='text-xs text-muted-foreground'>
												{demo.hint}
											</span>
										</div>
										<div className='flex h-14 items-center justify-center rounded-lg bg-muted/40'>
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
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Готовый код — во всю ширину: длинным значениям нужен простор */}
				<div className='grid gap-4 border-t pt-8 md:grid-cols-2'>
					<div>
						<div className='mb-2 flex items-center justify-between'>
							<Label className='text-sm text-muted-foreground'>CSS</Label>
							<Button
								onClick={() => copyToClipboard(cssTransition)}
								variant='ghost'
								size='sm'
								className='h-8 cursor-pointer px-2'
								aria-label='Скопировать CSS'
							>
								<Copy className='h-3 w-3' />
							</Button>
						</div>
						<div className='rounded-lg bg-secondary p-4'>
							<code className='font-mono text-xs break-all text-secondary-foreground'>
								{cssTransition};
							</code>
						</div>
					</div>

					<div>
						<div className='mb-2 flex items-center justify-between'>
							<Label className='text-sm text-muted-foreground'>
								Tailwind CSS
							</Label>
							<Button
								onClick={() => copyToClipboard(tailwindClass)}
								variant='ghost'
								size='sm'
								className='h-8 cursor-pointer px-2'
								aria-label='Скопировать Tailwind CSS'
							>
								<Copy className='h-3 w-3' />
							</Button>
						</div>
						<div className='rounded-lg bg-secondary p-4'>
							<code className='font-mono text-xs break-all text-secondary-foreground'>
								{tailwindClass}
							</code>
						</div>
					</div>
				</div>
			</Card>

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
					<li>Перетащите точки P1 и P2 на графике — или впишите координаты вручную.</li>
					<li>Нажмите «Воспроизвести», чтобы увидеть кривую в движении на трёх примерах.</li>
					<li>Настройте длительность анимации ползунком — форма кривой от неё не зависит.</li>
					<li>Скопируйте готовое значение CSS или Tailwind-класс одной кнопкой.</li>
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
					Для интерфейсных переходов — открытие меню, появление модалки, наведение
					на кнопку — обычно нужен ease-out: движение начинается быстро и мягко
					останавливается, это ощущается отзывчивее, чем плавный разгон. Ease-in
					подходит, когда элемент уходит со экрана — исчезновение можно начать
					неспешно. Linear уместен только для механических процессов вроде
					прогресс-бара или бесконечного вращения — в остальных случаях он
					выглядит неестественно.
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
		</div>
	)
}
