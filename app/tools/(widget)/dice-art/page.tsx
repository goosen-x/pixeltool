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
import { DICE_LEVELS, drawDie, levelToDie } from './DiceCanvas'
import { DiceArtSeo } from './DiceArtSeo'

/**
 * Наборы. У костей уровни считает DiceCanvas — там же объяснено, почему их
 * двенадцать, а не шесть. Текстовые наборы идут от светлого к тёмному.
 */
const GLYPH_SETS = {
	braille: ['⠀', '⠁', '⠃', '⠇', '⡇', '⡏', '⡟', '⡿', '⣿'],
	domino: [
		'\u{1F063}',
		'\u{1F064}',
		'\u{1F06B}',
		'\u{1F072}',
		'\u{1F079}',
		'\u{1F080}',
		'\u{1F087}',
		'\u{1F08E}',
		'\u{1F095}',
		'\u{1F09C}'
	]
} as const

// Текстовая запись костей — те же шесть граней Unicode. Цвет кубика в текст
// не переносится, поэтому копия и картинка у костей отличаются: см. подпись
// под результатом.
const DICE_GLYPHS = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'] as const

type SetKey = 'dice' | 'braille' | 'domino'

const SETS: Record<SetKey, { label: string; levels: number; hint: string }> = {
	dice: {
		label: 'Кости',
		levels: DICE_LEVELS,
		hint: '12 градаций: белые кубики от одной точки к шести, дальше чёрные'
	},
	braille: {
		label: 'Брайль',
		levels: GLYPH_SETS.braille.length,
		hint: '9 градаций — мелкие детали читаются лучше всего'
	},
	domino: {
		label: 'Домино',
		levels: GLYPH_SETS.domino.length,
		hint: '10 градаций, но домино рисуют не все шрифты'
	}
}

const MIN_COLS = 12
const MAX_COLS = 100
const DEFAULT_COLS = 40
const PREVIEW_CELL = 15
const EXPORT_CELL = 30

type Grid = {
	levels: number[][]
	colors: string[][]
	cols: number
	rowCount: number
	white: number
	black: number
}

export default function DiceArtPage() {
	const widget = getWidgetById('dice-art')!

	const fileInputRef = useRef<HTMLInputElement>(null)
	const sourceRef = useRef<HTMLCanvasElement | null>(null)
	const previewRef = useRef<HTMLCanvasElement>(null)

	const [imageVersion, setImageVersion] = useState(0)
	const [cols, setCols] = useState(DEFAULT_COLS)
	const [setKey, setSetKey] = useState<SetKey>('dice')
	const [invert, setInvert] = useState(false)
	const [dither, setDither] = useState(true)
	const [colored, setColored] = useState(false)
	const [isDragging, setIsDragging] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [copied, setCopied] = useState(false)

	const hasImage = imageVersion > 0
	const levelCount = SETS[setKey].levels

	const grid = useMemo<Grid | null>(() => {
		if (!hasImage) return null
		const source = sourceRef.current
		const ctx = source?.getContext('2d', { willReadFrequently: true })
		if (!source || !ctx) return null

		// Клетка квадратная: и превью, и экспорт рисуют квадратами, так что
		// подгонять сетку под пропорции шрифта не нужно.
		const cell = source.width / cols
		const rowCount = Math.max(1, Math.floor(source.height / cell))
		const { data } = ctx.getImageData(0, 0, source.width, source.height)

		// Шаг 1. Средняя яркость и средний цвет каждой клетки.
		const values = new Float32Array(cols * rowCount)
		const colors: string[][] = []

		for (let row = 0; row < rowCount; row++) {
			const rowColors: string[] = []
			for (let col = 0; col < cols; col++) {
				const x0 = Math.floor(col * cell)
				const x1 = Math.min(source.width, Math.ceil((col + 1) * cell))
				const y0 = Math.floor(row * cell)
				const y1 = Math.min(source.height, Math.ceil((row + 1) * cell))

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
		let white = 0
		let black = 0

		for (let row = 0; row < rowCount; row++) {
			const line: number[] = []
			for (let col = 0; col < cols; col++) {
				const i = row * cols + col
				const value = Math.min(1, Math.max(0, values[i]))
				// value = 1 это свет, а нулевой уровень набора — самый светлый.
				const level = Math.round((1 - value) * last)
				line.push(level)

				if (setKey === 'dice') {
					if (levelToDie(level).dark) black++
					else white++
				}

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

		return { levels, colors, cols, rowCount, white, black }
	}, [hasImage, imageVersion, cols, setKey, levelCount, invert, dither])

	/** Одна отрисовка на превью и на экспорт — меняется только размер клетки. */
	const paint = useCallback(
		(canvas: HTMLCanvasElement, cell: number, ratio: number) => {
			if (!grid) return
			const ctx = canvas.getContext('2d')
			if (!ctx) return

			canvas.width = grid.cols * cell * ratio
			canvas.height = grid.rowCount * cell * ratio
			ctx.scale(ratio, ratio)
			ctx.fillStyle = '#ffffff'
			ctx.fillRect(0, 0, canvas.width, canvas.height)

			if (setKey !== 'dice') {
				const glyphs = GLYPH_SETS[setKey]
				ctx.font = `${cell}px ui-monospace, SFMono-Regular, Menlo, monospace`
				ctx.textAlign = 'center'
				ctx.textBaseline = 'middle'
				grid.levels.forEach((row, y) =>
					row.forEach((level, x) => {
						ctx.fillStyle = colored ? grid.colors[y][x] : '#16181d'
						ctx.fillText(
							glyphs[Math.min(level, glyphs.length - 1)],
							x * cell + cell / 2,
							y * cell + cell / 2
						)
					})
				)
				return
			}

			grid.levels.forEach((row, y) =>
				row.forEach((level, x) => {
					const { pips, dark } = levelToDie(level)
					drawDie(ctx, x * cell, y * cell, cell, pips, dark)
				})
			)
		},
		[grid, setKey, colored]
	)

	useEffect(() => {
		const canvas = previewRef.current
		if (!canvas || !grid) return
		paint(canvas, PREVIEW_CELL, Math.min(window.devicePixelRatio || 1, 2))
	}, [grid, paint])

	// Текстовая копия. У костей цвет кубика символом не выразить, поэтому в
	// тексте остаются шесть граней Unicode — об этом сказано под результатом.
	const text = useMemo(() => {
		if (!grid) return ''
		return grid.levels
			.map(row =>
				row
					.map(level => {
						if (setKey === 'dice') {
							return DICE_GLYPHS[levelToDie(level).pips - 1]
						}
						const glyphs = GLYPH_SETS[setKey]
						return glyphs[Math.min(level, glyphs.length - 1)]
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
			setImageVersion(v => v + 1)
			URL.revokeObjectURL(url)
		}
		image.onerror = () => {
			setErrorMessage('Не удалось прочитать изображение')
			URL.revokeObjectURL(url)
		}
		image.src = url
	}

	const reset = () => {
		sourceRef.current = null
		setImageVersion(0)
		setErrorMessage(null)
	}

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
						{hasImage && (
							<Button
								size='icon'
								variant='ghost'
								onClick={reset}
								title='Очистить'
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

				{grid ? (
					<div className='overflow-x-auto px-0 py-4 sm:px-6 sm:py-6'>
						<canvas
							ref={previewRef}
							aria-label='Мозаика из костей'
							className='mx-auto block h-auto max-w-full'
							style={{ width: grid.cols * PREVIEW_CELL }}
						/>
					</div>
				) : (
					<div className='px-5 py-6 sm:px-6'>
						<button
							type='button'
							onClick={() => fileInputRef.current?.click()}
							className={cn(
								'flex w-full cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed py-16 transition-colors hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
								isDragging && 'border-primary bg-primary/5'
							)}
						>
							<Upload className='h-6 w-6 text-muted-foreground' />
							<span className='text-sm'>Выберите фото или перетащите сюда</span>
							<span className='max-w-sm px-6 text-center text-xs text-muted-foreground'>
								Лучше всего получаются контрастные снимки — портрет крупным
								планом, силуэт, логотип
							</span>
						</button>
						{errorMessage && (
							<p className='mt-3 text-sm text-destructive'>{errorMessage}</p>
						)}
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

					{setKey !== 'dice' && (
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
							{setKey === 'dice' ? (
								<>
									, костей{' '}
									<span className='font-mono tabular-nums text-foreground'>
										{grid.white}
									</span>{' '}
									белых и{' '}
									<span className='font-mono tabular-nums text-foreground'>
										{grid.black}
									</span>{' '}
									чёрных
								</>
							) : (
								<>
									, клеток{' '}
									<span className='font-mono tabular-nums text-foreground'>
										{total}
									</span>
								</>
							)}
						</span>
					)}
				</div>

				{grid && setKey === 'dice' && (
					<div className='border-t px-5 py-3 text-xs text-muted-foreground sm:px-6'>
						Копия в буфер и файл .txt — это шесть граней символами Unicode: цвет
						кубика в текст не переносится. Двухцветную мозаику забирайте
						картинкой.
					</div>
				)}
			</Card>

			<DiceArtSeo />
		</WidgetSEOWrapper>
	)
}
