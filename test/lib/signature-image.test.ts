import { describe, it, expect } from 'vitest'
import {
	flattenPaper,
	isBackgroundPixel,
	DEFAULT_BACKGROUND_THRESHOLD as T
} from '@/lib/tools/signature-image'

/** Картинка w×h, залитая цветом по функции от координат. */
function makeImage(
	w: number,
	h: number,
	color: (x: number, y: number) => [number, number, number, number?]
) {
	const data = new Uint8ClampedArray(w * h * 4)
	for (let y = 0; y < h; y += 1) {
		for (let x = 0; x < w; x += 1) {
			const [r, g, b, a = 255] = color(x, y)
			data.set([r, g, b, a], (y * w + x) * 4)
		}
	}
	return data
}

const px = (data: Uint8ClampedArray, w: number, x: number, y: number) =>
	Array.from(data.slice((y * w + x) * 4, (y * w + x) * 4 + 4))

describe('flattenPaper', () => {
	// Фото подписи с телефона: серая бумага с перепадом света 205 → 165 и
	// тёмная линия посередине.
	const W = 200
	const H = 100
	const photo = () =>
		makeImage(W, H, (x, y) => {
			if (y >= 48 && y <= 51 && x > 20 && x < 180) return [40, 45, 70]
			const v = Math.round(205 - (x / W) * 40)
			return [v, v - 3, v - 10]
		})

	it('серая бумага с фото становится фоном по обе стороны перепада', () => {
		const data = photo()
		// До выравнивания бумага не проходит порог — отсюда серый прямоугольник
		const [r, g, b] = px(data, W, 190, 10)
		expect(isBackgroundPixel(r, g, b, T)).toBe(false)

		flattenPaper(data, W, H)
		for (const x of [5, 100, 195]) {
			const [r2, g2, b2] = px(data, W, x, 10)
			expect(isBackgroundPixel(r2, g2, b2, T)).toBe(true)
		}
	})

	it('штрих остаётся тёмным', () => {
		const data = photo()
		flattenPaper(data, W, H)
		const [r, g, b] = px(data, W, 100, 49)
		expect((r + g + b) / 3).toBeLessThan(110)
	})

	it('белый скан не меняется', () => {
		const data = makeImage(64, 64, (x, y) =>
			x === y ? [20, 20, 20] : [255, 255, 255]
		)
		const before = Array.from(data)
		flattenPaper(data, 64, 64)
		expect(Array.from(data)).toEqual(before)
	})

	it('картинку с готовой прозрачностью не трогает', () => {
		// PNG-подпись: чёрные штрихи на прозрачном фоне. Оценка «бумаги» по
		// одним штрихам выбелила бы саму подпись.
		const data = makeImage(64, 64, (x, y) =>
			y > 28 && y < 36 ? [10, 10, 10, 255] : [0, 0, 0, 0]
		)
		const before = Array.from(data)
		flattenPaper(data, 64, 64)
		expect(Array.from(data)).toEqual(before)
	})

	it('синяя печать на серой бумаге остаётся цветной', () => {
		const data = makeImage(W, H, (x, y) =>
			Math.hypot(x - 100, y - 50) < 30 && Math.hypot(x - 100, y - 50) > 25
				? [50, 70, 160]
				: [190, 188, 182]
		)
		flattenPaper(data, W, H)
		const [r, g, b] = px(data, W, 127, 50)
		expect(isBackgroundPixel(r, g, b, T)).toBe(false)
		expect(b - r).toBeGreaterThan(60)
	})
})
import { normalizeRotation } from '@/lib/tools/pdf-sign'

describe('isBackgroundPixel', () => {
	it('чистый белый — фон', () => {
		expect(isBackgroundPixel(255, 255, 255, T)).toBe(true)
	})

	it('серая бумага скана — тоже фон', () => {
		expect(isBackgroundPixel(240, 238, 236, T)).toBe(true)
	})

	it('чёрный штрих подписи — не фон', () => {
		expect(isBackgroundPixel(20, 20, 20, T)).toBe(false)
	})

	it('серый полутон штриха — не фон', () => {
		expect(isBackgroundPixel(180, 180, 180, T)).toBe(false)
	})

	it('синяя печать не уходит в фон', () => {
		// Насыщенная краска оттиска — тёмная, отсекается уже по яркости
		expect(isBackgroundPixel(60, 80, 180, T)).toBe(false)
	})

	it('светлая, но выраженно цветная точка оттиска остаётся', () => {
		// Разброс каналов 45 — это краска, а не бумага
		expect(isBackgroundPixel(210, 225, 255, T)).toBe(false)
	})

	it('еле различимая кромка оттиска уходит в фон вместе с бумагой', () => {
		// Разброс 20 при почти белой яркости неотличим от желтизны бумаги.
		// Это осознанный размен: такие точки — сглаживание по краю штриха,
		// и потерять их менее заметно, чем оставить жёлтую рамку вокруг
		// подписи на каждом скане.
		expect(isBackgroundPixel(235, 240, 255, T)).toBe(true)
	})

	it('жёлтая бумага остаётся фоном, пока она почти серая', () => {
		expect(isBackgroundPixel(252, 250, 240, T)).toBe(true)
	})

	it('точно на пороге считается фоном', () => {
		expect(isBackgroundPixel(T, T, T, T)).toBe(true)
	})

	it('на единицу темнее порога — уже не фон', () => {
		expect(isBackgroundPixel(T - 1, T, T, T)).toBe(false)
	})
})

describe('normalizeRotation', () => {
	it('обычные значения проходят как есть', () => {
		expect(normalizeRotation(0)).toBe(0)
		expect(normalizeRotation(90)).toBe(90)
		expect(normalizeRotation(180)).toBe(180)
		expect(normalizeRotation(270)).toBe(270)
	})

	it('отрицательный угол приводится к положительному', () => {
		expect(normalizeRotation(-90)).toBe(270)
		expect(normalizeRotation(-270)).toBe(90)
	})

	it('полный оборот и больше схлопывается', () => {
		expect(normalizeRotation(360)).toBe(0)
		expect(normalizeRotation(450)).toBe(90)
	})

	it('угол не кратный четверти округляется к ближайшей', () => {
		expect(normalizeRotation(89)).toBe(90)
		expect(normalizeRotation(1)).toBe(0)
	})
})
