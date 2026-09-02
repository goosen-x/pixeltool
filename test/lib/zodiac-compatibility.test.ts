import { describe, it, expect } from 'vitest'
import {
	ASPECTS,
	compatibilityScore,
	getCompatibility,
	signDistance
} from '@/lib/utils/zodiac-compatibility'
import { getSignById, ZODIAC_SIGNS } from '@/lib/utils/zodiac'

const sign = (id: string) => getSignById(id)!

describe('расстояние между знаками', () => {
	it('знак сам с собой — ноль', () => {
		expect(signDistance(sign('oven'), sign('oven'))).toBe(0)
	})

	it('соседи — единица', () => {
		expect(signDistance(sign('oven'), sign('telets'))).toBe(1)
	})

	it('круг замкнут: Овен и Рыбы соседи, а не противоположности', () => {
		expect(signDistance(sign('oven'), sign('ryby'))).toBe(1)
	})

	it('противоположные знаки — шесть', () => {
		expect(signDistance(sign('oven'), sign('vesy'))).toBe(6)
		expect(signDistance(sign('rak'), sign('kozerog'))).toBe(6)
	})

	it('расстояние симметрично', () => {
		for (const a of ZODIAC_SIGNS) {
			for (const b of ZODIAC_SIGNS) {
				expect(signDistance(a, b)).toBe(signDistance(b, a))
			}
		}
	})

	it('расстояние никогда не больше шести', () => {
		for (const a of ZODIAC_SIGNS) {
			for (const b of ZODIAC_SIGNS) {
				expect(signDistance(a, b)).toBeLessThanOrEqual(6)
			}
		}
	})
})

describe('аспекты', () => {
	it('одна стихия всегда даёт тригон или соединение', () => {
		for (const a of ZODIAC_SIGNS) {
			for (const b of ZODIAC_SIGNS) {
				if (a.element !== b.element) continue
				const aspect = getCompatibility(a, b).aspect.id
				expect(['trine', 'conjunction']).toContain(aspect)
			}
		}
	})

	it('противоположные знаки всегда разной стихии, но одного качества', () => {
		for (const a of ZODIAC_SIGNS) {
			for (const b of ZODIAC_SIGNS) {
				if (signDistance(a, b) !== 6) continue
				expect(a.element).not.toBe(b.element)
				expect(a.quality).toBe(b.quality)
			}
		}
	})

	it('квадрат означает общее качество при разных стихиях', () => {
		for (const a of ZODIAC_SIGNS) {
			for (const b of ZODIAC_SIGNS) {
				if (getCompatibility(a, b).aspect.id !== 'square') continue
				expect(a.quality).toBe(b.quality)
				expect(a.element).not.toBe(b.element)
			}
		}
	})

	it('секстиль соединяет огонь с воздухом или землю с водой', () => {
		const pairs = new Set<string>()
		for (const a of ZODIAC_SIGNS) {
			for (const b of ZODIAC_SIGNS) {
				if (getCompatibility(a, b).aspect.id !== 'sextile') continue
				pairs.add([a.element, b.element].sort().join('-'))
			}
		}
		expect([...pairs].sort()).toEqual(['air-fire', 'earth-water'])
	})

	it('все семь аспектов встречаются в круге', () => {
		const seen = new Set<string>()
		for (const a of ZODIAC_SIGNS) {
			for (const b of ZODIAC_SIGNS) {
				seen.add(getCompatibility(a, b).aspect.id)
			}
		}
		expect(seen.size).toBe(Object.keys(ASPECTS).length)
	})
})

describe('совместимость', () => {
	it('симметрична: порядок знаков не меняет аспект', () => {
		for (const a of ZODIAC_SIGNS) {
			for (const b of ZODIAC_SIGNS) {
				expect(compatibilityScore(a, b)).toBe(compatibilityScore(b, a))
			}
		}
	})

	it('оценка всегда от 1 до 5', () => {
		for (const a of ZODIAC_SIGNS) {
			for (const b of ZODIAC_SIGNS) {
				const score = compatibilityScore(a, b)
				expect(score).toBeGreaterThanOrEqual(1)
				expect(score).toBeLessThanOrEqual(5)
			}
		}
	})

	it('у каждой пары есть разбор стихий и качеств', () => {
		for (const a of ZODIAC_SIGNS) {
			for (const b of ZODIAC_SIGNS) {
				expect(getCompatibility(a, b).notes.length).toBeGreaterThanOrEqual(2)
			}
		}
	})

	it('одинаковая стихия отмечается в разборе', () => {
		const c = getCompatibility(sign('oven'), sign('lev'))
		expect(c.sameElement).toBe(true)
		expect(c.notes[0]).toContain('Одна стихия')
	})

	it('общий управитель отмечается отдельно', () => {
		// Меркурий ведёт Близнецов и Деву
		const c = getCompatibility(sign('bliznetsy'), sign('deva'))
		expect(c.notes.some(n => n.includes('Общий управитель'))).toBe(true)
	})

	it('уникальных пар семьдесят восемь', () => {
		const seen = new Set<string>()
		for (const a of ZODIAC_SIGNS) {
			for (const b of ZODIAC_SIGNS) {
				seen.add([a.id, b.id].sort().join('-'))
			}
		}
		expect(seen.size).toBe(78)
	})
})
