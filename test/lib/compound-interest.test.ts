import { describe, it, expect } from 'vitest'
import {
	simulate,
	toYearRows,
	type SimulationInput
} from '@/lib/utils/compound-interest'

const base: SimulationInput = {
	principal: 100000,
	annualRatePercent: 18,
	years: 5,
	monthlyContribution: 10000,
	capitalizationsPerYear: 12
}

const run = (patch: Partial<SimulationInput> = {}) =>
	simulate({ ...base, ...patch })!

describe('simulate', () => {
	it('без срока расчёта нет', () => {
		expect(simulate({ ...base, years: 0 })).toBeNull()
	})

	it('отрицательные суммы отвергаются', () => {
		expect(simulate({ ...base, principal: -1 })).toBeNull()
		expect(simulate({ ...base, monthlyContribution: -1 })).toBeNull()
	})

	it('при нулевой ставке итог равен сумме взносов', () => {
		const result = run({ annualRatePercent: 0 })
		expect(result.interestEarned).toBeCloseTo(0, 6)
		expect(result.finalAmount).toBeCloseTo(result.totalContributed, 6)
	})

	it('без пополнений работает как обычный вклад', () => {
		// Годовая капитализация, 10% на 1 год: ровно 110 000
		const result = run({
			principal: 100000,
			annualRatePercent: 10,
			years: 1,
			monthlyContribution: 0,
			capitalizationsPerYear: 1
		})
		expect(result.finalAmount).toBeCloseTo(110000, 4)
		expect(result.totalContributed).toBe(100000)
	})

	it('за два года годовая капитализация даёт квадрат множителя', () => {
		const result = run({
			principal: 100000,
			annualRatePercent: 10,
			years: 2,
			monthlyContribution: 0,
			capitalizationsPerYear: 1
		})
		expect(result.finalAmount).toBeCloseTo(121000, 2)
	})

	it('чем чаще капитализация, тем больше итог', () => {
		const yearly = run({ monthlyContribution: 0, capitalizationsPerYear: 1 })
		const quarterly = run({ monthlyContribution: 0, capitalizationsPerYear: 4 })
		const monthly = run({ monthlyContribution: 0, capitalizationsPerYear: 12 })
		const daily = run({ monthlyContribution: 0, capitalizationsPerYear: 365 })

		expect(quarterly.finalAmount).toBeGreaterThan(yearly.finalAmount)
		expect(monthly.finalAmount).toBeGreaterThan(quarterly.finalAmount)
		expect(daily.finalAmount).toBeGreaterThan(monthly.finalAmount)
	})

	it('внесено = начальная сумма плюс все пополнения', () => {
		const result = run()
		// 5 лет по 10 000 в месяц — 60 пополнений
		expect(result.totalContributed).toBe(100000 + 60 * 10000)
	})
})

describe('помесячная разбивка', () => {
	it('строк столько же, сколько месяцев в сроке', () => {
		expect(run({ years: 5 }).months).toHaveLength(60)
		expect(run({ years: 1 }).months).toHaveLength(12)
	})

	it('последняя строка сходится с итогом', () => {
		const result = run()
		const last = result.months[result.months.length - 1]

		expect(last.balance).toBeCloseTo(result.finalAmount, 6)
		expect(last.totalContributed).toBeCloseTo(result.totalContributed, 6)
		expect(last.totalInterest).toBeCloseTo(result.interestEarned, 6)
	})

	it('приросты по месяцам складываются в итоговые суммы', () => {
		const result = run()
		const contributed = result.months.reduce((s, r) => s + r.contributed, 0)
		const interest = result.months.reduce((s, r) => s + r.interest, 0)

		// Начальная сумма приростом не считается — она уже на счёте до первого месяца
		expect(contributed + base.principal).toBeCloseTo(result.totalContributed, 6)
		expect(interest).toBeCloseTo(result.interestEarned, 6)
	})

	it('баланс на каждом шаге равен внесённому плюс доход', () => {
		for (const row of run().months) {
			expect(row.balance).toBeCloseTo(
				row.totalContributed + row.totalInterest,
				6
			)
		}
	})

	it('баланс не убывает при положительной ставке', () => {
		const rows = run().months
		for (let i = 1; i < rows.length; i++) {
			expect(rows[i].balance).toBeGreaterThan(rows[i - 1].balance)
		}
	})

	it('номера месяцев идут подряд, годы считаются по двенадцать', () => {
		const rows = run({ years: 3 }).months
		expect(rows.map(r => r.month)).toEqual(
			Array.from({ length: 36 }, (_, i) => i + 1)
		)
		expect(rows[0].year).toBe(1)
		expect(rows[11].year).toBe(1)
		expect(rows[12].year).toBe(2)
		expect(rows[35].year).toBe(3)
	})

	it('неполный срок закрывается хвостовой строкой, сходящейся с итогом', () => {
		const result = run({ years: 2.5 })
		const last = result.months[result.months.length - 1]
		expect(last.balance).toBeCloseTo(result.finalAmount, 6)
	})
})

describe('toYearRows', () => {
	it('сворачивает 60 месяцев в 5 лет', () => {
		expect(toYearRows(run({ years: 5 }).months)).toHaveLength(5)
	})

	it('годовые приросты равны сумме месячных', () => {
		const months = run({ years: 3 }).months
		const years = toYearRows(months)

		const monthsInterest = months.reduce((s, r) => s + r.interest, 0)
		const yearsInterest = years.reduce((s, r) => s + r.interest, 0)
		expect(yearsInterest).toBeCloseTo(monthsInterest, 6)
	})

	it('остаток года берётся с последнего его месяца', () => {
		const months = run({ years: 2 }).months
		const years = toYearRows(months)
		expect(years[0].balance).toBeCloseTo(months[11].balance, 6)
		expect(years[1].balance).toBeCloseTo(months[23].balance, 6)
	})
})
