'use client'

import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { useTheme } from 'next-themes'
import {
	ArrowLeftRight,
	Download,
	Eraser,
	Maximize2,
	Paintbrush,
	Redo2,
	Trash2,
	Undo2,
	Upload,
	ZoomIn,
	ZoomOut
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { toolBar, toolIconButton, toolPill } from '@/lib/ui/tool-pill'
import {
	createEmptyGrid,
	resizeGrid,
	imageDataToGrid,
	type PixelGrid
} from '@/lib/utils/pixel-art'
import {
	DEFAULT_PALETTE_ID,
	getPaletteById
} from '@/lib/constants/pixel-palettes'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { PixelArtEditorSeo } from './PixelArtEditorSeo'

const GRID_SIZES = [16, 32, 64] as const
type GridSize = (typeof GRID_SIZES)[number]

/** Разрешение канваса в собственных пикселях — зум меняет только CSS-размер
 *  (см. viewport ниже), поэтому вся математика попадания в клетку в paintAt
 *  остаётся верной на любом зуме: getBoundingClientRect() уже отражает
 *  фактический отображаемый размер. */
const CANVAS_DISPLAY_SIZE = 576

const ZOOM_MIN = 1
const ZOOM_MAX = 4
const ZOOM_STEP = 0.25

const MAX_HISTORY = 50
const RECENT_COLORS_LIMIT = 8

const STORAGE_KEY = 'pixel-art-editor-state'

interface StoredState {
	gridSize: GridSize
	grid: PixelGrid
}

interface Cell {
	row: number
	col: number
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

function clampZoom(value: number): number {
	return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, value))
}

export default function PixelArtEditorPage() {
	const widget = getWidgetById('pixel-art-editor')!
	const { resolvedTheme } = useTheme()
	const isDark = resolvedTheme === 'dark'

	const [gridSize, setGridSize] = useState<GridSize>(16)
	const [grid, setGrid] = useState<PixelGrid>(() => createEmptyGrid(16))
	const [primaryColor, setPrimaryColor] = useState('#000000')
	const [secondaryColor, setSecondaryColor] = useState('#ffffff')
	const [recentColors, setRecentColors] = useState<string[]>([])
	const [tool, setTool] = useState<'brush' | 'eraser'>('brush')
	const [hydrated, setHydrated] = useState(false)
	const [zoom, setZoom] = useState(1)
	const [past, setPast] = useState<PixelGrid[]>([])
	const [future, setFuture] = useState<PixelGrid[]>([])

	const canvasRef = useRef<HTMLCanvasElement>(null)
	const viewportRef = useRef<HTMLDivElement>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const paintButtonRef = useRef<0 | 2 | null>(null)
	const customColorRef = useRef(primaryColor)
	const zoomAnchorRef = useRef<{
		ratioX: number
		ratioY: number
		viewportX: number
		viewportY: number
	} | null>(null)

	// Всегда актуальная копия текущего рисунка для undo/redo и шорткатов —
	// эти обработчики не переподписываются на каждое изменение grid, поэтому
	// не могут просто взять его из замыкания.
	const gridRef = useRef(grid)
	useEffect(() => {
		gridRef.current = grid
	}, [grid])

	const colorsRef = useRef({ primary: primaryColor, secondary: secondaryColor })
	useEffect(() => {
		colorsRef.current = { primary: primaryColor, secondary: secondaryColor }
	}, [primaryColor, secondaryColor])

	// Единственная палитра — стандартная; выбор набора убрали из UI, но
	// getPaletteById всегда возвращает один и тот же объект из PIXEL_PALETTES,
	// так что ссылка стабильна между рендерами.
	const palette = getPaletteById(DEFAULT_PALETTE_ID)

	// Загрузка сохранённого рисунка — один раз при монтировании.
	useEffect(() => {
		const stored = loadStoredState()
		if (stored) {
			setGridSize(stored.gridSize)
			setGrid(stored.grid)
		}
		setHydrated(true)
	}, [])

	// Сохранение — после гидрации, с дебаунсом, чтобы не писать на каждый пиксель.
	useEffect(() => {
		if (!hydrated) return
		const timeout = setTimeout(() => {
			localStorage.setItem(STORAGE_KEY, JSON.stringify({ gridSize, grid }))
		}, 500)
		return () => clearTimeout(timeout)
	}, [hydrated, gridSize, grid])

	const cellSize = CANVAS_DISPLAY_SIZE / gridSize

	// Отрисовка сетки в canvas при любом изменении пикселей, зума или темы.
	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		// Шахматка под прозрачные клетки — иначе непонятно, что уйдёт в PNG
		// прозрачным: белый рисунок сливался с белым фоном канваса.
		const checkerA = isDark ? '#2b2b2b' : '#ffffff'
		const checkerB = isDark ? '#343434' : '#e8e8e8'

		for (let row = 0; row < gridSize; row++) {
			for (let col = 0; col < gridSize; col++) {
				const color = grid[row]?.[col]
				ctx.fillStyle = color ?? ((row + col) % 2 === 0 ? checkerA : checkerB)
				ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize)
			}
		}

		// Сетку прячем на мелких клетках (64×64 при zoom=1 — 7px на клетку) —
		// она там не помогает целиться, а только зашумляет рисунок.
		if (cellSize * zoom >= 8) {
			const lineColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)'
			const blockColor = isDark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.18)'
			ctx.lineWidth = 1
			for (let i = 0; i <= gridSize; i++) {
				ctx.strokeStyle = i % 8 === 0 ? blockColor : lineColor
				ctx.beginPath()
				ctx.moveTo(i * cellSize, 0)
				ctx.lineTo(i * cellSize, CANVAS_DISPLAY_SIZE)
				ctx.stroke()
				ctx.beginPath()
				ctx.moveTo(0, i * cellSize)
				ctx.lineTo(CANVAS_DISPLAY_SIZE, i * cellSize)
				ctx.stroke()
			}
		}
	}, [grid, gridSize, cellSize, zoom, isDark])

	function getCell(clientX: number, clientY: number): Cell | null {
		const canvas = canvasRef.current
		if (!canvas) return null
		const rect = canvas.getBoundingClientRect()
		const x = ((clientX - rect.left) / rect.width) * CANVAS_DISPLAY_SIZE
		const y = ((clientY - rect.top) / rect.height) * CANVAS_DISPLAY_SIZE
		const col = Math.floor(x / cellSize)
		const row = Math.floor(y / cellSize)
		if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return null
		return { row, col }
	}

	function paintCell(cell: Cell, button: 0 | 2) {
		const color =
			button === 2
				? colorsRef.current.secondary
				: tool === 'eraser'
					? null
					: colorsRef.current.primary

		setGrid(prev => {
			const next = prev.map(r => [...r])
			next[cell.row][cell.col] = color
			return next
		})
	}

	function pushHistory() {
		setPast(p => [...p, gridRef.current].slice(-MAX_HISTORY))
		setFuture([])
	}

	function undo() {
		setPast(p => {
			if (p.length === 0) return p
			const previous = p[p.length - 1]
			setFuture(f => [gridRef.current, ...f].slice(0, MAX_HISTORY))
			setGrid(previous)
			return p.slice(0, -1)
		})
	}

	function redo() {
		setFuture(f => {
			if (f.length === 0) return f
			const next = f[0]
			setPast(p => [...p, gridRef.current].slice(-MAX_HISTORY))
			setGrid(next)
			return f.slice(1)
		})
	}

	function handlePointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
		if (event.button !== 0 && event.button !== 2) return
		const cell = getCell(event.clientX, event.clientY)
		if (!cell) return
		paintButtonRef.current = event.button
		pushHistory()
		paintCell(cell, event.button)
	}

	function handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
		if (paintButtonRef.current === null) return
		const cell = getCell(event.clientX, event.clientY)
		if (cell) paintCell(cell, paintButtonRef.current)
	}

	function stopPainting() {
		paintButtonRef.current = null
	}

	function handleGridSizeChange(size: GridSize) {
		setGrid(prev => resizeGrid(prev, size))
		setGridSize(size)
		// Старая история — для другой размерности клеток, восстанавливать
		// в неё после ресайза уже нельзя.
		setPast([])
		setFuture([])
	}

	function clearCanvas() {
		pushHistory()
		setGrid(createEmptyGrid(gridSize))
	}

	function downloadPng() {
		const canvas = canvasRef.current
		if (!canvas) return
		const link = document.createElement('a')
		link.download = 'pixel-art.png'
		link.href = canvas.toDataURL('image/png')
		link.click()
	}

	function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
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
				pushHistory()
				setGrid(imageDataToGrid(imageData, gridSize, palette.colors))
			}
			img.src = e.target?.result as string
		}
		reader.readAsDataURL(file)
		// Позволяет загрузить тот же файл повторно после очистки.
		event.target.value = ''
	}

	function previewPrimaryColor(color: string) {
		setPrimaryColor(color)
		setTool('brush')
	}

	function recordRecentColor(color: string) {
		setRecentColors(prev =>
			[color, ...prev.filter(c => c !== color)].slice(0, RECENT_COLORS_LIMIT)
		)
	}

	function selectPrimaryColor(color: string) {
		previewPrimaryColor(color)
		recordRecentColor(color)
	}

	function swapColors() {
		const { primary, secondary } = colorsRef.current
		setPrimaryColor(secondary)
		setSecondaryColor(primary)
	}

	function zoomBy(delta: number) {
		zoomAnchorRef.current = null
		setZoom(z => clampZoom(z + delta))
	}

	function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
		event.preventDefault()
		const container = viewportRef.current
		if (!container) return

		const rect = container.getBoundingClientRect()
		const viewportX = event.clientX - rect.left
		const viewportY = event.clientY - rect.top
		const oldSize = CANVAS_DISPLAY_SIZE * zoom
		const ratioX = (container.scrollLeft + viewportX) / oldSize
		const ratioY = (container.scrollTop + viewportY) / oldSize

		const newZoom = clampZoom(
			zoom + (event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP)
		)
		if (newZoom === zoom) return

		zoomAnchorRef.current = { ratioX, ratioY, viewportX, viewportY }
		setZoom(newZoom)
	}

	// Держит точку под курсором на месте при зуме колесом — без этого
	// зум "уезжает" в угол канваса, а не туда, куда смотрит пользователь.
	useLayoutEffect(() => {
		const anchor = zoomAnchorRef.current
		const container = viewportRef.current
		if (!anchor || !container) return
		zoomAnchorRef.current = null
		const newSize = CANVAS_DISPLAY_SIZE * zoom
		container.scrollLeft = anchor.ratioX * newSize - anchor.viewportX
		container.scrollTop = anchor.ratioY * newSize - anchor.viewportY
	}, [zoom])

	// Клавиши: B/E — инструмент, X — свап цветов, 1–9 — цвет из палитры,
	// Ctrl/Cmd+Z — отменить, Ctrl/Cmd+Shift+Z — вернуть.
	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			const target = event.target as HTMLElement | null
			if (target && ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) {
				return
			}

			if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
				event.preventDefault()
				if (event.shiftKey) redo()
				else undo()
				return
			}

			const key = event.key.toLowerCase()
			if (key === 'b') setTool('brush')
			if (key === 'e') setTool('eraser')
			if (key === 'x') swapColors()
			if (/^[1-9]$/.test(event.key)) {
				const color = palette.colors[Number(event.key) - 1]
				if (color) selectPrimaryColor(color)
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
		// undo/redo/swapColors/selectPrimaryColor не зависят от замыкания — они
		// либо читают состояние из ref, либо используют функциональные setState,
		// поэтому пересоздавать подписку при каждом их обновлении не нужно.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [palette])

	const hasContent = grid.some(row => row.some(cell => cell !== null))
	const viewportSize = CANVAS_DISPLAY_SIZE * zoom

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				{/* Шапка: размер сетки и история слева, действия справа. */}
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

						<div className='mx-1 h-5 w-px bg-border' aria-hidden />

						<Button
							size='icon'
							variant='ghost'
							onClick={undo}
							disabled={past.length === 0}
							title='Отменить (Ctrl+Z)'
							className={toolIconButton}
						>
							<Undo2 className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={redo}
							disabled={future.length === 0}
							title='Вернуть (Ctrl+Shift+Z)'
							className={toolIconButton}
						>
							<Redo2 className='h-4 w-4' />
						</Button>
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

				{/* Рабочая область: холст в центре, палитра и инструмент справа. */}
				<div className='flex flex-col gap-4 bg-muted/10 p-5 sm:p-6 lg:flex-row lg:items-stretch'>
					<div className='flex min-w-0 flex-1 flex-col items-center justify-center gap-3'>
						<div className='flex items-center gap-1 self-center'>
							<Button
								size='icon'
								variant='ghost'
								onClick={() => zoomBy(-ZOOM_STEP)}
								disabled={zoom <= ZOOM_MIN}
								title='Уменьшить'
								className={toolIconButton}
							>
								<ZoomOut className='h-4 w-4' />
							</Button>
							<span className='w-12 text-center text-sm text-muted-foreground tabular-nums'>
								{Math.round(zoom * 100)}%
							</span>
							<Button
								size='icon'
								variant='ghost'
								onClick={() => zoomBy(ZOOM_STEP)}
								disabled={zoom >= ZOOM_MAX}
								title='Увеличить'
								className={toolIconButton}
							>
								<ZoomIn className='h-4 w-4' />
							</Button>
							<Button
								size='icon'
								variant='ghost'
								onClick={() => zoomBy(1 - zoom)}
								disabled={zoom === 1}
								title='Сбросить масштаб'
								className={toolIconButton}
							>
								<Maximize2 className='h-4 w-4' />
							</Button>
						</div>

						<div
							ref={viewportRef}
							onWheel={handleWheel}
							className='max-h-[36rem] w-full max-w-[36rem] overflow-auto rounded-lg border bg-background'
						>
							<div
								className='relative mx-auto'
								style={{ width: viewportSize, height: viewportSize }}
							>
								<canvas
									ref={canvasRef}
									width={CANVAS_DISPLAY_SIZE}
									height={CANVAS_DISPLAY_SIZE}
									onPointerDown={handlePointerDown}
									onPointerMove={handlePointerMove}
									onPointerUp={stopPainting}
									onPointerLeave={stopPainting}
									onContextMenu={event => event.preventDefault()}
									className='absolute inset-0 h-full w-full cursor-crosshair touch-none [image-rendering:pixelated]'
									role='img'
									aria-label='Холст пиксель-арта'
								/>
							</div>
						</div>
					</div>

					<div className='flex w-full shrink-0 flex-col gap-3 rounded-xl border bg-background p-2 lg:w-36'>
						<div className='flex w-full items-center justify-between gap-1.5 rounded-full bg-muted/40 px-2 py-1.5'>
							<Paintbrush
								className={cn(
									'h-4 w-4 transition-colors',
									tool === 'brush'
										? 'text-foreground'
										: 'text-muted-foreground/40'
								)}
							/>
							<Switch
								checked={tool === 'eraser'}
								onCheckedChange={checked =>
									setTool(checked ? 'eraser' : 'brush')
								}
								title='Кисть / Ластик (B/E)'
								aria-label='Переключить между кистью и ластиком'
							/>
							<Eraser
								className={cn(
									'h-4 w-4 transition-colors',
									tool === 'eraser'
										? 'text-foreground'
										: 'text-muted-foreground/40'
								)}
							/>
						</div>

						<div className='flex items-center gap-2'>
							<div
								className='relative h-11 w-11 shrink-0'
								title='ПКМ на холсте красит вторичным цветом'
							>
								<button
									type='button'
									title={`Основной цвет: ${primaryColor}`}
									className='absolute left-0 top-0 h-8 w-8 rounded-md border-2 border-background shadow-sm'
									style={{ backgroundColor: primaryColor }}
								/>
								<button
									type='button'
									onClick={swapColors}
									title={`Вторичный цвет: ${secondaryColor}`}
									className='absolute bottom-0 right-0 h-8 w-8 cursor-pointer rounded-md border-2 border-background shadow-sm'
									style={{ backgroundColor: secondaryColor }}
								/>
							</div>
							<Button
								size='icon'
								variant='ghost'
								onClick={swapColors}
								title='Поменять местами (X)'
								className={toolIconButton}
							>
								<ArrowLeftRight className='h-4 w-4' />
							</Button>
						</div>

						{recentColors.length > 0 && (
							<div className='flex flex-wrap items-center gap-1'>
								{recentColors.map((color, index) => (
									<button
										key={`${color}-${index}`}
										type='button'
										onClick={() => selectPrimaryColor(color)}
										title={color}
										className={cn(
											'h-5 w-5 cursor-pointer rounded-full border transition-transform hover:scale-110',
											primaryColor === color
												? 'border-foreground ring-1 ring-ring'
												: 'border-border/50'
										)}
										style={{ backgroundColor: color }}
									/>
								))}
							</div>
						)}

						<div className='flex flex-wrap gap-1.5'>
							{palette.colors.map(color => (
								<button
									key={color}
									type='button'
									onClick={() => selectPrimaryColor(color)}
									title={color}
									aria-pressed={tool === 'brush' && primaryColor === color}
									className={cn(
										'h-9 w-9 cursor-pointer rounded-md border transition-transform',
										tool === 'brush' && primaryColor === color
											? 'scale-110 border-foreground ring-2 ring-ring'
											: 'border-border/50 hover:scale-105'
									)}
									style={{ backgroundColor: color }}
								/>
							))}
							<label
								title='Свой цвет'
								className='relative h-9 w-9 cursor-pointer overflow-hidden rounded-md border border-dashed border-border/50 hover:scale-105'
							>
								<input
									type='color'
									value={primaryColor}
									onChange={event => {
										customColorRef.current = event.target.value
										previewPrimaryColor(event.target.value)
									}}
									onBlur={() => recordRecentColor(customColorRef.current)}
									aria-label='Свой цвет'
									className='absolute -inset-2 cursor-pointer'
								/>
							</label>
						</div>
					</div>
				</div>
			</Card>

			<PixelArtEditorSeo />
		</WidgetSEOWrapper>
	)
}
