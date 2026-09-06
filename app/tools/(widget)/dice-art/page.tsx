'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Copy, Check, Download, Trash2, Upload, ImageIcon } from 'lucide-react'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill,
	toolToggleOption,
	toolToggleTrack
} from '@/lib/ui/tool-pill'
import { cn } from '@/lib/utils'
import {
	DICE_LEVELS,
	DOMINO_LEVELS,
	DOMINO_RATIO,
	dominoGlyph,
	drawDie,
	drawDomino
} from './DiceCanvas'
import { DiceArtSeo } from './DiceArtSeo'

/**
 * Наборы. У костей уровни считает DiceCanvas — там же объяснено, почему их
 * двенадцать, а не шесть. Текстовые наборы идут от светлого к тёмному.
 */
const BRAILLE_GLYPHS = ['⠀', '⠁', '⠃', '⠇', '⡇', '⡏', '⡟', '⡿', '⣿'] as const

// Текстовая запись костей — те же шесть граней Unicode. Цвет кубика в текст
// не переносится, поэтому копия и картинка у костей отличаются: см. подпись
// под результатом.
const DICE_GLYPHS = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'] as const

type SetKey = 'dice' | 'braille' | 'domino'

const SETS: Record<
	SetKey,
	{ label: string; levels: number; ratio: number; hint: string }
> = {
	dice: {
		label: 'Кости',
		levels: DICE_LEVELS,
		ratio: 1,
		hint: 'Шесть градаций, все кости одного цвета — чем плотнее сетка, тем лучше читается'
	},
	braille: {
		label: 'Брайль',
		levels: BRAILLE_GLYPHS.length,
		ratio: 1,
		hint: '9 градаций — мелкие детали читаются лучше всего'
	},
	domino: {
		label: 'Домино',
		levels: DOMINO_LEVELS,
		// Костяшка вдвое выше своей ширины, и сетка считается под неё: иначе
		// картинка растянулась бы по вертикали ровно вдвое.
		ratio: DOMINO_RATIO,
		hint: '13 градаций по сумме точек — от пустой костяшки до 6–6'
	}
}

/**
 * Картинка-пример, с которой страница открывается.
 *
 * Рисуется кодом, а не грузится файлом: лишний запрос ради заставки не нужен,
 * а нарисованный кубик даёт то, что для шести градаций подходит лучше всего —
 * крупную контрастную форму с мягкой тенью, на которой сразу видно, как
 * полутон собирается из граней.
 */
function buildSampleImage(): HTMLCanvasElement {
	const canvas = document.createElement('canvas')
	canvas.width = 900
	canvas.height = 900
	const ctx = canvas.getContext('2d')
	if (!ctx) return canvas

	const bg = ctx.createLinearGradient(0, 0, 900, 900)
	bg.addColorStop(0, '#f4f6f9')
	bg.addColorStop(1, '#c8d0da')
	ctx.fillStyle = bg
	ctx.fillRect(0, 0, 900, 900)

	ctx.save()
	ctx.translate(450, 470)
	ctx.rotate(-0.14)

	ctx.shadowColor = 'rgba(20, 26, 33, 0.45)'
	ctx.shadowBlur = 70
	ctx.shadowOffsetY = 40
	const side = 520
	const face = ctx.createLinearGradient(
		-side / 2,
		-side / 2,
		side / 2,
		side / 2
	)
	face.addColorStop(0, '#2b3440')
	face.addColorStop(1, '#12171d')
	ctx.fillStyle = face
	ctx.beginPath()
	ctx.roundRect(-side / 2, -side / 2, side, side, side * 0.16)
	ctx.fill()
	ctx.shadowColor = 'transparent'

	// Пятёрка: по ней хорошо видно и центр, и углы.
	ctx.fillStyle = '#f7f9fb'
	const offset = side * 0.26
	const pip = side * 0.075
	for (const [px, py] of [
		[-offset, -offset],
		[offset, -offset],
		[0, 0],
		[-offset, offset],
		[offset, offset]
	]) {
		ctx.beginPath()
		ctx.arc(px, py, pip, 0, Math.PI * 2)
		ctx.fill()
	}
	ctx.restore()

	return canvas
}

const MIN_COLS = 12
const MAX_COLS = 100
// Плотнее, чем хотелось бы для скорости: у одноцветных костей всего шесть
// градаций, и на сетке уже, чем полсотни клеток, портрет не собирается —
// проверено на снимках, при 40 клетках лицо разваливается, при 60 читается.
const DEFAULT_COLS = 56
const PREVIEW_CELL = 15
const EXPORT_CELL = 30

type Grid = {
	levels: number[][]
	colors: string[][]
	cols: number
	rowCount: number
	/** Сколько костей повернуть каждой гранью: pipCounts[0] — единицами вверх. */
	pipCounts: number[]
}

export default function DiceArtPage() {
	const widget = getWidgetById('dice-art')!

	const fileInputRef = useRef<HTMLInputElement>(null)
	const sourceRef = useRef<HTMLCanvasElement | null>(null)
	const previewRef = useRef<HTMLCanvasElement>(null)

	const [imageVersion, setImageVersion] = useState(0)
	// Страница открывается с примером, а не с пустой рамкой: инструмент такого
	// рода объясняется одной картинкой быстрее, чем любым описанием.
	const [isSample, setIsSample] = useState(true)
	const [cols, setCols] = useState(DEFAULT_COLS)
	const [setKey, setSetKey] = useState<SetKey>('dice')
	const [invert, setInvert] = useState(false)
	const [dither, setDither] = useState(true)
	const [colored, setColored] = useState(false)
	// Цвет всего набора: мозаику выкладывают из одинаковых костей, поэтому это
	// один переключатель на всю работу, а не свойство отдельной клетки.
	const [darkDice, setDarkDice] = useState(false)
	const [isDragging, setIsDragging] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [copied, setCopied] = useState(false)

	const hasImage = imageVersion > 0
	const levelCount = SETS[setKey].levels
	const cellRatio = SETS[setKey].ratio

	const showSample = useCallback(() => {
		sourceRef.current = buildSampleImage()
		setIsSample(true)
		setErrorMessage(null)
		setImageVersion(v => v + 1)
	}, [])

	useEffect(() => {
		showSample()
	}, [showSample])

	const grid = useMemo<Grid | null>(() => {
		if (!hasImage) return null
		const source = sourceRef.current
		const ctx = source?.getContext('2d', { willReadFrequently: true })
		if (!source || !ctx) return null

		// Ширина клетки задаётся сеткой, высота — пропорцией фигуры набора:
		// кость и брайлевская клетка квадратные, костяшка домино вдвое выше.
		const cellW = source.width / cols
		const cellH = cellW * cellRatio
		const rowCount = Math.max(1, Math.floor(source.height / cellH))
		const { data } = ctx.getImageData(0, 0, source.width, source.height)

		// Шаг 1. Средняя яркость и средний цвет каждой клетки.
		const values = new Float32Array(cols * rowCount)
		const colors: string[][] = []

		for (let row = 0; row < rowCount; row++) {
			const rowColors: string[] = []
			for (let col = 0; col < cols; col++) {
				const x0 = Math.floor(col * cellW)
				const x1 = Math.min(source.width, Math.ceil((col + 1) * cellW))
				const y0 = Math.floor(row * cellH)
				const y1 = Math.min(source.height, Math.ceil((row + 1) * cellH))

				let r = 0
				let g = 0
				let b = 0
				let count = 0
				for (let y = y0; y < y1; y++) {
					for (let x = x0; x < x1; x++) {
						const i = (y * source.width + x) * 4
						r += data[i]
						g += data[i + 1]
						b += data[i + 2]
						count++
					}
				}
				if (count) {
					r /= count
					g /= count
					b /= count
				}
				// Стандартные веса яркости: глаз чувствительнее к зелёному, без них
				// красное и синее одинаковой светлоты дают разные грани.
				values[row * cols + col] = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
				rowColors.push(
					`rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
				)
			}
			colors.push(rowColors)
		}

		// Шаг 2. Растяжение контраста по краевым перцентилям.
		//
		// Обязательный шаг, а не украшение: градаций мало, и обычная фотография
		// с яркостями в диапазоне, скажем, 0.3–0.7 схлопывается в две-три грани.
		// Берём 2-й и 98-й перцентили, а не минимум с максимумом: одна
		// пересвеченная точка или чёрная тень иначе задирает шкалу.
		const sorted = Float32Array.from(values).sort()
		const low = sorted[Math.floor(sorted.length * 0.02)]
		const high = sorted[Math.ceil(sorted.length * 0.98) - 1]
		const span = Math.max(0.05, high - low)
		for (let i = 0; i < values.length; i++) {
			const normalized = (values[i] - low) / span
			values[i] = Math.min(1, Math.max(0, invert ? 1 - normalized : normalized))
		}

		// Шаг 3. Квантование с переносом ошибки по Флойду–Стейнбергу.
		//
		// Дизеринг размазывает разницу между точной яркостью клетки и ближайшей
		// градацией по соседям справа и снизу. На десятке градаций это разница
		// между «узнаётся лицо» и «поле одинаковых кубиков»: плавные переходы
		// получаются чередованием граней, как в газетной растровой печати.
		const last = levelCount - 1
		const levels: number[][] = []
		const pipCounts = new Array(levelCount).fill(0)

		for (let row = 0; row < rowCount; row++) {
			const line: number[] = []
			for (let col = 0; col < cols; col++) {
				const i = row * cols + col
				const value = Math.min(1, Math.max(0, values[i]))
				// value = 1 это свет, а нулевой уровень набора — самый светлый.
				const level = Math.round((1 - value) * last)
				line.push(level)
				pipCounts[level]++

				if (!dither) continue
				const error = value - (1 - level / last)
				const spread = (dx: number, dy: number, weight: number) => {
					const nx = col + dx
					const ny = row + dy
					if (nx < 0 || nx >= cols || ny >= rowCount) return
					values[ny * cols + nx] += error * weight
				}
				spread(1, 0, 7 / 16)
				spread(-1, 1, 3 / 16)
				spread(0, 1, 5 / 16)
				spread(1, 1, 1 / 16)
			}
			levels.push(line)
		}

		return { levels, colors, cols, rowCount, pipCounts }
		// imageVersion — единственный сигнал о том, что sourceRef сменился:
		// сама картинка живёт в ref, и линтер её не видит.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasImage, imageVersion, cols, levelCount, cellRatio, invert, dither])

	/** Одна отрисовка на превью и на экспорт — меняется только размер клетки. */
	const paint = useCallback(
		(canvas: HTMLCanvasElement, cell: number, ratio: number) => {
			if (!grid) return
			const ctx = canvas.getContext('2d')
			if (!ctx) return

			const cellW = cell
			const cellH = cell * cellRatio
			canvas.width = grid.cols * cellW * ratio
			canvas.height = grid.rowCount * cellH * ratio
			ctx.scale(ratio, ratio)
			ctx.fillStyle = '#ffffff'
			ctx.fillRect(0, 0, canvas.width, canvas.height)

			if (setKey === 'braille') {
				ctx.font = `${cellW}px ui-monospace, SFMono-Regular, Menlo, monospace`
				ctx.textAlign = 'center'
				ctx.textBaseline = 'middle'
				grid.levels.forEach((row, y) =>
					row.forEach((level, x) => {
						ctx.fillStyle = colored ? grid.colors[y][x] : '#16181d'
						ctx.fillText(
							BRAILLE_GLYPHS[Math.min(level, BRAILLE_GLYPHS.length - 1)],
							x * cellW + cellW / 2,
							y * cellH + cellH / 2
						)
					})
				)
				return
			}

			// Тёмный набор рисуем на тёмном фоне: белые поля между чёрными
			// фишками читались бы как сетка и съедали бы весь полутон.
			if (darkDice) {
				ctx.fillStyle = '#0a0b0e'
				ctx.fillRect(0, 0, canvas.width, canvas.height)
			}

			grid.levels.forEach((row, y) =>
				row.forEach((level, x) => {
					if (setKey === 'domino') {
						drawDomino(ctx, x * cellW, y * cellH, cellW, cellH, level, darkDice)
						return
					}
					drawDie(ctx, x * cellW, y * cellH, cellW, level + 1, darkDice)
				})
			)
		},
		[grid, setKey, colored, darkDice, cellRatio]
	)

	useEffect(() => {
		const canvas = previewRef.current
		if (!canvas || !grid) return
		paint(canvas, PREVIEW_CELL, Math.min(window.devicePixelRatio || 1, 2))
	}, [grid, paint])

	// Текстовая копия — те же грани символами Unicode. Набор одноцветный, так
	// что текст и картинка совпадают клетка в клетку.
	const text = useMemo(() => {
		if (!grid) return ''
		return grid.levels
			.map(row =>
				row
					.map(level => {
						if (setKey === 'dice') return DICE_GLYPHS[level]
						if (setKey === 'domino') return dominoGlyph(level)
						return BRAILLE_GLYPHS[Math.min(level, BRAILLE_GLYPHS.length - 1)]
					})
					.join('')
			)
			.join('\n')
	}, [grid, setKey])

	const total = grid ? grid.cols * grid.rowCount : 0

	const loadFile = (file: File) => {
		setErrorMessage(null)
		if (file.type && !file.type.startsWith('image/')) {
			setErrorMessage('Это не изображение — нужен файл JPG, PNG, WebP или GIF')
			return
		}

		const url = URL.createObjectURL(file)
		const image = new window.Image()
		image.onload = () => {
			// Исходник ужимаем: для сетки в сотню клеток мегапиксели не нужны, а
			// getImageData по полноразмерному фото на телефоне заметно тормозит.
			const scale = Math.min(1, 900 / Math.max(image.width, image.height))
			const canvas = document.createElement('canvas')
			canvas.width = Math.max(1, Math.round(image.width * scale))
			canvas.height = Math.max(1, Math.round(image.height * scale))
			const ctx = canvas.getContext('2d', { willReadFrequently: true })
			if (!ctx) {
				setErrorMessage('Браузер не дал холст для обработки картинки')
				URL.revokeObjectURL(url)
				return
			}
			ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
			sourceRef.current = canvas
			setIsSample(false)
			setImageVersion(v => v + 1)
			URL.revokeObjectURL(url)
		}
		image.onerror = () => {
			setErrorMessage('Не удалось прочитать изображение')
			URL.revokeObjectURL(url)
		}
		image.src = url
	}

	const reset = showSample

	const copyText = () => {
		if (!text) return
		navigator.clipboard.writeText(text)
		setCopied(true)
	}

	useEffect(() => {
		if (!copied) return
		const timer = setTimeout(() => setCopied(false), 2000)
		return () => clearTimeout(timer)
	}, [copied])

	const downloadText = () => {
		if (!text) return
		const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
		const url = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.download = 'dice-art.txt'
		link.click()
		URL.revokeObjectURL(url)
	}

	const downloadImage = () => {
		if (!grid) return
		const canvas = document.createElement('canvas')
		paint(canvas, EXPORT_CELL, 1)
		canvas.toBlob(blob => {
			if (!blob) return
			const url = URL.createObjectURL(blob)
			const link = document.createElement('a')
			link.href = url
			link.download = 'dice-art.png'
			link.click()
			URL.revokeObjectURL(url)
		}, 'image/png')
	}

	const dropHandlers = {
		onDragOver: (event: React.DragEvent) => {
			event.preventDefault()
			setIsDragging(true)
		},
		onDragLeave: () => setIsDragging(false),
		onDrop: (event: React.DragEvent) => {
			event.preventDefault()
			setIsDragging(false)
			const file = event.dataTransfer.files?.[0]
			if (file) loadFile(file)
		}
	}

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card
				className={cn(
					'overflow-hidden p-0 transition-colors',
					isDragging && 'ring-2 ring-primary ring-inset'
				)}
				{...dropHandlers}
			>
				<div className={toolBar}>
					<div className={toolToggleTrack}>
						{(Object.keys(SETS) as SetKey[]).map(key => (
							<button
								key={key}
								type='button'
								onClick={() => setSetKey(key)}
								aria-pressed={setKey === key}
								className={toolToggleOption(setKey === key)}
							>
								{SETS[key].label}
							</button>
						))}
					</div>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={copyText}
							disabled={!text}
							title='Скопировать текстом'
							className={toolIconButton}
						>
							{copied ? (
								<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
							) : (
								<Copy className='h-4 w-4' />
							)}
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={downloadImage}
							disabled={!grid}
							title='Скачать картинкой'
							className={toolIconButton}
						>
							<ImageIcon className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={downloadText}
							disabled={!text}
							title='Скачать текстом'
							className={toolIconButton}
						>
							<Download className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => fileInputRef.current?.click()}
							title={hasImage ? 'Выбрать другое фото' : 'Загрузить фото'}
							className={toolIconButton}
						>
							<Upload className='h-4 w-4' />
						</Button>
						{!isSample && (
							<Button
								size='icon'
								variant='ghost'
								onClick={reset}
								title='Убрать фото и вернуть пример'
								className={toolIconButton}
							>
								<Trash2 className='h-4 w-4' />
							</Button>
						)}
					</div>
				</div>

				<input
					ref={fileInputRef}
					type='file'
					accept='image/*'
					onChange={event => {
						const file = event.target.files?.[0]
						if (file) loadFile(file)
						event.target.value = ''
					}}
					aria-label='Загрузить фото'
					className='hidden'
				/>

				<div className='overflow-x-auto px-0 py-4 sm:px-6 sm:py-6'>
					<canvas
						ref={previewRef}
						aria-label={
							isSample ? 'Пример: мозаика из костей' : 'Мозаика из костей'
						}
						className='mx-auto block h-auto max-w-full'
						style={grid ? { width: grid.cols * PREVIEW_CELL } : undefined}
					/>
				</div>

				{errorMessage && (
					<p className='px-5 pb-4 text-sm text-destructive sm:px-6'>
						{errorMessage}
					</p>
				)}

				{isSample && (
					<div className='flex flex-wrap items-center gap-x-2 gap-y-1 border-t px-5 py-3 text-sm text-muted-foreground sm:px-6'>
						<span>Это пример.</span>
						<button
							type='button'
							onClick={() => fileInputRef.current?.click()}
							className='cursor-pointer font-medium text-primary hover:underline'
						>
							Загрузите своё фото
						</button>
						<span>
							или перетащите его сюда — лучше всего выходят контрастные кадры:
							портрет крупным планом, силуэт, логотип.
						</span>
					</div>
				)}

				<div className={toolFooterBar}>
					<label className='flex min-w-[13rem] flex-1 items-center gap-3 text-sm'>
						<span className='shrink-0 text-muted-foreground'>ширина</span>
						<Slider
							value={[cols]}
							onValueChange={value => setCols(value[0])}
							min={MIN_COLS}
							max={MAX_COLS}
							step={1}
							aria-label='Ширина сетки в костях'
							className='flex-1'
						/>
						<span className='w-16 shrink-0 font-mono tabular-nums'>
							{cols} шт
						</span>
					</label>

					<button
						type='button'
						onClick={() => setInvert(!invert)}
						aria-pressed={invert}
						className={toolPill(invert)}
					>
						инверсия
					</button>

					<button
						type='button'
						onClick={() => setDither(!dither)}
						aria-pressed={dither}
						className={toolPill(dither)}
					>
						дизеринг
					</button>

					{setKey !== 'braille' ? (
						<button
							type='button'
							onClick={() => setDarkDice(!darkDice)}
							aria-pressed={darkDice}
							className={toolPill(darkDice)}
						>
							{setKey === 'dice' ? 'чёрные кости' : 'чёрное домино'}
						</button>
					) : (
						<button
							type='button'
							onClick={() => setColored(!colored)}
							aria-pressed={colored}
							className={toolPill(colored)}
						>
							цвет
						</button>
					)}
				</div>

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						{SETS[setKey].hint}
					</span>
					{grid && (
						<span className='text-sm text-muted-foreground sm:ml-auto'>
							сетка{' '}
							<span className='font-mono tabular-nums text-foreground'>
								{grid.cols}×{grid.rowCount}
							</span>
							{setKey === 'braille' ? ', клеток ' : ', фишек '}
							<span className='font-mono tabular-nums text-foreground'>
								{total}
							</span>
						</span>
					)}
				</div>

				{/* Раскладка по граням — то, что нужно при настоящей выкладке: все
				    кости одинаковые, разница только в том, какой гранью повернуть. */}
				{grid && setKey !== 'braille' && (
					<div className='flex flex-wrap items-center gap-x-4 gap-y-2 border-t px-5 py-3 text-sm sm:px-6'>
						<span className='text-muted-foreground'>
							{setKey === 'dice' ? 'гранями вверх' : 'костяшек'}
						</span>
						{grid.pipCounts.map((count, index) => (
							<span key={index} className='flex items-center gap-1.5'>
								<span className='text-muted-foreground'>
									{setKey === 'dice' ? DICE_GLYPHS[index] : dominoGlyph(index)}
								</span>
								<span className='font-mono tabular-nums'>{count}</span>
							</span>
						))}
					</div>
				)}
			</Card>

			<DiceArtSeo />
		</WidgetSEOWrapper>
	)
}
