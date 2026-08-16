import { describe, it, expect } from 'vitest'
import {
	daysBetween,
	yearsMonthsDaysBetween,
	businessDaysBetween
} from '@/lib/utils/date-difference'

describe('daysBetween', () => {
	it('золотой пример из planetcalc: 2021-09-01 → 2026-08-16 = 1810 дней', () => {
		expect(daysBetween(new Date(2021, 8, 1), new Date(2026, 7, 16))).toBe(1810)
	})

	it('порядок дат не важен — результат положительный', () => {
		const a = new Date(2026, 0, 1)
		const b = new Date(2026, 0, 10)
		expect(daysBetween(a, b)).toBe(9)
		expect(daysBetween(b, a)).toBe(9)
	})

	it('одна и та же дата — ноль дней', () => {
		const d = new Date(2026, 5, 15)
		expect(daysBetween(d, d)).toBe(0)
	})

	it('переход через високосный год считается верно', () => {
		// 2024 — високосный, 29 февраля есть
		expect(daysBetween(new Date(2024, 1, 28), new Date(2024, 2, 1))).toBe(2)
	})
})

describe('yearsMonthsDaysBetween', () => {
	it('золотой пример из planetcalc: 4 года, 11 месяцев, 15 дней', () => {
		expect(
			yearsMonthsDaysBetween(new Date(2021, 8, 1), new Date(2026, 7, 16))
		).toEqual({ years: 4, months: 11, days: 15 })
	})

	it('ровно один месяц', () => {
		expect(
			yearsMonthsDaysBetween(new Date(2026, 0, 15), new Date(2026, 1, 15))
		).toEqual({ years: 0, months: 1, days: 0 })
	})

	it('ровно один год', () => {
		expect(
			yearsMonthsDaysBetween(new Date(2025, 3, 10), new Date(2026, 3, 10))
		).toEqual({ years: 1, months: 0, days: 0 })
	})

	it('одна и та же дата — всё по нулям', () => {
		const d = new Date(2026, 5, 15)
		expect(yearsMonthsDaysBetween(d, d)).toEqual({
			years: 0,
			months: 0,
			days: 0
		})
	})

	it('порядок дат не важен', () => {
		const a = new Date(2020, 0, 1)
		const b = new Date(2023, 5, 20)
		expect(yearsMonthsDaysBetween(a, b)).toEqual(yearsMonthsDaysBetween(b, a))
	})
})

describe('businessDaysBetween', () => {
	it('понедельник → пятница той же недели: 4 будних дня', () => {
		// 2026-08-17 пн, 2026-08-21 пт
		expect(
			businessDaysBetween(new Date(2026, 7, 17), new Date(2026, 7, 21))
		).toBe(4)
	})

	it('понедельник → понедельник следующей недели: 5 будних дней', () => {
		expect(
			businessDaysBetween(new Date(2026, 7, 17), new Date(2026, 7, 24))
		).toBe(5)
	})

	it('суббота → воскресенье: 0 будних дней', () => {
		// 2026-08-22 сб, 2026-08-23 вс
		expect(
			businessDaysBetween(new Date(2026, 7, 22), new Date(2026, 7, 23))
		).toBe(0)
	})

	it('порядок дат не важен', () => {
		const a = new Date(2026, 7, 17)
		const b = new Date(2026, 7, 24)
		expect(businessDaysBetween(a, b)).toBe(businessDaysBetween(b, a))
	})

	it('одна и та же дата — ноль', () => {
		const d = new Date(2026, 7, 17)
		expect(businessDaysBetween(d, d)).toBe(0)
	})
})
