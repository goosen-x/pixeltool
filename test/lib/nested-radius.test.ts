import { describe, it, expect } from 'vitest'
import {
	buildCss,
	computeNestedRadius,
	computeOuterRadius,
	totalGap
} from '@/lib/utils/nested-radius'

const gap = (padding: number, border = 0) => ({ padding, border })

describe('computeNestedRadius', () => {
	it('внутренний радиус меньше внешнего на величину отступа', () => {
		const result = computeNestedRadius({ outerRadius: 16, gap: gap(8) })
		expect(result.innerRadius).toBe(8)
		expect(result.clamped).toBe(false)
	})

	it('рамка раздвигает элементы наравне с padding', () => {
		const result = computeNestedRadius({ outerRadius: 20, gap: gap(8, 2) })
		expect(result.distance).toBe(10)
		expect(result.innerRadius).toBe(10)
	})

	it('без отступа радиусы совпадают', () => {
		expect(
			computeNestedRadius({ outerRadius: 12, gap: gap(0) }).innerRadius
		).toBe(12)
	})

	it('отступ ровно по радиусу даёт прямой угол', () => {
		const result = computeNestedRadius({ outerRadius: 8, gap: gap(8) })
		expect(result.innerRadius).toBe(0)
		expect(result.clamped).toBe(false)
	})

	it('отступ больше радиуса не уводит в минус, но помечается', () => {
		const result = computeNestedRadius({ outerRadius: 8, gap: gap(20) })
		expect(result.innerRadius).toBe(0)
		expect(result.clamped).toBe(true)
	})

	it('дробные значения не округляются', () => {
		expect(
			computeNestedRadius({ outerRadius: 12.5, gap: gap(2.5) }).innerRadius
		).toBeCloseTo(10, 6)
	})
})

describe('computeOuterRadius', () => {
	it('обратная задача возвращает исходный внешний радиус', () => {
		const outer = 24
		const g = gap(10, 2)
		const inner = computeNestedRadius({
			outerRadius: outer,
			gap: g
		}).innerRadius
		expect(computeOuterRadius(inner, g)).toBe(outer)
	})

	it('прямой угол внутри требует внешнего радиуса ровно в отступ', () => {
		expect(computeOuterRadius(0, gap(12))).toBe(12)
	})
})

describe('totalGap', () => {
	it('складывает padding и рамку', () => {
		expect(totalGap(gap(8, 4))).toBe(12)
	})
})

describe('buildCss', () => {
	it('связывает радиусы через переменные, а не через готовые числа', () => {
		const css = buildCss(16, gap(8))
		expect(css).toContain('--radius: 16px;')
		expect(css).toContain('--padding: 8px;')
		expect(css).toContain(
			'border-radius: max(0px, var(--radius) - var(--padding));'
		)
		// готового числа 8px для внутреннего радиуса быть не должно —
		// иначе связь потеряется при первой правке отступа
		expect(css).not.toContain('border-radius: 8px')
	})

	it('рамка попадает в формулу, только если она есть', () => {
		expect(buildCss(16, gap(8, 0))).not.toContain('--border')
		const withBorder = buildCss(16, gap(8, 2))
		expect(withBorder).toContain('--border: 2px;')
		expect(withBorder).toContain(
			'var(--radius) - var(--padding) - var(--border)'
		)
	})

	it('селекторы можно задать свои', () => {
		const css = buildCss(16, gap(8), { outer: '.box', inner: '.box > img' })
		expect(css).toContain('.box {')
		expect(css).toContain('.box > img {')
	})

	it('дробные значения выводятся без хвоста нулей', () => {
		expect(buildCss(12.5, gap(2.25))).toContain('--padding: 2.25px;')
	})
})
