export type Pixel = string | null
export type PixelGrid = Pixel[][]

/** Минимальный набор полей ImageData, нужный для конвертации — не тянем DOM-тип. */
export interface PixelSource {
	width: number
	height: number
	data: Uint8ClampedArray
}

export function createEmptyGrid(size: number): PixelGrid {
	return Array.from({ length: size }, () => Array<Pixel>(size).fill(null))
}

export interface PixelFrame {
	id: string
	grid: PixelGrid
	/** Задержка показа кадра в мс — хранится на кадре, а не глобально:
	 *  в реальной покадровой анимации разные кадры почти всегда идут с
	 *  разной скоростью (пауза на ключевой позе, быстрые промежуточные). */
	delayMs: number
}

export const DEFAULT_FRAME_DELAY_MS = 200

export function createFrameId(): string {
	return Math.random().toString(36).slice(2)
}

export function createFrame(
	size: number,
	delayMs = DEFAULT_FRAME_DELAY_MS
): PixelFrame {
	return {
		id: createFrameId(),
		grid: createEmptyGrid(size),
		delayMs
	}
}

/** Меняет размер сетки, сохраняя пересекающиеся пиксели — не сбрасывает рисунок целиком. */
export function resizeGrid(grid: PixelGrid, newSize: number): PixelGrid {
	const resized = createEmptyGrid(newSize)
	const overlap = Math.min(grid.length, newSize)

	for (let row = 0; row < overlap; row++) {
		for (let col = 0; col < overlap; col++) {
			resized[row][col] = grid[row][col]
		}
	}

	return resized
}

export function hexToRgb(hex: string): [number, number, number] {
	const clean = hex.replace('#', '')
	return [
		parseInt(clean.slice(0, 2), 16),
		parseInt(clean.slice(2, 4), 16),
		parseInt(clean.slice(4, 6), 16)
	]
}

export function colorDistance(
	a: [number, number, number],
	b: [number, number, number]
): number {
	return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2
}

export function nearestColor(hex: string, palette: string[]): string {
	if (palette.length === 0) return hex

	const target = hexToRgb(hex)
	let closest = palette[0]
	let closestDist = Infinity

	for (const candidate of palette) {
		const dist = colorDistance(target, hexToRgb(candidate))
		if (dist < closestDist) {
			closestDist = dist
			closest = candidate
		}
	}

	return closest
}

/**
 * Даунсемплит изображение до сетки gridSize×gridSize и квантует каждый
 * пиксель к ближайшему цвету палитры. Берём цвет из центра каждой ячейки
 * (nearest-neighbor), а не среднее — при усреднении мелкие контрастные
 * детали (глаза, контуры) размываются в кашу ещё до квантования.
 */
export function imageDataToGrid(
	source: PixelSource,
	gridSize: number,
	palette: string[]
): PixelGrid {
	const grid = createEmptyGrid(gridSize)
	const cellWidth = source.width / gridSize
	const cellHeight = source.height / gridSize

	for (let row = 0; row < gridSize; row++) {
		for (let col = 0; col < gridSize; col++) {
			const sampleX = Math.min(
				source.width - 1,
				Math.floor((col + 0.5) * cellWidth)
			)
			const sampleY = Math.min(
				source.height - 1,
				Math.floor((row + 0.5) * cellHeight)
			)
			const idx = (sampleY * source.width + sampleX) * 4
			const alpha = source.data[idx + 3]

			if (alpha < 128) {
				grid[row][col] = null
				continue
			}

			const hex =
				'#' +
				[source.data[idx], source.data[idx + 1], source.data[idx + 2]]
					.map(c => c.toString(16).padStart(2, '0'))
					.join('')

			grid[row][col] = nearestColor(hex, palette)
		}
	}

	return grid
}
