import { describe, it, expect } from 'vitest'
import {
	CONTAINERS,
	containersFor,
	describeAmount,
	getContainer,
	containerLabel,
	containersOf,
	fallbackContainer,
	getProduct,
	gramsIn,
	parseAmount,
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

})

describe('ложки', () => {
	const tbspLevel = getContainer('tablespoon-level')!
	const tsp = getContainer('teaspoon')!
	const tspLevel = getContainer('teaspoon-level')!

	// Раньше ложка считалась из плотности как ровные 15 мл и подписывалась
	// «с горкой»: мука выходила 9,6 г вместо табличных 25.
	it('столовая ложка муки: 25 г с горкой, 15 без', () => {
		expect(gramsIn(flour, tbsp)).toBe(25)
		expect(gramsIn(flour, tbspLevel)).toBe(15)
	})

	it('сахар и соль сходятся с кухонными таблицами', () => {
		expect(gramsIn(sugar, tbsp)).toBe(25)
		expect(gramsIn(sugar, tbspLevel)).toBe(20)
		expect(gramsIn(getProduct('salt')!, tbsp)).toBe(30)
		expect(gramsIn(getProduct('salt')!, tsp)).toBe(10)
	})

	it('с горкой всегда тяжелее, чем без, и столовая тяжелее чайной', () => {
		for (const p of PRODUCTS.filter(p => p.spoons)) {
			expect(gramsIn(p, tbsp)).toBeGreaterThan(gramsIn(p, tbspLevel))
			expect(gramsIn(p, tsp)).toBeGreaterThan(gramsIn(p, tspLevel))
			expect(gramsIn(p, tbspLevel)).toBeGreaterThan(gramsIn(p, tspLevel))
			expect(gramsIn(p, tbsp)).toBeLessThan(gramsIn(p, glass200))
		}
	})

	it('жидкости в ложке считаются по объёму, без горки', () => {
		expect(gramsIn(water, tbspLevel)).toBeCloseTo(15, 9)
		expect(gramsIn(water, tspLevel)).toBeCloseTo(5, 9)
		expect(containersOf(water).some(c => c.heaped)).toBe(false)
		expect(containerLabel(tbspLevel, water)).toBe('Столовая ложка')
		expect(containerLabel(tbspLevel, flour)).toBe('Столовая ложка без горки')
	})

	it('ложка с горкой у жидкости заменяется той же ложкой без горки', () => {
		expect(fallbackContainer(tbsp, water).id).toBe('tablespoon-level')
		expect(fallbackContainer(tsp, water).id).toBe('teaspoon-level')
		expect(fallbackContainer(tbsp, flour).id).toBe('tablespoon')
	})
})

describe('обратный счёт', () => {
	it('160 грамм муки — ровно один стакан 250 мл', () => {
		expect(containersFor(160, flour, glass250)).toBeCloseTo(1, 6)
	})

	it('круговой обход сходится', () => {
		for (const p of PRODUCTS) {
			for (const c of containersOf(p)) {
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

	it('меньше четверти не превращается в ноль', () => {
		expect(describeAmount(0.1)).toBe('меньше ¼')
	})
})

describe('parseAmount', () => {
	it('десятичные с запятой и точкой', () => {
		expect(parseAmount('1,5')).toBe(1.5)
		expect(parseAmount('1.5')).toBe(1.5)
		expect(parseAmount(' 2 ')).toBe(2)
	})

	it('дроби из рецептов', () => {
		expect(parseAmount('1/2')).toBe(0.5)
		expect(parseAmount('1 1/2')).toBe(1.5)
		expect(parseAmount('3/4')).toBe(0.75)
	})

	it('единица после числа не мешает', () => {
		expect(parseAmount('250 г')).toBe(250)
		expect(parseAmount('250г')).toBe(250)
	})

	it('мусор и деление на ноль — null', () => {
		expect(parseAmount('')).toBeNull()
		expect(parseAmount('abc')).toBeNull()
		expect(parseAmount('1/0')).toBeNull()
		expect(parseAmount('-1')).toBeNull()
	})
})

describe('таблица продукта', () => {
	it('у сыпучих все ёмкости, у жидкостей без ложек с горкой', () => {
		expect(tableFor(flour)).toHaveLength(CONTAINERS.length)
		expect(tableFor(water)).toHaveLength(
			CONTAINERS.filter(c => !c.heaped).length
		)
	})

	// Десертная ложка без горки и чайная с горкой у разных продуктов меняются
	// местами, поэтому порядок проверяем без десертной.
	it('строки идут по убыванию веса', () => {
		for (const p of PRODUCTS) {
			const rows = tableFor(p).filter(r => r.container.id !== 'dessertspoon')
			for (let i = 1; i < rows.length; i++) {
				expect(rows[i].grams).toBeLessThan(rows[i - 1].grams)
			}
		}
	})
})
