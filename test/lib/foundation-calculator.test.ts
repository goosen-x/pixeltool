import { describe, it, expect } from 'vitest'
import {
	calculateFoundation,
	type FoundationInput
} from '@/lib/utils/foundation-calculator'
import { CONCRETE_MIXES } from '@/lib/utils/concrete-calculator'

const base: FoundationInput = {
	type: 'strip',
	length: 10,
	width: 8,
	thickness: 0.4,
	height: 1.5,
	innerWallsLength: 0,
	pileCount: 12,
	pileDiameter: 0.3,
	rebarLines: 4,
	grade: 'M300'
}

describe('ленточный фундамент', () => {
	it('считает периметр по осевой линии, а не по внешнему контуру', () => {
		const result = calculateFoundation(base, 50)

		// 2 × (10 + 8) − 4 × 0.4 = 34.4 м
		expect(result.runningMeters).toBeCloseTo(34.4)
		expect(result.volumeM3).toBeCloseTo(34.4 * 0.4 * 1.5)
	})

	it('добавляет внутренние стены к длине ленты', () => {
		const result = calculateFoundation({ ...base, innerWallsLength: 6 }, 50)

		expect(result.runningMeters).toBeCloseTo(40.4)
	})

	it('считает арматуру с запасом на нахлёст', () => {
		const result = calculateFoundation(base, 50)

		expect(result.rebarMeters).toBeCloseTo(34.4 * 4 * 1.1)
	})
})

describe('плита', () => {
	it('считает объём по трём размерам', () => {
		const result = calculateFoundation(
			{ ...base, type: 'slab', thickness: 0.3 },
			50
		)

		expect(result.volumeM3).toBeCloseTo(10 * 8 * 0.3)
	})
})

describe('столбчатый фундамент', () => {
	it('считает объём цилиндров', () => {
		const result = calculateFoundation({ ...base, type: 'piles' }, 50)

		const one = Math.PI * 0.15 * 0.15 * 1.5
		expect(result.volumeM3).toBeCloseTo(one * 12)
	})
})

describe('материалы', () => {
	it('берёт нормы расхода из общей таблицы бетона', () => {
		const result = calculateFoundation(base, 50)
		const mix = CONCRETE_MIXES.M300

		expect(result.cementKg).toBeCloseTo(result.volumeM3 * mix.cement)
		expect(result.sandKg).toBeCloseTo(result.volumeM3 * mix.sand)
		expect(result.waterL).toBeCloseTo(result.volumeM3 * mix.water)
	})

	it('округляет мешки вверх — половину мешка не купить', () => {
		const result = calculateFoundation(base, 50)

		expect(result.bags).toBe(Math.ceil(result.cementKg / 50))
		expect(Number.isInteger(result.bags)).toBe(true)
	})
})
