import { describe, it, expect } from 'vitest'
import {
	calculateTrip,
	consumptionPer100Km,
	rangeOnLiters,
	tripDistance,
	costPerPerson
} from '@/lib/utils/fuel-calculator'

describe('calculateTrip', () => {
	it('считает литры и стоимость поездки', () => {
		const result = calculateTrip(500, 8, 60)

		expect(result.liters).toBeCloseTo(40)
		expect(result.cost).toBeCloseTo(2400)
		expect(result.costPerKm).toBeCloseTo(4.8)
	})

	it('не делит на ноль при нулевом пробеге', () => {
		const result = calculateTrip(0, 8, 60)

		expect(result.liters).toBe(0)
		expect(result.costPerKm).toBe(0)
	})
})

describe('consumptionPer100Km', () => {
	it('считает расход по пробегу и заправке', () => {
		expect(consumptionPer100Km(450, 36)).toBeCloseTo(8)
	})

	it('возвращает ноль при нулевом пробеге', () => {
		expect(consumptionPer100Km(0, 36)).toBe(0)
	})
})

describe('rangeOnLiters', () => {
	it('считает запас хода', () => {
		expect(rangeOnLiters(50, 8)).toBeCloseTo(625)
	})

	it('возвращает ноль при нулевом расходе', () => {
		expect(rangeOnLiters(50, 0)).toBe(0)
	})
})

describe('tripDistance', () => {
	it('удваивает расстояние для поездки туда и обратно', () => {
		expect(tripDistance(350, true)).toBe(700)
		expect(tripDistance(350, false)).toBe(350)
	})

	it('стоимость поездки туда и обратно вдвое выше', () => {
		const result = calculateTrip(tripDistance(350, true), 7.5, 75)

		expect(result.liters).toBeCloseTo(52.5)
		expect(result.cost).toBeCloseTo(3937.5)
	})
})

describe('costPerPerson', () => {
	it('делит стоимость на всех в машине', () => {
		expect(costPerPerson(3000, 4)).toBeCloseTo(750)
	})

	it('не опускается ниже одного человека', () => {
		expect(costPerPerson(3000, 0)).toBe(3000)
		expect(costPerPerson(3000, 2.7)).toBe(1500)
	})
})
