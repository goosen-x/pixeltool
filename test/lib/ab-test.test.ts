import { describe, it, expect } from 'vitest'
import {
	wilsonInterval,
	normalCdf,
	compareToControl,
	zCritical
} from '@/lib/utils/ab-test'

describe('zCritical', () => {
	it('совпадает с табличными значениями для 90/95/99% (в пределах точности erf-приближения)', () => {
		expect(zCritical(90)).toBeCloseTo(1.6448536269514722, 5)
		expect(zCritical(95)).toBeCloseTo(1.959963984540054, 5)
		expect(zCritical(99)).toBeCloseTo(2.5758293035489004, 5)
	})

	it('работает для промежуточных значений (слайдер даёт любой %)', () => {
		expect(zCritical(80)).toBeCloseTo(1.2815515655446004, 4)
		expect(zCritical(93)).toBeCloseTo(1.8119106729526, 3)
	})

	it('монотонно растёт с уровнем доверия', () => {
		expect(zCritical(99)).toBeGreaterThan(zCritical(95))
		expect(zCritical(95)).toBeGreaterThan(zCritical(90))
		expect(zCritical(90)).toBeGreaterThan(zCritical(80))
	})
})

describe('wilsonInterval', () => {
	it('нулевые конверсии — нижняя граница не уходит в минус', () => {
		const result = wilsonInterval(0, 100, 95)
		expect(result.rate).toBe(0)
		expect(result.lower).toBe(0)
		expect(result.upper).toBeGreaterThan(0)
	})

	it('стопроцентная конверсия — верхняя граница не превышает 1', () => {
		const result = wilsonInterval(100, 100, 95)
		expect(result.rate).toBe(1)
		expect(result.upper).toBe(1)
		expect(result.lower).toBeLessThan(1)
	})

	it('n=100, x=10, 95% — совпадает с эталонным расчётом по формуле Уилсона', () => {
		const result = wilsonInterval(10, 100, 95)
		expect(result.rate).toBeCloseTo(0.1, 5)
		expect(result.lower).toBeCloseTo(0.0552, 2)
		expect(result.upper).toBeCloseTo(0.1744, 2)
	})

	it('более узкий уровень доверия даёт более узкий интервал', () => {
		const wide = wilsonInterval(10, 100, 99)
		const narrow = wilsonInterval(10, 100, 90)
		expect(narrow.upper - narrow.lower).toBeLessThan(wide.upper - wide.lower)
	})
})

describe('normalCdf', () => {
	it('в нуле — ровно 0.5 (медиана стандартного нормального распределения)', () => {
		expect(normalCdf(0)).toBeCloseTo(0.5, 6)
	})

	it('z=1.96 — верхняя граница 97.5-го перцентиля (стандартная табличная точка)', () => {
		expect(normalCdf(1.959963984540054)).toBeCloseTo(0.975, 5)
	})

	it('симметрична вокруг нуля: Φ(-z) = 1 − Φ(z)', () => {
		expect(normalCdf(-1.5)).toBeCloseTo(1 - normalCdf(1.5), 6)
	})
})

describe('compareToControl', () => {
	it('классический пример (1000/100 против 1000/130) — значимо на 95%, но не на 99%', () => {
		const control = { visitors: 1000, conversions: 100 }
		const variant = { visitors: 1000, conversions: 130 }

		const result95 = compareToControl(control, variant, 95)
		expect(result95.zScore).toBeCloseTo(2.1, 1)
		expect(result95.pValue).toBeCloseTo(0.0354, 2)
		expect(result95.uplift).toBeCloseTo(0.3, 5)
		expect(result95.significant).toBe(true)

		const result99 = compareToControl(control, variant, 99)
		expect(result99.significant).toBe(false)
	})

	it('одинаковые конверсии — нет разницы, незначимо', () => {
		const control = { visitors: 500, conversions: 50 }
		const variant = { visitors: 500, conversions: 50 }

		const result = compareToControl(control, variant, 95)
		expect(result.zScore).toBe(0)
		expect(result.pValue).toBeCloseTo(1, 6)
		expect(result.uplift).toBe(0)
		expect(result.significant).toBe(false)
	})

	it('в контроле нет конверсий, в варианте есть — прирост считается бесконечным', () => {
		const control = { visitors: 500, conversions: 0 }
		const variant = { visitors: 500, conversions: 10 }

		const result = compareToControl(control, variant, 95)
		expect(result.uplift).toBe(Infinity)
	})
})
