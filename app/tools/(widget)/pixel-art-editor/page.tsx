'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Download, Eraser, Trash2, Upload } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import {
	createEmptyGrid,
	resizeGrid,
	imageDataToGrid,
	type PixelGrid
} from '@/lib/utils/pixel-art'
import {
	PIXEL_PALETTES,
	DEFAULT_PALETTE_ID,
	getPaletteById
} from '@/lib/constants/pixel-palettes'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { PixelArtEditorSeo } from './PixelArtEditorSeo'

const GRID_SIZES = [16, 32, 64] as const
type GridSize = (typeof GRID_SIZES)[number]

const CANVAS_DISPLAY_SIZE = 448

const STORAGE_KEY = 'pixel-art-editor-state'

interface StoredState {
	gridSize: GridSize
	paletteId: string
	grid: PixelGrid
}

function loadStoredState(): StoredState | null {
	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		if (!raw) return null
		return JSON.parse(raw) as StoredState
	} catch {
		return null
	}
}

export default function PixelArtEditorPage() {
	const widget = getWidgetById('pixel-art-editor')!

	const [gridSize, setGridSize] = useState<GridSize>(16)
	const [paletteId, setPaletteId] = useState(DEFAULT_PALETTE_ID)
	const [grid, setGrid] = useState<PixelGrid>(() => createEmptyGrid(16))
	const [activeColor, setActiveColor] = useState('#000000')
	const [tool, setTool] = useState<'brush' | 'eraser'>('brush')
	const [hydrated, setHydrated] = useState(false)

	const canvasRef = useRef<HTMLCanvasElement>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const isPointerDown = useRef(false)

	const palette = getPaletteById(paletteId)

	// Загрузка сохранённого рисунка — один раз при монтировании.
	useEffect(() => {
		const stored = loadStoredState()
		if (stored) {
			setGridSize(stored.gridSize)
			setPaletteId(stored.paletteId)
			setGrid(stored.grid)
		}
		setHydrated(true)
	}, [])

	// Сохранение — после гидрации, с дебаунсом, чтобы не писать на каждый пиксель.
	useEffect(() => {
		if (!hydrated) return
		const timeout = setTimeout(() => {
			localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({ gridSize, paletteId, grid })
			)
		}, 500)
		return () => clearTimeout(timeout)
	}, [hydrated, gridSize, paletteId, grid])

	// При смене палитры активный цвет выбирает первый цвет новой палитры,
	// если старый в неё не входит — иначе кисть красит цветом, которого нет
	// на выбранной палитре.
	useEffect(() => {
		if (!palette.colors.includes(activeColor)) {
			setActiveColor(palette.colors[0])
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [paletteId])

	const cellSize = CANVAS_DISPLAY_SIZE / gridSize

	// Отрисовка сетки в canvas при любом изменении пикселей или размера.
	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		ctx.clearRect(0, 0, canvas.width, canvas.height)

		for (let row = 0; row < gridSize; row++) {
			for (let col = 0; col < gridSize; col++) {
				const color = grid[row]?.[col]
				if (!color) continue
				ctx.fillStyle = color
				ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize)
			}
		}

		// Тонкая сетка поверх — помогает целиться в конкретный пиксель.
		ctx.strokeStyle = 'rgba(128, 128, 128, 0.2)'
		ctx.lineWidth = 1
		for (let i = 0; i <= gridSize; i++) {
			ctx.beginPath()
			ctx.moveTo(i * cellSize, 0)
			ctx.lineTo(i * cellSize, CANVAS_DISPLAY_SIZE)
			ctx.stroke()
			ctx.beginPath()
			ctx.moveTo(0, i * cellSize)
			ctx.lineTo(CANVAS_DISPLAY_SIZE, i * cellSize)
			ctx.stroke()
		}
	}, [grid, gridSize, cellSize])

	const paintAt = useCallback(
		(clientX: number, clientY: number) => {
			const canvas = canvasRef.current
			if (!canvas) return
			const rect = canvas.getBoundingClientRect()
			const x = ((clientX - rect.left) / rect.width) * CANVAS_DISPLAY_SIZE
			const y = ((clientY - rect.top) / rect.height) * CANVAS_DISPLAY_SIZE
			const col = Math.floor(x / cellSize)
			const row = Math.floor(y / cellSize)
			if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return

			setGrid(prev => {
				const next = prev.map(r => [...r])
				next[row][col] = tool === 'eraser' ? null : activeColor
				return next
			})
		},
		[cellSize, gridSize, tool, activeColor]
	)

	const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
		isPointerDown.current = true
		paintAt(event.clientX, event.clientY)
	}

	const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
		if (!isPointerDown.current) return
		paintAt(event.clientX, event.clientY)
	}

	const stopPainting = () => {
		isPointerDown.current = false
	}

	const handleGridSizeChange = (size: GridSize) => {
		setGrid(prev => resizeGrid(prev, size))
		setGridSize(size)
	}

	const clearCanvas = () => {
		setGrid(createEmptyGrid(gridSize))
	}

	const downloadPng = () => {
		const canvas = canvasRef.current
		if (!canvas) return
		const link = document.createElement('a')
		link.download = 'pixel-art.png'
		link.href = canvas.toDataURL('image/png')
		link.click()
	}

	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return

		const reader = new FileReader()
		reader.onload = e => {
			const img = new window.Image()
			img.onload = () => {
				const offscreen = document.createElement('canvas')
				offscreen.width = img.width
				offscreen.height = img.height
				const ctx = offscreen.getContext('2d')!
				ctx.drawImage(img, 0, 0)
				const imageData = ctx.getImageData(0, 0, img.width, img.height)
				setGrid(imageDataToGrid(imageData, gridSize, palette.colors))
			}
			img.src = e.target?.result as string
		}
		reader.readAsDataURL(file)
		// Позволяет загрузить тот же файл повторно после очистки.
		event.target.value = ''
	}

	const hasContent = grid.some(row => row.some(cell => cell !== null))

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				{/* Шапка: размер сетки слева, действия справа. */}
				<div className={toolBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						{GRID_SIZES.map(size => (
							<button
								key={size}
								type='button'
								onClick={() => handleGridSizeChange(size)}
								aria-pressed={gridSize === size}
								className={toolPill(gridSize === size)}
							>
								{size}×{size}
							</button>
						))}
					</div>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<input
							ref={fileInputRef}
							type='file'
							accept='image/*'
							onChange={handleImageUpload}
							aria-label='Загрузить фото'
							className='hidden'
						/>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => fileInputRef.current?.click()}
							title='Сделать пиксель-арт из фото'
							className={toolIconButton}
						>
							<Upload className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={downloadPng}
							disabled={!hasContent}
							title='Скачать PNG'
							className={toolIconButton}
						>
							<Download className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={clearCanvas}
							disabled={!hasContent}
							title='Очистить'
							className={toolIconButton}
						>
							<Trash2 className='h-4 w-4' />
						</Button>
					</div>
				</div>

				{/* Рабочая область: сам холст по центру. */}
				<div className='flex justify-center bg-muted/10 px-5 py-6 sm:px-6'>
					<canvas
						ref={canvasRef}
						width={CANVAS_DISPLAY_SIZE}
						height={CANVAS_DISPLAY_SIZE}
						onPointerDown={handlePointerDown}
						onPointerMove={handlePointerMove}
						onPointerUp={stopPainting}
						onPointerLeave={stopPainting}
						className='max-w-full touch-none rounded-lg border bg-white [image-rendering:pixelated] dark:bg-neutral-900'
						role='img'
						aria-label='Холст пиксель-арта'
					/>
				</div>

				{/* Нижняя полоса: инструмент, палитра и цвета. */}
				<div className={toolFooterBar}>
					<div className='flex items-center gap-1.5'>
						<button
							type='button'
							onClick={() => setTool('brush')}
							aria-pressed={tool === 'brush'}
							title='Кисть'
							className={toolPill(tool === 'brush')}
						>
							Кисть
						</button>
						<button
							type='button'
							onClick={() => setTool('eraser')}
							aria-pressed={tool === 'eraser'}
							title='Ластик'
							className={cn(
								toolPill(tool === 'eraser'),
								'inline-flex items-center gap-1'
							)}
						>
							<Eraser className='h-3.5 w-3.5' />
							Ластик
						</button>
					</div>

					<select
						value={paletteId}
						onChange={event => setPaletteId(event.target.value)}
						aria-label='Палитра'
						className='cursor-pointer rounded-md border bg-background px-2 py-1 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
					>
						{PIXEL_PALETTES.map(p => (
							<option key={p.id} value={p.id}>
								{p.name}
							</option>
						))}
					</select>

					<div className='flex flex-wrap items-center gap-1'>
						{palette.colors.map(color => (
							<button
								key={color}
								type='button'
								onClick={() => {
									setActiveColor(color)
									setTool('brush')
								}}
								title={color}
								aria-pressed={tool === 'brush' && activeColor === color}
								className={cn(
									'h-6 w-6 cursor-pointer rounded-md border transition-transform',
									tool === 'brush' && activeColor === color
										? 'scale-110 border-foreground ring-2 ring-ring'
										: 'border-border/50 hover:scale-105'
								)}
								style={{ backgroundColor: color }}
							/>
						))}
						<label
							title='Свой цвет'
							className='relative h-6 w-6 cursor-pointer overflow-hidden rounded-md border border-dashed border-border/50 hover:scale-105'
						>
							<input
								type='color'
								value={activeColor}
								onChange={event => {
									setActiveColor(event.target.value)
									setTool('brush')
								}}
								aria-label='Свой цвет'
								className='absolute -inset-2 cursor-pointer'
							/>
						</label>
					</div>
				</div>
			</Card>

			<PixelArtEditorSeo />
		</WidgetSEOWrapper>
	)
}
