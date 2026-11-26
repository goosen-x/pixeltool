import { describe, it, expect } from 'vitest'
import {
	formatUnitResult,
	parseUnitInput,
	toInputString
} from '@/lib/utils/unit-input'
import { convert } from '@/lib/constants/units'

describe('parseUnitInput', () => {
	it.each([
		['1', 1],
		['12,5', 12.5],
		['12.5', 12.5],
		['1 000', 1000],
		['1 500,25', 1500.25],
		['-40', -40],
		['−40', -40],
		[',5', 0.5],
		['1e3', 1000],
		['1,057e-16', 1.057e-16]
	])('%s → %s', (raw, expected) => {
		expect(parseUnitInput(raw)).toBe(expected)
	})

	it.each(['', '   ', 'abc', '12abc', '1,2,3', '--5', '.'])(
		'%j — не число',
		raw => {
			expect(parseUnitInput(raw)).toBeNull()
		}
	)
})

describe('formatUnitResult', () => {
	it('мелкие результаты не превращаются в ноль', () => {
		const ly = convert('length', 'm', 'lightyear', 1)!
		expect(formatUnitResult(ly)).toBe('1,057 × 10⁻¹⁶')
		const t = convert('weight', 'mg', 't', 1)!
		expect(formatUnitResult(t)).toBe('1 × 10⁻⁹')
		const mi = convert('length', 'mm', 'mi', 1)!
		expect(formatUnitResult(mi)).toBe('6,21371 × 10⁻⁷')
	})

	it('обычные значения как раньше', () => {
		expect(formatUnitResult(convert('length', 'mm', 'cm', 1)!)).toBe('0,1')
		expect(formatUnitResult(convert('length', 'mi', 'km', 1)!)).toBe(
			'1,609344'
		)
		expect(formatUnitResult(convert('temperature', 'c', 'f', 100)!)).toBe(
			'212'
		)
		expect(formatUnitResult(convert('length', 'ft', 'm', 1)!)).toBe('0,3048')
		expect(formatUnitResult(0)).toBe('0')
	})

	it('огромные значения в научной записи', () => {
		expect(formatUnitResult(convert('length', 'lightyear', 'm', 1)!)).toBe(
			'9,46073 × 10¹⁵'
		)
	})
})

describe('toInputString', () => {
	it('возвращает в поле число без хвоста плавающей точки', () => {
		expect(toInputString(convert('length', 'm', 'in', 1)!)).toBe('39,37007874')
	})

	it('результат обратно читается parseUnitInput', () => {
		for (const v of [0.1, 39.37007874015748, 1.057e-16, 9.46e15, -40]) {
			const back = parseUnitInput(toInputString(v))
			expect(back).not.toBeNull()
			expect(back! / v).toBeCloseTo(1, 4)
		}
	})
})
