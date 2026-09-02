import { describe, it, expect } from 'vitest'
import {
	clampPlacement,
	toPdfPlacement,
	toVisualRect,
	visualPageSize,
	type PageRotation,
	type VisualRect
} from '@/lib/tools/pdf-stamp'

/** A4 в пунктах — неповёрнутый лист, как его отдаёт pdf-lib. */
const A4 = { width: 595, height: 842 }

describe('visualPageSize', () => {
	it('без поворота стороны те же', () => {
		expect(visualPageSize(A4, 0)).toEqual({ width: 595, height: 842 })
	})

	it('поворот на пол-оборота стороны не меняет', () => {
		expect(visualPageSize(A4, 180)).toEqual({ width: 595, height: 842 })
	})

	it('на четверть — стороны меняются местами', () => {
		expect(visualPageSize(A4, 90)).toEqual({ width: 842, height: 595 })
		expect(visualPageSize(A4, 270)).toEqual({ width: 842, height: 595 })
	})
})

describe('toVisualRect', () => {
	it('доли переводятся в пункты', () => {
		const rect = toVisualRect({ x: 0.5, y: 0.25, width: 0.2 }, 2, A4)
		expect(rect.x).toBeCloseTo(297.5)
		expect(rect.y).toBeCloseTo(210.5)
		expect(rect.width).toBeCloseTo(119)
	})

	it('высота выводится из пропорций картинки', () => {
		// Широкая подпись 4:1 при ширине в 119 пунктов — высота 29.75
		const rect = toVisualRect({ x: 0, y: 0, width: 0.2 }, 4, A4)
		expect(rect.height).toBeCloseTo(29.75)
	})
})

describe('toPdfPlacement', () => {
	// Картинка 100×50 в левом верхнем углу видимой страницы, с отступом 20
	const rect: VisualRect = { x: 20, y: 20, width: 100, height: 50 }

	it('без поворота ось Y переворачивается', () => {
		const placed = toPdfPlacement(rect, A4, 0)
		expect(placed).toEqual({
			x: 20,
			// низ картинки: 842 − 20 сверху − 50 высоты
			y: 772,
			width: 100,
			height: 50,
			rotate: 0
		})
	})

	it('картинка не выходит за лист при отсчёте снизу', () => {
		const placed = toPdfPlacement(rect, A4, 0)
		expect(placed.y + placed.height).toBeLessThanOrEqual(A4.height)
		expect(placed.x + placed.width).toBeLessThanOrEqual(A4.width)
	})

	it('поворот на четверть по часовой', () => {
		expect(toPdfPlacement(rect, A4, 90)).toEqual({
			x: 70,
			y: 20,
			width: 100,
			height: 50,
			rotate: 90
		})
	})

	it('поворот на пол-оборота', () => {
		expect(toPdfPlacement(rect, A4, 180)).toEqual({
			x: 575,
			y: 70,
			width: 100,
			height: 50,
			rotate: 180
		})
	})

	it('поворот на три четверти', () => {
		expect(toPdfPlacement(rect, A4, 270)).toEqual({
			x: 525,
			y: 822,
			width: 100,
			height: 50,
			rotate: 270
		})
	})

	/**
	 * Главная проверка на все повороты сразу: куда бы ни был повёрнут лист,
	 * картинка обязана остаться внутри его границ. Занятые ею точки считаем
	 * по той же формуле, по которой их рисует pdf-lib — поворот вокруг
	 * точки (x, y).
	 */
	it.each([0, 90, 180, 270] as PageRotation[])(
		'при повороте %i картинка остаётся внутри листа',
		rotation => {
			const visual = visualPageSize(A4, rotation)
			const inside: VisualRect = {
				x: visual.width - 120,
				y: visual.height - 70,
				width: 100,
				height: 50
			}
			const placed = toPdfPlacement(inside, A4, rotation)

			const radians = (placed.rotate * Math.PI) / 180
			const cos = Math.round(Math.cos(radians))
			const sin = Math.round(Math.sin(radians))
			const corners = [
				[0, 0],
				[placed.width, 0],
				[0, placed.height],
				[placed.width, placed.height]
			].map(([u, v]) => [
				placed.x + u * cos - v * sin,
				placed.y + u * sin + v * cos
			])

			for (const [x, y] of corners) {
				expect(x).toBeGreaterThanOrEqual(-0.001)
				expect(x).toBeLessThanOrEqual(A4.width + 0.001)
				expect(y).toBeGreaterThanOrEqual(-0.001)
				expect(y).toBeLessThanOrEqual(A4.height + 0.001)
			}
		}
	)

	it('верхний левый угол превью совпадает с верхним левым углом листа', () => {
		// Картинка вплотную к началу координат превью на неповёрнутом листе
		const corner = toPdfPlacement({ x: 0, y: 0, width: 100, height: 50 }, A4, 0)
		expect(corner.x).toBe(0)
		expect(corner.y + corner.height).toBe(A4.height)
	})
})

describe('clampPlacement', () => {
	it('не пускает за правый край', () => {
		const result = clampPlacement({ x: 0.95, y: 0.5, width: 0.2 }, 2, A4)
		expect(result.x).toBeCloseTo(0.8)
	})

	it('не пускает за нижний край с учётом высоты картинки', () => {
		// Ширина 0.2 от 595 = 119 пунктов, при 2:1 высота 59.5 = 0.0707 листа
		const result = clampPlacement({ x: 0.1, y: 0.99, width: 0.2 }, 2, A4)
		expect(result.y).toBeCloseTo(1 - 59.5 / 842, 4)
	})

	it('отрицательные координаты подтягивает к нулю', () => {
		const result = clampPlacement({ x: -0.5, y: -0.2, width: 0.2 }, 2, A4)
		expect(result.x).toBe(0)
		expect(result.y).toBe(0)
	})

	it('ширину держит в разумных пределах', () => {
		expect(clampPlacement({ x: 0, y: 0, width: 5 }, 2, A4).width).toBe(1)
		expect(clampPlacement({ x: 0, y: 0, width: 0 }, 2, A4).width).toBe(0.02)
	})

	it('координаты внутри листа не трогает', () => {
		const result = clampPlacement({ x: 0.3, y: 0.4, width: 0.25 }, 3, A4)
		expect(result.x).toBeCloseTo(0.3)
		expect(result.y).toBeCloseTo(0.4)
		expect(result.width).toBeCloseTo(0.25)
	})
})
