import { describe, it, expect } from 'vitest'
import { pluralizeRu, toolsCountLabel } from '@/lib/utils/pluralize'

describe('pluralizeRu', () => {
	const forms: [string, string, string] = [
		'инструмент',
		'инструмента',
		'инструментов'
	]

	it('1 и числа на 1 (кроме 11) — форма one', () => {
		expect(pluralizeRu(1, forms)).toBe('инструмент')
		expect(pluralizeRu(21, forms)).toBe('инструмент')
		expect(pluralizeRu(51, forms)).toBe('инструмент')
		expect(pluralizeRu(101, forms)).toBe('инструмент')
	})

	it('2-4 и числа на 2-4 (кроме 12-14) — форма few', () => {
		expect(pluralizeRu(2, forms)).toBe('инструмента')
		expect(pluralizeRu(3, forms)).toBe('инструмента')
		expect(pluralizeRu(4, forms)).toBe('инструмента')
		expect(pluralizeRu(24, forms)).toBe('инструмента')
	})

	it('5-20 и 0 — форма many', () => {
		expect(pluralizeRu(0, forms)).toBe('инструментов')
		expect(pluralizeRu(5, forms)).toBe('инструментов')
		expect(pluralizeRu(11, forms)).toBe('инструментов')
		expect(pluralizeRu(12, forms)).toBe('инструментов')
		expect(pluralizeRu(13, forms)).toBe('инструментов')
		expect(pluralizeRu(14, forms)).toBe('инструментов')
		expect(pluralizeRu(47, forms)).toBe('инструментов')
	})

	it('11-14 — исключение из «на 1/2-4» даже в сотнях (111, 112)', () => {
		expect(pluralizeRu(111, forms)).toBe('инструментов')
		expect(pluralizeRu(112, forms)).toBe('инструментов')
	})
})

describe('toolsCountLabel', () => {
	it('собирает число и форму вместе', () => {
		expect(toolsCountLabel(51)).toBe('51 инструмент')
		expect(toolsCountLabel(47)).toBe('47 инструментов')
		expect(toolsCountLabel(2)).toBe('2 инструмента')
	})
})
