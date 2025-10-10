'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Copy, Play, Pause, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import {
	createBezierEasing,
	generateCurvePoints,
	EASING_PRESETS,
	formatCubicBezier,
	parseCubicBezier,
	getBezierPath,
	getHandlePositions,
	updateCurveFromHandle,
	type BezierCurve,
	type Point
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

	// Refs
	const svgRef = useRef<SVGSVGElement>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const animationRef = useRef<number | undefined>(undefined)
	const startTimeRef = useRef<number | undefined>(undefined)
	const isDraggingRef = useRef<'p1' | 'p2' | null>(null)

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

		drawGrid(ctx)
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

	// Handle mouse events for dragging
	const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current
		if (!canvas) return

		const rect = canvas.getBoundingClientRect()
		const x = e.clientX - rect.left - padding
		const y = e.clientY - rect.top - padding

		const handles = getHandlePositions(gridSize, gridSize, curve)

		// Check if clicking on P1
		const p1Dist = Math.sqrt(
			Math.pow(x - handles.p1.x, 2) + Math.pow(y - handles.p1.y, 2)
		)
		if (p1Dist < 15) {
			isDraggingRef.current = 'p1'
			return
		}

		// Check if clicking on P2
		const p2Dist = Math.sqrt(
			Math.pow(x - handles.p2.x, 2) + Math.pow(y - handles.p2.y, 2)
		)
		if (p2Dist < 15) {
			isDraggingRef.current = 'p2'
			return
		}
	}

	const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
		if (!isDraggingRef.current) return

		const canvas = canvasRef.current
		if (!canvas) return

		const rect = canvas.getBoundingClientRect()
		const x = e.clientX - rect.left - padding
		const y = e.clientY - rect.top - padding

		const newCurve = updateCurveFromHandle(
			isDraggingRef.current,
			x,
			y,
			gridSize,
			gridSize,
			curve
		)

		setCurve(newCurve)
		setSelectedPreset('custom')
	}

	const handleMouseUp = () => {
		isDraggingRef.current = null
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
	const cssAnimation = `animation-timing-function: ${cssOutput}`

	return (
		<div className='space-y-6'>
			{/* Main Editor Card */}
			<Card>
				<CardHeader className='pb-4'>
					<div className='flex items-start justify-between'>
						<div>
							<CardTitle className='text-2xl'>Генератор кривых Безье</CardTitle>
							<CardDescription className='mt-2'>
								Создавайте плавные анимации с помощью кривых cubic-bezier
							</CardDescription>
						</div>
						<div className='flex gap-2'>
							<Button
								onClick={toggleAnimation}
								variant={isPlaying ? 'default' : 'outline'}
								size='lg'
							>
								{isPlaying ? (
									<>
										<Pause className='w-4 h-4 mr-2' />
										Пауза
									</>
								) : (
									<>
										<Play className='w-4 h-4 mr-2' />
										Воспроизвести
									</>
								)}
							</Button>
							<Button onClick={resetCurve} variant='outline' size='lg'>
								<RotateCcw className='w-4 h-4' />
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className='grid gap-6 lg:grid-cols-[420px_1fr]'>
						{/* Canvas Section */}
						<div className='space-y-4'>
							<div className='relative'>
								<canvas
									ref={canvasRef}
									width={canvasSize.width}
									height={canvasSize.height}
									className='w-full border-2 rounded-xl cursor-crosshair bg-white dark:bg-gray-950 hover:border-primary/50 transition-all shadow-sm'
									onMouseDown={handleMouseDown}
									onMouseMove={handleMouseMove}
									onMouseUp={handleMouseUp}
									onMouseLeave={handleMouseUp}
								/>
								{isDraggingRef.current && (
									<div className='absolute top-3 left-3 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md font-medium shadow-lg'>
										Редактирование {isDraggingRef.current.toUpperCase()}
									</div>
								)}
							</div>
						</div>

						{/* Controls Section */}
						<div className='space-y-6'>
							{/* Duration Control */}
							<div className='p-4 border rounded-lg bg-muted/30 space-y-3'>
								<div className='flex items-center justify-between'>
									<Label className='text-sm font-semibold'>
										Длительность анимации
									</Label>
									<span className='text-sm font-mono bg-background px-2 py-1 rounded border'>
										{duration.toFixed(1)}s
									</span>
								</div>
								<Slider
									value={[duration]}
									onValueChange={([v]) => setDuration(v)}
									min={0.1}
									max={5}
									step={0.1}
									className='w-full'
								/>
							</div>

							{/* Presets */}
							<div className='space-y-3'>
								<Label className='text-base font-semibold'>
									Готовые варианты
								</Label>
								<Select
									value={selectedPreset}
									onValueChange={handlePresetChange}
								>
									<SelectTrigger className='h-11'>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='custom'>🎨 Своя кривая</SelectItem>
										{Object.entries(EASING_PRESETS).map(([key, preset]) => (
											<SelectItem key={key} value={key}>
												{preset.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Manual Control Points */}
							<div className='space-y-3'>
								<Label className='text-base font-semibold'>
									Контрольные точки
								</Label>
								<div className='grid grid-cols-2 gap-3'>
									{/* P1 */}
									<div className='p-4 border-2 rounded-lg bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800 space-y-3'>
										<div className='flex items-center gap-2'>
											<div className='w-3 h-3 rounded-full bg-purple-600' />
											<Label className='text-sm font-semibold text-purple-700 dark:text-purple-300'>
												Точка P1
											</Label>
										</div>
										<div className='grid grid-cols-2 gap-2'>
											<div className='space-y-1.5'>
												<Label className='text-xs text-muted-foreground'>
													X
												</Label>
												<Input
													type='number'
													value={curve.p1.x.toFixed(2)}
													onChange={e =>
														handleManualInput('p1x', e.target.value)
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
													value={curve.p1.y.toFixed(2)}
													onChange={e =>
														handleManualInput('p1y', e.target.value)
													}
													min='-2'
													max='2'
													step='0.01'
													className='h-9 font-mono text-sm'
												/>
											</div>
										</div>
									</div>

									{/* P2 */}
									<div className='p-4 border-2 rounded-lg bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800 space-y-3'>
										<div className='flex items-center gap-2'>
											<div className='w-3 h-3 rounded-full bg-purple-600' />
											<Label className='text-sm font-semibold text-purple-700 dark:text-purple-300'>
												Точка P2
											</Label>
										</div>
										<div className='grid grid-cols-2 gap-2'>
											<div className='space-y-1.5'>
												<Label className='text-xs text-muted-foreground'>
													X
												</Label>
												<Input
													type='number'
													value={curve.p2.x.toFixed(2)}
													onChange={e =>
														handleManualInput('p2x', e.target.value)
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
													value={curve.p2.y.toFixed(2)}
													onChange={e =>
														handleManualInput('p2y', e.target.value)
													}
													min='-2'
													max='2'
													step='0.01'
													className='h-9 font-mono text-sm'
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Preview Card */}
			<Card>
				<CardHeader className='pb-4'>
					<div>
						<CardTitle className='flex items-center gap-2'>
							<Play className='w-5 h-5' />
							Предпросмотр анимации
						</CardTitle>
						<CardDescription className='mt-1'>
							Посмотрите как работает кривая с разными трансформациями
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent>
					<div className='grid gap-4 md:grid-cols-3'>
						{/* translateX */}
						<div className='space-y-3 p-4 border rounded-lg bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20'>
							<div className='flex items-center justify-between'>
								<span className='text-sm font-medium'>Движение</span>
								<code className='text-xs bg-background/80 px-2 py-1 rounded border font-mono'>
									translateX
								</code>
							</div>
							<div className='relative h-20 bg-white/50 dark:bg-gray-900/50 rounded-lg overflow-hidden border'>
								<div className='absolute inset-2 flex items-center'>
									<div
										className='w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg flex-shrink-0'
										style={{
											transform: `translateX(${progress * 200}px)`,
											transition: isPlaying
												? `transform ${duration}s ${cssOutput}`
												: 'none'
										}}
									/>
								</div>
							</div>
							<div className='text-xs text-muted-foreground text-center'>
								0px → 200px
							</div>
						</div>

						{/* scale */}
						<div className='space-y-3 p-4 border rounded-lg bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20'>
							<div className='flex items-center justify-between'>
								<span className='text-sm font-medium'>Масштаб</span>
								<code className='text-xs bg-background/80 px-2 py-1 rounded border font-mono'>
									scale
								</code>
							</div>
							<div className='relative h-20 bg-white/50 dark:bg-gray-900/50 rounded-lg overflow-hidden flex items-center justify-center border'>
								<div
									className='w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg shadow-lg'
									style={{
										transform: `scale(${0.5 + progress * 0.5})`,
										transition: isPlaying
											? `transform ${duration}s ${cssOutput}`
											: 'none'
									}}
								/>
							</div>
							<div className='text-xs text-muted-foreground text-center'>
								0.5 → 1.0
							</div>
						</div>

						{/* rotate */}
						<div className='space-y-3 p-4 border rounded-lg bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20'>
							<div className='flex items-center justify-between'>
								<span className='text-sm font-medium'>Вращение</span>
								<code className='text-xs bg-background/80 px-2 py-1 rounded border font-mono'>
									rotate
								</code>
							</div>
							<div className='relative h-20 bg-white/50 dark:bg-gray-900/50 rounded-lg overflow-hidden flex items-center justify-center border'>
								<div
									className='w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-lg'
									style={{
										transform: `rotate(${progress * 360}deg)`,
										transition: isPlaying
											? `transform ${duration}s ${cssOutput}`
											: 'none'
									}}
								/>
							</div>
							<div className='text-xs text-muted-foreground text-center'>
								0° → 360°
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* CSS Output Card */}
			<Card>
				<CardHeader className='pb-4'>
					<CardTitle className='text-lg'>Готовый CSS код</CardTitle>
					<CardDescription>
						Скопируйте значение для использования в ваших стилях
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-6'>
					{/* cubic-bezier value */}
					<div className='space-y-3'>
						<div className='flex items-center justify-between'>
							<Label className='text-sm font-medium'>cubic-bezier</Label>
						</div>
						<div className='grid gap-3'>
							{/* CSS Value */}
							<div>
								<div className='flex items-center justify-between mb-2'>
									<Label className='text-xs text-muted-foreground'>CSS</Label>
									<Button
										onClick={() => copyToClipboard(cssOutput)}
										variant='ghost'
										size='sm'
										className='h-7 px-2'
									>
										<Copy className='w-3 h-3' />
									</Button>
								</div>
								<div className='bg-secondary rounded-lg p-3'>
									<code className='text-secondary-foreground font-mono text-sm break-all'>
										{cssOutput}
									</code>
								</div>
							</div>
						</div>
					</div>

					{/* transition */}
					<div className='space-y-3'>
						<div className='flex items-center justify-between'>
							<Label className='text-sm font-medium'>CSS Transition</Label>
						</div>
						<div className='grid gap-3'>
							{/* CSS Value */}
							<div>
								<div className='flex items-center justify-between mb-2'>
									<Label className='text-xs text-muted-foreground'>CSS</Label>
									<Button
										onClick={() => copyToClipboard(cssTransition)}
										variant='ghost'
										size='sm'
										className='h-7 px-2'
									>
										<Copy className='w-3 h-3' />
									</Button>
								</div>
								<div className='bg-secondary rounded-lg p-3'>
									<code className='text-secondary-foreground font-mono text-sm break-all'>
										{cssTransition}
									</code>
								</div>
							</div>

							{/* Tailwind Value */}
							<div>
								<div className='flex items-center justify-between mb-2'>
									<Label className='text-xs text-muted-foreground'>
										Tailwind CSS
									</Label>
									<Button
										onClick={() =>
											copyToClipboard(
												`transition-all duration-[${duration * 1000}ms] ease-[${cssOutput}]`
											)
										}
										variant='ghost'
										size='sm'
										className='h-7 px-2'
									>
										<Copy className='w-3 h-3' />
									</Button>
								</div>
								<div className='bg-secondary rounded-lg p-3'>
									<code className='text-secondary-foreground font-mono text-sm break-all'>
										transition-all duration-[{duration * 1000}ms] ease-[
										{cssOutput}]
									</code>
								</div>
							</div>
						</div>
					</div>

					{/* animation */}
					<div className='space-y-3'>
						<div className='flex items-center justify-between'>
							<Label className='text-sm font-medium'>CSS Animation</Label>
						</div>
						<div className='grid gap-3'>
							{/* CSS Value */}
							<div>
								<div className='flex items-center justify-between mb-2'>
									<Label className='text-xs text-muted-foreground'>CSS</Label>
									<Button
										onClick={() => copyToClipboard(cssAnimation)}
										variant='ghost'
										size='sm'
										className='h-7 px-2'
									>
										<Copy className='w-3 h-3' />
									</Button>
								</div>
								<div className='bg-secondary rounded-lg p-3'>
									<code className='text-secondary-foreground font-mono text-sm break-all'>
										{cssAnimation}
									</code>
								</div>
							</div>

							{/* Tailwind Value */}
							<div>
								<div className='flex items-center justify-between mb-2'>
									<Label className='text-xs text-muted-foreground'>
										Tailwind CSS
									</Label>
									<Button
										onClick={() =>
											copyToClipboard(
												`animate-[custom_${duration}s_ease-[${cssOutput}]]`
											)
										}
										variant='ghost'
										size='sm'
										className='h-7 px-2'
									>
										<Copy className='w-3 h-3' />
									</Button>
								</div>
								<div className='bg-secondary rounded-lg p-3'>
									<code className='text-secondary-foreground font-mono text-sm break-all'>
										animate-[custom_{duration}s_ease-[{cssOutput}]]
									</code>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
