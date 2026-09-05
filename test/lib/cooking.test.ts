import { describe, it, expect } from 'vitest'
import {
	CONTAINERS,
	containersFor,
	describeAmount,
	getContainer,
	getProduct,
	gramsIn,
	PRODUCTS,
	tableFor
} from '@/lib/utils/cooking'

const flour = getProduct('flour')!
const sugar = getProduct('sugar')!
const water = getProduct('water')!
const glass250 = getContainer('glass-250')!
const glass200 = getContainer('glass-200')!
const tbsp = getContainer('tablespoon')!

describe('справочник', () => {
	it('идентификаторы уникальны', () => {
		expect(new Set(PRODUCTS.map(p => p.id)).size).toBe(PRODUCTS.length)
		expect(new Set(CONTAINERS.map(c => c.id)).size).toBe(CONTAINERS.length)
	})

	it('у всех продуктов положительная плотность', () => {
		for (const p of PRODUCTS) expect(p.density).toBeGreaterThan(0)
	})

	it('вода — единица плотности, это опорная точка', () => {
		expect(water.density).toBe(1)
	})

	it('сыпучие легче воды, мёд и соль тяжелее', () => {
		expect(flour.density).toBeLessThan(1)
		expect(getProduct('honey')!.density).toBeGreaterThan(1)
		expect(getProduct('salt')!.density).toBeGreaterThan(1)
	})

	it('неизвестный идентификатор не находится', () => {
		expect(getProduct('нет-такого')).toBeUndefined()
		expect(getContainer('нет-такого')).toBeUndefined()
	})
})

describe('граммы в ёмкости', () => {
	it('стакан 250 мл муки — привычные 160 грамм', () => {
		expect(gramsIn(flour, glass250)).toBeCloseTo(160, 6)
	})

	it('стакан 250 мл сахара — 200 грамм', () => {
		expect(gramsIn(sugar, glass250)).toBeCloseTo(200, 6)
	})

	it('гранёный 200 мл муки — 128 грамм', () => {
		expect(gramsIn(flour, glass200)).toBeCloseTo(128, 6)
	})

	it('стакан воды весит столько же, сколько его объём', () => {
		expect(gramsIn(water, glass250)).toBeCloseTo(250, 6)
		expect(gramsIn(water, glass200)).toBeCloseTo(200, 6)
	})

	it('согласованность: гранёный это ровно 0,8 от стакана 250', () => {
		for (const p of PRODUCTS) {
			expect(gramsIn(p, glass200)).toBeCloseTo(gramsIn(p, glass250) * 0.8, 9)
		}
	})

	it('согласованность: столовая ложка — ровно 1/15 стакана 250 мл', () => {
		for (const p of PRODUCTS) {
			expect(gramsIn(p, tbsp) * (250 / 15)).toBeCloseTo(gramsIn(p, glass250), 9)
		}
	})

	it('чайная ложка втрое меньше столовой', () => {
		const tsp = getContainer('teaspoon')!
		expect(gramsIn(flour, tbsp)).toBeCloseTo(gramsIn(flour, tsp) * 3, 9)
	})
})

describe('обратный счёт', () => {
	it('160 грамм муки — ровно один стакан 250 мл', () => {
		expect(containersFor(160, flour, glass250)).toBeCloseTo(1, 6)
	})

	it('круговой обход сходится', () => {
		for (const p of PRODUCTS) {
			for (const c of CONTAINERS) {
				const grams = gramsIn(p, c)
				expect(containersFor(grams, p, c)).toBeCloseTo(1, 9)
			}
		}
	})

	it('вдвое больше грамм — вдвое больше стаканов', () => {
		expect(containersFor(320, flour, glass250)).toBeCloseTo(2, 6)
	})
})

describe('describeAmount', () => {
	it('целые числа без дроби', () => {
		expect(describeAmount(1)).toBe('1')
		expect(describeAmount(3)).toBe('3')
	})

	it('четверти показываются дробью', () => {
		expect(describeAmount(0.25)).toBe('¼')
		expect(describeAmount(0.5)).toBe('½')
		expect(describeAmount(0.75)).toBe('¾')
		expect(describeAmount(1.5)).toBe('1 ½')
		expect(describeAmount(2.25)).toBe('2 ¼')
	})

	it('округляется до ближайшей четверти, а не до сотых', () => {
		expect(describeAmount(1.76)).toBe('1 ¾')
		expect(describeAmount(0.9)).toBe('1')
	})

	it('ноль и отрицательное', () => {
		expect(describeAmount(0)).toBe('0')
		expect(describeAmount(-1)).toBe('0')
	})
})

describe('таблица продукта', () => {
	it('строк столько же, сколько ёмкостей', () => {
		expect(tableFor(flour)).toHaveLength(CONTAINERS.length)
	})

	it('граммы убывают вместе с объёмом ёмкости', () => {
		const rows = tableFor(flour)
		const sorted = [...rows].sort((a, b) => b.container.ml - a.container.ml)
		for (let i = 1; i < sorted.length; i++) {
			expect(sorted[i].grams).toBeLessThan(sorted[i - 1].grams)
		}
	})
})
