import { describe, it, expect } from 'vitest'
import { tokenize, jaccardSimilarity } from '@/lib/seo/topic-coverage'

describe('tokenize', () => {
	it('приводит к нижнему регистру и режет на слова', () => {
		expect(tokenize('Что такое JSON?')).toEqual(['что', 'такое', 'json'])
	})

	it('нормализует ё в е', () => {
		expect(tokenize('озвучить текст ещё раз')).toContain('еще')
	})

	it('пустая строка → пустой массив', () => {
		expect(tokenize('')).toEqual([])
	})
})

describe('jaccardSimilarity', () => {
	it('считает пересечение над объединением', () => {
		expect(jaccardSimilarity(['a', 'b', 'c'], ['b', 'c', 'd'])).toBeCloseTo(0.5)
	})

	it('одинаковые наборы → 1', () => {
		expect(jaccardSimilarity(['a', 'b'], ['a', 'b'])).toBe(1)
	})

	it('пустой набор → 0', () => {
		expect(jaccardSimilarity([], ['a'])).toBe(0)
	})
})
