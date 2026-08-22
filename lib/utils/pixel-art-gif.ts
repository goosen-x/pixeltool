import { GIFEncoder } from 'gifenc'
import { hexToRgb, colorDistance, type PixelFrame } from './pixel-art'

/**
 * GIF-палитра — не более 256 цветов, один слот всегда занят прозрачностью.
 * Пиксель-арт обычно держится в пределах пары десятков цветов (даже самая
 * широкая встроенная палитра — NES, 36 цветов), так что квантование не
 * нужно: собираем точный список использованных цветов. Превышение лимита
 * возможно только через ручной выбор произвольного цвета на разных кадрах
 * много раз подряд — для этого редкого случая лишние цвета просто мэппятся
 * на ближайший уже занятый слот вместо quantize() из gifenc, чтобы не
 * тащить второй алгоритм квантования поверх уже собранной палитры.
 */
const MAX_COLORS = 256
const TRANSPARENT_INDEX = 0

function buildPalette(frames: PixelFrame[]): {
	palette: [number, number, number, number][]
	indexOf: (hex: string | null) => number
} {
	const palette: [number, number, number, number][] = [[0, 0, 0, 0]]
	const exact = new Map<string, number>()

	for (const frame of frames) {
		for (const row of frame.grid) {
			for (const hex of row) {
				if (!hex || exact.has(hex) || palette.length >= MAX_COLORS) continue
				exact.set(hex, palette.length)
				const [r, g, b] = hexToRgb(hex)
				palette.push([r, g, b, 255])
			}
		}
	}

	const nearestCache = new Map<string, number>()

	function indexOf(hex: string | null): number {
		if (!hex) return TRANSPARENT_INDEX
		const direct = exact.get(hex)
		if (direct !== undefined) return direct

		const cached = nearestCache.get(hex)
		if (cached !== undefined) return cached

		const target = hexToRgb(hex)
		let closest = TRANSPARENT_INDEX
		let closestDist = Infinity
		for (let i = 1; i < palette.length; i++) {
			const [r, g, b] = palette[i]
			const dist = colorDistance(target, [r, g, b])
			if (dist < closestDist) {
				closestDist = dist
				closest = i
			}
		}
		nearestCache.set(hex, closest)
		return closest
	}

	return { palette, indexOf }
}

/**
 * Рендерит кадры сетки в анимированный GIF. Каждая клетка растягивается в
 * блок cellPx×cellPx пикселей — без этого экспорт с сетки 16×16 давал бы
 * GIF 16×16, который превращается в нечитаемое пятно в любом чате или
 * превью, не применяющем pixelated-скейлинг сам.
 */
export function framesToGif(frames: PixelFrame[], gridSize: number): Uint8Array {
	const targetSize = 512
	const cellPx = Math.max(1, Math.floor(targetSize / gridSize))
	const dim = cellPx * gridSize

	const { palette, indexOf } = buildPalette(frames)
	const gif = GIFEncoder()

	frames.forEach((frame, frameIndex) => {
		const indices = new Uint8Array(dim * dim)
		for (let row = 0; row < gridSize; row++) {
			const colorIndex = frame.grid[row].map(indexOf)
			for (let col = 0; col < gridSize; col++) {
				const idx = colorIndex[col]
				const x0 = col * cellPx
				const y0 = row * cellPx
				for (let dy = 0; dy < cellPx; dy++) {
					const rowStart = (y0 + dy) * dim + x0
					indices.fill(idx, rowStart, rowStart + cellPx)
				}
			}
		}

		gif.writeFrame(indices, dim, dim, {
			palette: frameIndex === 0 ? palette : undefined,
			transparent: true,
			transparentIndex: TRANSPARENT_INDEX,
			delay: frame.delayMs,
			repeat: 0
		})
	})

	gif.finish()
	return gif.bytes()
}
