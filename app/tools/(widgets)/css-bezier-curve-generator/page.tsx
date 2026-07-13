'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
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

						{/* Предпросмотр: как кривая ощущается в движении */}
						<div className='space-y-4'>
							<h3 className='text-sm font-semibold tracking-wide text-muted-foreground uppercase'>
								Предпросмотр
							</h3>
							<div className='grid gap-4 grid-cols-1'>
								{[
									{
										label: 'Движение',
										hint: '0 → 200px',
										from: 'translateX(0)',
										to: 'translateX(200px)'
									},
									{
										label: 'Масштаб',
										hint: '0.5 → 1.0',
										from: 'scale(0.5)',
										to: 'scale(1)'
									},
									{
										label: 'Вращение',
										hint: '0° → 360°',
										from: 'rotate(0deg)',
										to: 'rotate(360deg)'
									}
								].map(demo => (
									<div key={demo.label} className='space-y-2'>
										<div className='flex items-center justify-between text-sm'>
											<span>{demo.label}</span>
											<span className='text-xs text-muted-foreground'>
												{demo.hint}
											</span>
										</div>
										<div className='flex h-20 items-center rounded-lg bg-muted/40 px-3'>
											{/* Анимацию ведёт CSS: одно переключение значения и переход
											    с нужной кривой. Раньше transform ещё и пересчитывался
											    каждый кадр из rAF — переход и React дрались за одно
											    свойство, движение выходило рваным, а кривая не читалась */}
											<div
												className='h-10 w-10 shrink-0 rounded-lg bg-primary'
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
		</div>
	)
}
