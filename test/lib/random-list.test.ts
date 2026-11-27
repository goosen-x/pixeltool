import { describe, it, expect } from 'vitest'
import {
	formatList,
	parseItems,
	randomBelow,
	sameOrder,
	shuffle
} from '@/lib/random-list'

describe('parseItems', () => {
	it('режет по строкам, в том числе виндовым, и выкидывает пустые', () => {
		expect(parseItems('Аня\r\n  Боря \n\n\rВика\n')).toEqual([
			'Аня',
			'Боря',
			'Вика'
		])
	})

	it('одна строка через запятую становится списком', () => {
		expect(parseItems('Аня, Боря,Вика,')).toEqual(['Аня', 'Боря', 'Вика'])
	})

	it('точка с запятой важнее запятой', () => {
		expect(parseItems('Иванов, И.; Петров, П.')).toEqual([
			'Иванов, И.',
			'Петров, П.'
		])
	})

	it('запятые внутри многострочного списка не трогает', () => {
		expect(parseItems('Москва, Россия\nПариж, Франция')).toEqual([
			'Москва, Россия',
			'Париж, Франция'
		])
	})

	it('пустой ввод', () => {
		expect(parseItems('  \n ')).toEqual([])
	})
})

describe('randomBelow', () => {
	it('отбрасывает значения из хвоста диапазона', () => {
		// 2^32 % 3 = 1, значит 2^32 - 1 попадает в хвост и должно быть пропущено
		const values = [2 ** 32 - 1, 7]
		expect(randomBelow(3, () => values.shift()!)).toBe(1)
	})
})

describe('shuffle', () => {
	it('сохраняет все элементы и не меняет исходный массив', () => {
		const src = Array.from({ length: 100 }, (_, i) => i)
		const out = shuffle(src)
		expect(src).toEqual(Array.from({ length: 100 }, (_, i) => i))
		expect([...out].sort((a, b) => a - b)).toEqual(src)
	})

	it('все 6 порядков из трёх элементов выпадают примерно поровну', () => {
		const counts = new Map<string, number>()
		const runs = 60_000
		for (let i = 0; i < runs; i++) {
			const key = shuffle(['a', 'b', 'c']).join('')
			counts.set(key, (counts.get(key) ?? 0) + 1)
		}
		expect(counts.size).toBe(6)
		for (const n of counts.values()) {
			expect(Math.abs(n - runs / 6)).toBeLessThan(runs * 0.01)
		}
	})

	it('10 000 элементов перемешивает быстро', () => {
		const src = Array.from({ length: 10_000 }, (_, i) => String(i))
		const t = performance.now()
		shuffle(src)
		expect(performance.now() - t).toBeLessThan(500)
	})
})

describe('sameOrder и formatList', () => {
	it('сравнивает порядок', () => {
		expect(sameOrder(['a', 'b'], ['a', 'b'])).toBe(true)
		expect(sameOrder(['a', 'b'], ['b', 'a'])).toBe(false)
	})

	it('нумерует по желанию', () => {
		expect(formatList(['x', 'y'], true)).toBe('1. x\n2. y')
		expect(formatList(['x', 'y'], false)).toBe('x\ny')
	})
})
