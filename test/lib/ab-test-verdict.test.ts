import { describe, it, expect } from 'vitest'
import { pickVerdict } from '@/lib/utils/ab-test'

describe('pickVerdict', () => {
	it('меньше двух заполненных вариантов — incomplete', () => {
		expect(
			pickVerdict(
				[{ label: 'A', input: { visitors: 100, conversions: 10 } }],
				95
			)
		).toEqual({ kind: 'incomplete' })
	})

	it('пустой список — incomplete', () => {
		expect(pickVerdict([], 95)).toEqual({ kind: 'incomplete' })
	})

	it('незаполненные строки не считаются заполненными', () => {
		const variants = [
			{ label: 'A', input: { visitors: 100, conversions: 10 } },
			{ label: 'B', input: null }
		]
		expect(pickVerdict(variants, 95)).toEqual({ kind: 'incomplete' })
	})

	it('два варианта, значимая разница — одна строка', () => {
		const variants = [
			{ label: 'A', input: { visitors: 1000, conversions: 100 } },
			{ label: 'B', input: { visitors: 1000, conversions: 130 } }
		]
		expect(pickVerdict(variants, 95)).toEqual({
			kind: 'results',
			lines: [{ winnerLabel: 'B', loserLabels: ['A'] }]
		})
	})

	it('два варианта, разницы нет — no-difference', () => {
		const variants = [
			{ label: 'A', input: { visitors: 1000, conversions: 100 } },
			{ label: 'B', input: { visitors: 1000, conversions: 102 } }
		]
		expect(pickVerdict(variants, 95)).toEqual({ kind: 'no-difference' })
	})

	it('4 варианта: два значимых победителя относительно двух аутсайдеров, с поправкой Бонферрони на 6 пар', () => {
		const variants = [
			{ label: 'A', input: { visitors: 100, conversions: 14 } },
			{ label: 'B', input: { visitors: 100, conversions: 30 } },
			{ label: 'C', input: { visitors: 100, conversions: 40 } },
			{ label: 'D', input: { visitors: 100, conversions: 14 } }
		]
		// Без поправки (raw 95%, z-критич. 1.96) все несовпадающие с A/D пары
		// значимы, включая B и C по отдельности против A и D. B и C друг с
		// другом статистически неразличимы (z≈1.48), поэтому ребра между
		// ними нет ни с поправкой, ни без.
		expect(pickVerdict(variants, 95)).toEqual({
			kind: 'results',
			lines: [
				{ winnerLabel: 'B', loserLabels: ['A', 'D'] },
				{ winnerLabel: 'C', loserLabels: ['A', 'D'] }
			]
		})
	})

	it('поправка Бонферрони гасит границу, значимую без неё', () => {
		// Пара A/J (1000/100 против 1000/130) сама по себе значима на 95% без
		// поправки (z≈2.1 > 1.96, см. тест compareToControl). При 10
		// вариантах это 45 пар, критическое z с поправкой Бонферрони ≈3.26 —
		// та же граница перестаёт быть значимой.
		const baseline = { visitors: 1000, conversions: 100 }
		const variants = [
			...'ABCDEFGHI'.split('').map(label => ({ label, input: baseline })),
			{ label: 'J', input: { visitors: 1000, conversions: 130 } }
		]
		expect(pickVerdict(variants, 95)).toEqual({ kind: 'no-difference' })
	})
})
