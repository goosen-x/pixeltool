import { describe, it, expect } from 'vitest'
import {
	convert,
	pairRate,
	POPULAR_CODES,
	RUB,
	rubPerUnit,
	sortRates,
	type Rate
} from '@/lib/utils/cbr-rates'

const usd: Rate = { code: 'USD', name: 'Доллар США', nominal: 1, value: 80 }
const eur: Rate = { code: 'EUR', name: 'Евро', nominal: 1, value: 94 }
const jpy: Rate = { code: 'JPY', name: 'Иена', nominal: 100, value: 54 }

describe('rubPerUnit', () => {
	it('при номинале 1 курс не меняется', () => {
		expect(rubPerUnit(usd)).toBe(80)
	})

	it('номинал 100 делится — иначе иена вышла бы дороже доллара', () => {
		expect(rubPerUnit(jpy)).toBeCloseTo(0.54, 9)
		expect(rubPerUnit(jpy)).toBeLessThan(rubPerUnit(usd))
	})

	it('рубль сам к себе равен единице', () => {
		expect(rubPerUnit(RUB)).toBe(1)
	})
})

describe('convert', () => {
	it('в рубли', () => {
		expect(convert(10, usd, RUB)).toBeCloseTo(800, 9)
	})

	it('из рублей', () => {
		expect(convert(800, RUB, usd)).toBeCloseTo(10, 9)
	})

	it('кросс-курс через рубль', () => {
		// 100 долларов = 8000 рублей = 8000/94 евро
		expect(convert(100, usd, eur)).toBeCloseTo(8000 / 94, 9)
	})

	it('перевод туда и обратно возвращает исходное', () => {
		const there = convert(1234.56, usd, eur)
		expect(convert(there, eur, usd)).toBeCloseTo(1234.56, 6)
	})

	it('валюта сама в себя не меняет сумму', () => {
		expect(convert(500, jpy, jpy)).toBeCloseTo(500, 9)
	})

	it('номинал учитывается в обе стороны', () => {
		// 10000 иен = 5400 рублей
		expect(convert(10000, jpy, RUB)).toBeCloseTo(5400, 6)
	})

	it('нечисло не ломает расчёт', () => {
		expect(convert(NaN, usd, eur)).toBe(0)
	})
})

describe('pairRate', () => {
	it('курс пары обратен встречному', () => {
		expect(pairRate(usd, eur) * pairRate(eur, usd)).toBeCloseTo(1, 9)
	})

	it('курс доллара к рублю равен его значению', () => {
		expect(pairRate(usd, RUB)).toBeCloseTo(80, 9)
	})
})

describe('sortRates', () => {
	it('ходовые валюты идут первыми и в заданном порядке', () => {
		const misc: Rate = {
			code: 'AMD',
			name: 'Армянский драм',
			nominal: 100,
			value: 21
		}
		const sorted = sortRates([misc, eur, usd])
		expect(sorted.map(r => r.code)).toEqual(['USD', 'EUR', 'AMD'])
	})

	it('остальные по алфавиту названия', () => {
		const a: Rate = { code: 'AAA', name: 'Ястреб', nominal: 1, value: 1 }
		const b: Rate = { code: 'BBB', name: 'Аист', nominal: 1, value: 1 }
		expect(sortRates([a, b]).map(r => r.name)).toEqual(['Аист', 'Ястреб'])
	})

	it('исходный массив не мутируется', () => {
		const input = [eur, usd]
		sortRates(input)
		expect(input[0].code).toBe('EUR')
	})

	it('список ходовых не пуст и содержит доллар с евро', () => {
		expect(POPULAR_CODES).toContain('USD')
		expect(POPULAR_CODES).toContain('EUR')
	})
})
