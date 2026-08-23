import { describe, it, expect } from 'vitest'
import { unitPairs } from '@/lib/constants/unit-pairs'
import { convert, getUnit, unitCategories } from '@/lib/constants/units'

describe('unitPairs', () => {
	it('слаги уникальны', () => {
		const slugs = unitPairs.map(p => p.slug)
		expect(new Set(slugs).size).toBe(slugs.length)
	})

	it('единицы каждой пары есть в её категории', () => {
		for (const pair of unitPairs) {
			expect(getUnit(pair.category, pair.from), pair.slug).toBeDefined()
			expect(getUnit(pair.category, pair.to), pair.slug).toBeDefined()
		}
	})

	it('у каждой пары заполнены мета, h1, интро и ровно 3 FAQ', () => {
		for (const pair of unitPairs) {
			expect(pair.faqs.length, pair.slug).toBe(3)
			expect(pair.intro.length, pair.slug).toBeGreaterThan(0)
			expect(pair.metaTitle.length, pair.slug).toBeGreaterThan(0)
			expect(pair.metaDescription.length, pair.slug).toBeGreaterThan(0)
			expect(pair.h1.length, pair.slug).toBeGreaterThan(0)
			for (const faq of pair.faqs) {
				expect(faq.question.length, pair.slug).toBeGreaterThan(0)
				expect(faq.answer.length, pair.slug).toBeGreaterThan(0)
			}
		}
	})

	// Правила контента: три абзаца в интро и никаких длинных тире в тексте
	// (в metaTitle/metaDescription они разрешены).
	it('интро из трёх абзацев и без длинных тире в тексте', () => {
		for (const pair of unitPairs) {
			expect(pair.intro.split('\n\n').length, pair.slug).toBe(3)

			const body = [
				pair.intro,
				...pair.faqs.flatMap(f => [f.question, f.answer])
			].join(' ')
			expect(body.includes('—'), pair.slug).toBe(false)
		}
	})
})

describe('unitCategories', () => {
	it('в каждой категории id единиц уникальны и есть базовая (toBase = identity)', () => {
		for (const category of unitCategories) {
			const ids = category.units.map(u => u.id)
			expect(new Set(ids).size, category.id).toBe(ids.length)
			expect(category.units.length, category.id).toBeGreaterThanOrEqual(2)
			expect(
				category.units.some(u => u.toBase(1) === 1),
				category.id
			).toBe(true)
		}
	})

	it('toBase и fromBase взаимно обратны', () => {
		for (const category of unitCategories) {
			for (const unit of category.units) {
				expect(
					unit.fromBase(unit.toBase(7)),
					`${category.id}.${unit.id}`
				).toBeCloseTo(7, 9)
			}
		}
	})
})

describe('коэффициенты новых единиц', () => {
	const cases: [
		Parameters<typeof convert>[0],
		string,
		string,
		number,
		number
	][] = [
		['length', 'cm', 'km', 100000, 1],
		['length', 'dm', 'mm', 1, 100],
		['length', 'nmi', 'km', 1, 1.852],
		['length', 'lightyear', 'km', 1, 9460730472580.8],
		['weight', 'kg', 'mg', 1, 1000000],
		['weight', 't', 'kg', 1, 1000],
		['weight', 'centner', 'kg', 1, 100],
		['weight', 'carat', 'g', 1, 0.2],
		['weight', 'lb', 'g', 1, 453.59237],
		['temperature', 'k', 'c', 273.15, 0],
		['temperature', 'k', 'c', 300, 26.85],
		['volume', 'cm3', 'ml', 1, 1],
		['volume', 'l', 'barrel', 158.987294928, 1],
		['volume', 'pint', 'l', 1, 0.56826125],
		['volume', 'cup', 'ml', 1, 250],
		['volume', 'tbsp', 'ml', 1, 15],
		['volume', 'gallon', 'ml', 1, 3785.411784],
		['area', 'ha', 'm2', 1, 10000],
		['area', 'm2', 'sotka', 100, 1],
		['area', 'mm2', 'm2', 1000000, 1],
		['area', 'mm2', 'cm2', 100, 1],
		['area', 'km2', 'm2', 1, 1000000],
		['area', 'dm2', 'm2', 100, 1],
		['area', 'acre', 'ha', 1, 0.40468564224],
		['speed', 'ms', 'kmh', 1, 3.6],
		['speed', 'knot', 'kmh', 1, 1.852],
		['energy', 'kcal', 'kj', 1, 4.184],
		['power', 'hp', 'kw', 1, 0.73549875],
		['force', 'n', 'kgf', 9.80665, 1],
		['force', 'kn', 'tonnef', 9.80665, 1],
		['angle', 'deg', 'rad', 180, Math.PI],
		['current', 'a', 'ma', 1, 1000],
		['pressure', 'mpa', 'atm', 1, 9.869232667160128],
		['pressure', 'mpa', 'bar', 1, 10],
		['pressure', 'mpa', 'at', 1, 10.197162129779283],
		['pressure', 'atm', 'mmhg', 1, 760],
		['pressure', 'atm', 'pa', 1, 101325],
		['pressure', 'psi', 'kpa', 1, 6.894757293168]
	]

	it.each(cases)('%s: %s → %s', (category, from, to, value, expected) => {
		const result = convert(category, from, to, value)
		expect(result).not.toBeNull()
		expect(result!).toBeCloseTo(expected, 9)
	})
})
