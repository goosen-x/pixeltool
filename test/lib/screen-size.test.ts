import { describe, it, expect } from 'vitest'
import {
	ASPECT_RATIOS,
	CM_PER_INCH,
	COMMON_DIAGONALS,
	getRatio,
	pixelDensity,
	screenSize,
	viewingDistanceM
} from '@/lib/utils/screen-size'

const wide = getRatio('16-9')!

describe('соотношения сторон', () => {
	it('идентификаторы уникальны', () => {
		expect(new Set(ASPECT_RATIOS.map(r => r.id)).size).toBe(
			ASPECT_RATIOS.length
		)
	})

	it('21:9 записано точно как 64:27, а не округлённо', () => {
		const r = getRatio('21-9')!
		expect(r.w / r.h).toBeCloseTo(64 / 27, 9)
	})

	it('квадрат даёт равные стороны', () => {
		const s = screenSize(10, getRatio('1-1')!)!
		expect(s.widthInches).toBeCloseTo(s.heightInches, 9)
	})
})

describe('размеры по диагонали', () => {
	it('дюйм — ровно 2,54 см', () => {
		expect(CM_PER_INCH).toBe(2.54)
		expect(screenSize(1, wide)!.diagonalCm).toBeCloseTo(2.54, 9)
	})

	it('телевизор 32 дюйма: диагональ 81,3 см, ширина около 70,8', () => {
		const s = screenSize(32, wide)!
		expect(s.diagonalCm).toBeCloseTo(81.28, 2)
		expect(s.widthCm).toBeCloseTo(70.8, 1)
		expect(s.heightCm).toBeCloseTo(39.8, 1)
	})

	it('телевизор 55 дюймов', () => {
		const s = screenSize(55, wide)!
		expect(s.widthCm).toBeCloseTo(121.8, 1)
		expect(s.heightCm).toBeCloseTo(68.5, 1)
	})

	it('стороны действительно дают исходную диагональ', () => {
		for (const d of COMMON_DIAGONALS) {
			for (const r of ASPECT_RATIOS) {
				const s = screenSize(d, r)!
				const check = Math.sqrt(s.widthInches ** 2 + s.heightInches ** 2)
				expect(check).toBeCloseTo(d, 9)
			}
		}
	})

	it('соотношение сторон сохраняется', () => {
		for (const r of ASPECT_RATIOS) {
			const s = screenSize(42, r)!
			expect(s.widthInches / s.heightInches).toBeCloseTo(r.w / r.h, 9)
		}
	})

	it('ширина в см и в дюймах согласованы', () => {
		const s = screenSize(43, wide)!
		expect(s.widthCm).toBeCloseTo(s.widthInches * CM_PER_INCH, 9)
	})

	it('площадь равна произведению сторон', () => {
		const s = screenSize(50, wide)!
		expect(s.areaCm2).toBeCloseTo(s.widthCm * s.heightCm, 6)
	})

	it('при одной диагонали ультраширокий уже и ниже по площади', () => {
		const a = screenSize(34, wide)!
		const b = screenSize(34, getRatio('21-9')!)!
		expect(b.widthCm).toBeGreaterThan(a.widthCm)
		expect(b.heightCm).toBeLessThan(a.heightCm)
		expect(b.areaCm2).toBeLessThan(a.areaCm2)
	})

	it('нулевая и отрицательная диагональ отвергаются', () => {
		expect(screenSize(0, wide)).toBeNull()
		expect(screenSize(-10, wide)).toBeNull()
	})
})

describe('плотность пикселей', () => {
	it('Full HD на 24 дюймах — около 92 ppi', () => {
		expect(pixelDensity(24, 1920, 1080)!).toBeCloseTo(91.79, 1)
	})

	it('4K на 27 дюймах плотнее, чем Full HD на том же экране', () => {
		const fhd = pixelDensity(27, 1920, 1080)!
		const uhd = pixelDensity(27, 3840, 2160)!
		expect(uhd).toBeCloseTo(fhd * 2, 6)
	})

	it('некорректные значения дают null', () => {
		expect(pixelDensity(0, 1920, 1080)).toBeNull()
		expect(pixelDensity(24, 0, 1080)).toBeNull()
	})
})

describe('расстояние просмотра', () => {
	it('для 4K ближе, чем для Full HD', () => {
		expect(viewingDistanceM(55, true)).toBeLessThan(viewingDistanceM(55, false))
	})

	it('55 дюймов 4K — около двух метров', () => {
		expect(viewingDistanceM(55, true)).toBeCloseTo(2.1, 1)
	})
})
