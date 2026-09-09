import { describe, it, expect } from 'vitest'
import { convertBase, explainDigits } from '@/lib/utils/number-base'

describe('convertBase', () => {
	it('переводит из десятичной в двоичную и обратно', () => {
		expect(convertBase('10', 10, 2).value).toBe('1010')
		expect(convertBase('1010', 2, 10).value).toBe('10')
	})

	it('работает с шестнадцатеричной', () => {
		expect(convertBase('255', 10, 16).value).toBe('ff')
		expect(convertBase('FF', 16, 10).value).toBe('255')
		expect(convertBase('ff', 16, 2).value).toBe('11111111')
	})

	it('не теряет разряды на длинных числах', () => {
		// 64 единицы — за пределами точности double, где Number уже врёт.
		const ones = '1'.repeat(64)
		expect(convertBase(ones, 2, 10).value).toBe((2n ** 64n - 1n).toString())
	})

	it('переводит дробную часть', () => {
		expect(convertBase('0.5', 10, 2).value).toBe('0.1')
		expect(convertBase('0.1', 2, 10).value).toBe('0.5')
	})

	it('сохраняет знак минуса', () => {
		expect(convertBase('-10', 10, 2).value).toBe('-1010')
	})

	it('объясняет, какие цифры допустимы', () => {
		expect(convertBase('2', 2, 10).problem).toMatch(/только цифры 0 1/)
		expect(convertBase('9', 8, 10).problem).toMatch(/основанием 8/)
	})

	it('ловит вторую точку', () => {
		expect(convertBase('1.2.3', 10, 2).problem).toMatch(/больше одной точки/)
	})

	it('на пустой строке молчит, а не ругается', () => {
		expect(convertBase('  ', 10, 2)).toEqual({ value: null, problem: null })
	})
})

describe('explainDigits', () => {
	it('раскладывает число по разрядам', () => {
		expect(explainDigits('101', 2)).toEqual([
			{ digit: '1', power: 2, value: '4' },
			{ digit: '0', power: 1, value: '0' },
			{ digit: '1', power: 0, value: '1' }
		])
	})
})
