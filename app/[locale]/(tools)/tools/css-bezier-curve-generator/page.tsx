'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
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
	const t = useTranslations('widgets.bezierCurve')

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
	const canvasSize = { width: 300, height: 300 }
	const padding = 40
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
		toast.success(t('toast.copied'))
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
		<Card>
			<CardHeader className='sr-only'>
				<CardTitle>{t('title')}</CardTitle>
				<CardDescription>{t('description')}</CardDescription>
			</CardHeader>
			<CardContent className='space-y-6'>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
					{/* Canvas Editor */}
					<div className='space-y-4'>
						<Label>{t('curveEditor')}</Label>
						<div className='relative inline-block'>
							<canvas
								ref={canvasRef}
								width={canvasSize.width}
								height={canvasSize.height}
								className='border rounded-lg cursor-pointer bg-white dark:bg-gray-950'
								onMouseDown={handleMouseDown}
								onMouseMove={handleMouseMove}
								onMouseUp={handleMouseUp}
								onMouseLeave={handleMouseUp}
							/>
						</div>

						{/* Animation Controls */}
						<div className='flex items-center gap-4'>
							<Button
								onClick={toggleAnimation}
								variant='outline'
								size='sm'
								className='gap-2'
							>
								{isPlaying ? (
									<>
										<Pause className='w-4 h-4' />
										{t('pause')}
									</>
								) : (
									<>
										<Play className='w-4 h-4' />
										{t('play')}
									</>
								)}
							</Button>

							<Button
								onClick={resetCurve}
								variant='outline'
								size='sm'
								className='gap-2'
							>
								<RotateCcw className='w-4 h-4' />
								{t('reset')}
							</Button>

							<div className='flex-1 space-y-1'>
								<Label className='text-xs'>
									{t('duration')} ({duration}s)
								</Label>
								<Slider
									value={[duration]}
									onValueChange={([v]) => setDuration(v)}
									min={0.1}
									max={5}
									step={0.1}
									className='w-full'
								/>
							</div>
						</div>
					</div>

					{/* Controls and Output */}
					<div className='space-y-4'>
						{/* Presets */}
						<div className='space-y-2'>
							<Label>{t('presets')}</Label>
							<Select value={selectedPreset} onValueChange={handlePresetChange}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='custom'>{t('custom')}</SelectItem>
									{Object.entries(EASING_PRESETS).map(([key, preset]) => (
										<SelectItem key={key} value={key}>
											{preset.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Manual Input */}
						<div className='space-y-2'>
							<Label>{t('controlPoints')}</Label>
							<div className='grid grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label className='text-xs text-muted-foreground'>
										P1 (x, y)
									</Label>
									<div className='flex gap-2'>
										<Input
											type='number'
											value={curve.p1.x.toFixed(2)}
											onChange={e => handleManualInput('p1x', e.target.value)}
											min='0'
											max='1'
											step='0.01'
											className='w-20'
										/>
										<Input
											type='number'
											value={curve.p1.y.toFixed(2)}
											onChange={e => handleManualInput('p1y', e.target.value)}
											min='-2'
											max='2'
											step='0.01'
											className='w-20'
										/>
									</div>
								</div>
								<div className='space-y-2'>
									<Label className='text-xs text-muted-foreground'>
										P2 (x, y)
									</Label>
									<div className='flex gap-2'>
										<Input
											type='number'
											value={curve.p2.x.toFixed(2)}
											onChange={e => handleManualInput('p2x', e.target.value)}
											min='0'
											max='1'
											step='0.01'
											className='w-20'
										/>
										<Input
											type='number'
											value={curve.p2.y.toFixed(2)}
											onChange={e => handleManualInput('p2y', e.target.value)}
											min='-2'
											max='2'
											step='0.01'
											className='w-20'
										/>
									</div>
								</div>
							</div>
						</div>

						{/* CSS Output */}
						<div className='space-y-4 pt-4 border-t'>
							<h3 className='font-semibold'>{t('cssOutput')}</h3>

							<div className='space-y-2'>
								<div className='flex items-center justify-between p-3 rounded-lg bg-muted/50 group'>
									<code className='font-mono text-sm'>{cssOutput}</code>
									<button
										onClick={() => copyToClipboard(cssOutput)}
										className='opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-accent hover:text-white rounded'
									>
										<Copy className='w-4 h-4' />
									</button>
								</div>

								<div className='flex items-center justify-between p-3 rounded-lg bg-muted/50 group'>
									<code className='font-mono text-sm'>{cssTransition}</code>
									<button
										onClick={() => copyToClipboard(cssTransition)}
										className='opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-accent hover:text-white rounded'
									>
										<Copy className='w-4 h-4' />
									</button>
								</div>

								<div className='flex items-center justify-between p-3 rounded-lg bg-muted/50 group'>
									<code className='font-mono text-sm'>{cssAnimation}</code>
									<button
										onClick={() => copyToClipboard(cssAnimation)}
										className='opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-accent hover:text-white rounded'
									>
										<Copy className='w-4 h-4' />
									</button>
								</div>
							</div>
						</div>

						{/* Preview */}
						<div className='space-y-2 pt-4 border-t'>
							<Label>{t('preview')}</Label>
							<div className='space-y-4 p-4 rounded-lg border bg-background'>
								<div
									className='h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg transform-gpu'
									style={{
										transform: `translateX(${progress * 200}px)`,
										transition: isPlaying
											? `transform ${duration}s ${cssOutput}`
											: 'none'
									}}
								/>
								<div
									className='h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg transform-gpu'
									style={{
										transform: `scale(${0.5 + progress * 0.5})`,
										transition: isPlaying
											? `transform ${duration}s ${cssOutput}`
											: 'none'
									}}
								/>
								<div
									className='h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg transform-gpu'
									style={{
										transform: `rotate(${progress * 360}deg)`,
										transition: isPlaying
											? `transform ${duration}s ${cssOutput}`
											: 'none'
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
